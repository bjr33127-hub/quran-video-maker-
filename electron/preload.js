const { contextBridge, ipcRenderer } = require("electron");

async function fetchJson(path, options = {}) {
  const response = await fetch(`http://127.0.0.1:5500${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
}

contextBridge.exposeInMainWorld("qvmApp", {
  isElectron: true,
  getBatchStatus: () => fetchJson("/api/orchestrator/status"),
  startBatch: (config = {}) => fetchJson("/api/orchestrator/start", {
    method: "POST",
    body: JSON.stringify(config)
  }),
  stopBatch: () => fetchJson("/api/orchestrator/stop", {
    method: "POST",
    body: JSON.stringify({})
  }),
  pickPersonalizedAudio: () => ipcRenderer.invoke("qvm:pick-personalized-audio"),
  getPersonalizedGroqConfig: () => ipcRenderer.invoke("qvm:get-personalized-groq-config"),
  setPersonalizedGroqApiKey: (value = "") => ipcRenderer.invoke("qvm:set-personalized-groq-api-key", value),
  getPersonalizedImports: () => fetchJson("/api/personalized/imports").then((payload) => payload.imports || []),
  detectPersonalizedSurah: (config = {}) => fetchJson("/api/personalized/detect", {
    method: "POST",
    body: JSON.stringify(config)
  }).then((payload) => payload.detection),
  startPersonalizedImport: (config = {}) => fetchJson("/api/personalized/import", {
    method: "POST",
    body: JSON.stringify(config)
  }).then((payload) => payload.job),
  updatePersonalizedImport: (config = {}) => fetchJson("/api/personalized/update", {
    method: "POST",
    body: JSON.stringify(config)
  }).then((payload) => payload.job),
  deletePersonalizedImport: (id) => fetchJson("/api/personalized/delete", {
    method: "POST",
    body: JSON.stringify({ id })
  }),
  getPersonalizedImportStatus: (jobId) => fetchJson(`/api/personalized/status?jobId=${encodeURIComponent(jobId)}`).then((payload) => payload.job),
  renameRecordedFile: (config = {}) => ipcRenderer.invoke("qvm:rename-recorded-file", config)
});
