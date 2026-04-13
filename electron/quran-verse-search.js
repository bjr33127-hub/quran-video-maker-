const {
  LRUCache,
  buildInvertedIndex,
  createArabicFuseSearch,
  loadMorphology,
  loadQuranData,
  loadWordMap,
  normalizeArabic,
  search
} = require("quran-search-engine");

const SEARCH_OPTIONS = Object.freeze({
  fuzzy: true,
  lemma: true,
  root: true,
  semantic: false
});

const SEARCH_PAGINATION = Object.freeze({
  page: 1,
  limit: 6
});

const SEARCH_CACHE = new LRUCache(160);

let enginePromise = null;

function clampNumber(value, min, max, fallback = min) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(min, Math.min(max, num));
}

async function loadEngine() {
  if (!enginePromise) {
    enginePromise = (async () => {
      const [quranData, morphologyMap, wordMap] = await Promise.all([
        loadQuranData(),
        loadMorphology(),
        loadWordMap()
      ]);
      const verses = [...quranData.values()];
      const invertedIndex = buildInvertedIndex(morphologyMap, quranData);
      const fuseIndex = createArabicFuseSearch(verses, ["standard", "uthmani"]);
      return {
        context: { quranData, morphologyMap, wordMap, invertedIndex },
        fuseIndex
      };
    })().catch((error) => {
      enginePromise = null;
      throw error;
    });
  }
  return enginePromise;
}

function normalizeWords(words) {
  return (Array.isArray(words) ? words : [])
    .map((word) => normalizeArabic(String(word || "").trim()))
    .filter(Boolean);
}

function buildQueryVariants(words) {
  const normalized = normalizeWords(words);
  const variants = [];
  const seen = new Set();
  const addVariant = (start, length) => {
    if (start < 0 || length < 2 || start >= normalized.length) return;
    const slice = normalized.slice(start, start + length);
    if (slice.length < 2) return;
    const key = `${start}:${slice.join(" ")}`;
    if (seen.has(key)) return;
    seen.add(key);
    variants.push({
      start,
      words: slice,
      query: slice.join(" ")
    });
  };

  const prefixLengths = [2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
  for (const length of prefixLengths) addVariant(0, length);

  const shortStarts = [1, 2];
  const shortLengths = [2, 3, 4, 5, 6];
  for (const start of shortStarts) {
    for (const length of shortLengths) addVariant(start, length);
  }

  if (normalized.length >= 10) {
    const middle = Math.max(0, Math.floor((normalized.length - 6) / 2));
    for (const start of [middle]) {
      for (const length of [4, 6]) addVariant(start, length);
    }
  }

  return variants.slice(0, 28);
}

function computeVariantWeight(variant) {
  const tokenCount = Array.isArray(variant?.words) ? variant.words.length : 0;
  let weight = Math.min(2.4, 0.7 + (tokenCount * 0.17));
  const start = Number(variant?.start || 0);
  if (start === 0) weight *= 1.45;
  else if (start === 1) weight *= 0.72;
  else if (start === 2) weight *= 0.52;
  else weight *= 0.35;
  if (tokenCount >= 6) weight += 0.16;
  return weight;
}

function computeNormalizedHit(result, tokenCount) {
  const maxExactScore = Math.max(3, tokenCount * 3);
  const normalized = clampNumber(Number(result?.matchScore || 0) / maxExactScore, 0, 1, 0);
  const matchedTokens = Array.isArray(result?.matchedTokens) ? result.matchedTokens.length : 0;
  return {
    matchedTokens,
    normalized
  };
}

function detectBestAyahRange(ayahScores) {
  const entries = [...ayahScores.entries()]
    .map(([ayah, score]) => ({ ayah: Number(ayah), score: Number(score || 0) }))
    .filter((entry) => Number.isFinite(entry.ayah) && entry.ayah > 0 && entry.score > 0)
    .sort((a, b) => a.ayah - b.ayah);

  if (!entries.length) return { startAyah: 0, endAyah: 0, uniqueAyahs: 0 };

  let best = {
    startAyah: entries[0].ayah,
    endAyah: entries[0].ayah,
    totalScore: entries[0].score,
    uniqueAyahs: 1
  };

  let current = {
    startAyah: entries[0].ayah,
    endAyah: entries[0].ayah,
    totalScore: entries[0].score,
    uniqueAyahs: 1
  };

  for (let index = 1; index < entries.length; index += 1) {
    const entry = entries[index];
    const previous = entries[index - 1];
    if (entry.ayah <= (previous.ayah + 1)) {
      current.endAyah = entry.ayah;
      current.totalScore += entry.score;
      current.uniqueAyahs += 1;
    } else {
      if (current.totalScore > best.totalScore) best = { ...current };
      current = {
        startAyah: entry.ayah,
        endAyah: entry.ayah,
        totalScore: entry.score,
        uniqueAyahs: 1
      };
    }
  }

  if (current.totalScore > best.totalScore) best = { ...current };
  return best;
}

function summarizeCandidates(hitBuckets) {
  const candidates = [];
  for (const bucket of hitBuckets.values()) {
    const range = detectBestAyahRange(bucket.ayahScores);
    const runnerUpPenalty = Math.min(0.8, bucket.maxNormalized * 0.35);
    const score = (
      (bucket.totalScore * 0.55)
      + (bucket.prefixScore * 1.25)
      + (bucket.maxNormalized * 1.1)
      + (Math.min(4, bucket.hitCount) * 0.12)
      + (Math.min(3, range.uniqueAyahs) * 0.12)
      - runnerUpPenalty
    );
    candidates.push({
      surah: bucket.surah,
      score,
      confidenceHint: bucket.maxNormalized,
      hitCount: bucket.hitCount,
      startAyah: range.startAyah || bucket.bestAyah || 0,
      endAyah: range.endAyah || bucket.bestAyah || 0
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}

async function detectVerseRangeFromWords(words) {
  const normalizedWords = normalizeWords(words);
  if (normalizedWords.length < 2) {
    throw new Error("Pas assez de mots reconnus pour lancer la recherche de versets.");
  }

  const { context, fuseIndex } = await loadEngine();
  const variants = buildQueryVariants(normalizedWords);
  const hitBuckets = new Map();

  for (const variant of variants) {
    const variantWeight = computeVariantWeight(variant);
    const response = search(
      variant.query,
      context,
      SEARCH_OPTIONS,
      SEARCH_PAGINATION,
      fuseIndex,
      SEARCH_CACHE
    );

    for (const result of response?.results || []) {
      const { matchedTokens, normalized } = computeNormalizedHit(result, variant.words.length);
      if (!Number.isFinite(normalized) || normalized <= 0) continue;
      if (String(result?.matchType || "none") === "none") continue;
      if (matchedTokens < Math.min(2, variant.words.length)) continue;
      if (normalized < (variant.words.length <= 3 ? 0.34 : 0.45)) continue;

      const surah = Number(result?.sura_id || 0);
      const ayah = Number(result?.aya_id || 0);
      if (!(surah > 0) || !(ayah > 0)) continue;

      let bucket = hitBuckets.get(surah);
      if (!bucket) {
        bucket = {
          surah,
          totalScore: 0,
          prefixScore: 0,
          maxNormalized: 0,
          hitCount: 0,
          bestAyah: ayah,
          ayahScores: new Map()
        };
        hitBuckets.set(surah, bucket);
      }

      const typeWeight = String(result?.matchType || "") === "exact" ? 1.2 : 0.95;
      const hitScore = normalized * variantWeight * typeWeight;
      bucket.totalScore += hitScore;
      if (Number(variant.start || 0) === 0) {
        bucket.prefixScore += hitScore;
      }
      bucket.hitCount += 1;
      if (normalized > bucket.maxNormalized) {
        bucket.maxNormalized = normalized;
        bucket.bestAyah = ayah;
      }
      bucket.ayahScores.set(ayah, Number(bucket.ayahScores.get(ayah) || 0) + hitScore);
    }
  }

  const candidates = summarizeCandidates(hitBuckets);
  if (!candidates.length) {
    throw new Error("Aucune correspondance de verset fiable n'a ete trouvee.");
  }

  const top = candidates[0];
  const runnerUp = candidates[1] || null;
  const rawMargin = top.score - Number(runnerUp?.score || 0);
  const marginRatio = clampNumber(rawMargin / Math.max(top.score || 1, 1), 0, 1, 0);
  const confidence = clampNumber(
    (top.confidenceHint * 0.50)
      + (Math.min(5, top.hitCount) / 5) * 0.10
      + (marginRatio * 0.40),
    0,
    1,
    0
  );
  const message = (
    top.startAyah && top.endAyah
      ? (
        top.startAyah === top.endAyah
          ? `${confidence >= 0.65 ? "Sourate detectee" : "Sourate suggeree"}: ${top.surah} (ayah ${top.startAyah}).`
          : `${confidence >= 0.65 ? "Sourate detectee" : "Sourate suggeree"}: ${top.surah} (ayahs ${top.startAyah}-${top.endAyah}).`
      )
      : `${confidence >= 0.65 ? "Sourate detectee" : "Sourate suggeree"}: ${top.surah}.`
  );

  return {
    surah: top.surah,
    startAyah: top.startAyah,
    endAyah: top.endAyah,
    confidence,
    score: clampNumber(top.confidenceHint, 0, 1, 0),
    margin: marginRatio,
    topCandidates: candidates.slice(0, 5).map((candidate) => ({
      surah: candidate.surah,
      startAyah: candidate.startAyah,
      endAyah: candidate.endAyah,
      score: clampNumber(candidate.confidenceHint, 0, 1, 0),
      hitCount: candidate.hitCount
    })),
    message
  };
}

module.exports = {
  detectVerseRangeFromWords
};
