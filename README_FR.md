# Quran Video Maker (Local) — Template OBS + Lecteur Quran

Crée des vidéos de récitation du Coran **propres en horizontal ou vertical** avec **OBS** + un **lecteur web local** (ce dépôt).  
Tu choisis la **sourate / le verset / le récitateur / la traduction**, puis tu enregistres directement depuis OBS.

[English](README.md) | **Français**

---

## Contenu du projet

Ce projet est séparé en 2 parties :

### 1) Dans ce dépôt (code)
- Lecteur Quran web local (lancé via un petit serveur)
- Fichier `.bat` Windows qui aide à installer Python (si besoin) + lance le serveur
- Configuration / UI du lecteur

### 2) Dans les Releases (assets requis)
Pour que le template OBS fonctionne correctement, tu dois **télécharger un ZIP “requirements” depuis les Releases**.

✅ Le ZIP contient :
- les **scènes OBS** prêtes à importer
- les **médias nécessaires** au template (overlays, images, fichiers utilisés dans la scène, etc.)

➡️ Va dans l’onglet **Releases** du dépôt et télécharge le ZIP **requirements** (ou le dernier “Release asset”).

---

## Pré-requis

- **OBS Studio**
- **Python** (le launcher aide à l’installer si absent)
- Plugin OBS : **Vertical Canvas / Aitum Vertical**
- Ce dépôt + le ZIP “requirements” (Releases)

---

## Liens de téléchargement

### OBS Studio (officiel)
https://obsproject.com/download

### Plugin Vertical (Vertical Canvas / Aitum Vertical)
- Page officielle (OBS Resources) : https://obsproject.com/forum/resources/aitum-vertical.1715/
- GitHub (sources / builds) : https://github.com/Aitum/obs-vertical-canvas

---

## Installation (pas à pas)

### Étape 0 — Télécharger le ZIP “requirements” (OBLIGATOIRE)

1. Ouvre le dépôt sur GitHub
2. Va dans l’onglet **Releases**
3. Télécharge le ZIP **requirements**
4. Dézippe-le dans un dossier simple, par exemple :

`C:\Users\<toi>\Downloads\Quran-Video-Maker-requirements\`

✅ Tu dois voir à l’intérieur :
- un fichier de **scène OBS** (ex: `scene.json` ou un dossier scène)
- un dossier **media/assets** (ou équivalent)

✅ **Étape 0 terminée !**

---

### Étape 1 — Configuration OBS (Template + Vertical Canvas)

#### 1) Installer OBS
1. Installe **OBS Studio** : https://obsproject.com/download
2. Ouvre OBS une première fois (pour qu’il crée ses dossiers)

#### 2) Installer le plugin vertical (Aitum Vertical / Vertical Canvas)
1. Installe le plugin : https://obsproject.com/forum/resources/aitum-vertical.1715/
2. Redémarre OBS

#### 3) Activer le dock “Vertical”
Dans OBS (menu du haut) :
- **Docks** → activer **Aitum Vertical** (ou “Vertical Canvas” selon version)

Tu dois voir apparaître un panneau/dock vertical.

#### 4) Importer la scène template (depuis le ZIP requirements)
1. Dans OBS :
   - **Scene Collection** → **Import** (ou “Importer”)
2. Sélectionne le fichier de scène fourni dans le ZIP (ex: `scene.json`)
3. Valide l’import puis sélectionne la scène importée

#### 5) Vérifier / relier les médias (si OBS demande des fichiers manquants)
Si OBS affiche “Missing Files” (fichiers manquants) :
1. Clique sur **Search Directory** (ou “Rechercher un dossier”)
2. Choisis le dossier **photos + videos** du ZIP requirements
3. Laisse OBS relier automatiquement les fichiers

✅ **Étape 1 terminée !**

---

### Étape 2 — Lancer le lecteur Quran en local

1. Dans ce dépôt, lance :
   - **`instalationofpython + launch-server.bat`**
2. Suis les instructions :
   - Si Python n’est pas installé, le script te guide  
   - Important : cocher **“Add Python to PATH”** pendant l’installation
3. Quand le serveur est lancé, ouvre ton navigateur et va sur :

**`http://localhost:5500/`**

✅ Si la page s’ouvre, le lecteur est prêt.

✅ **Étape 2 terminée !**

---

### Étape 3 — Relier OBS au lecteur 

*(Normalement la scène du template contient déjà la source, mais si besoin :)*

1. Dans OBS, sélectionne la source **capture de fenêtre** (ou “Navigateur”) puis choisis la fenêtre de ton navigateur avec le lecteur 

✅ **Étape 3 terminée !**

---

### Étape 4 — Enregistrer ta vidéo

1. Ouvre OBS et place-toi sur la scène du template
2. Dans le lecteur (page web), choisis :
   - le récitateur
   - la sourate / le verset
   - la traduction
3. Dans OBS :
   - Clique **Start Recording** (Démarrer l’enregistrement)
4. Lance la lecture dans le lecteur, attends la fin, puis :
   - **Stop Recording**

✅ **C’est tout !** 🎬

---

## Notes importantes

- Projet **vibe-codé** : très peu de code écrit manuellement.
- La **découpe des ayat** est une **approximation**.
- L’**alignement de la traduction** est aussi une **approximation**.
- Ce n’est pas parfait — j’attends vos **contributions** pour améliorer au maximum.

---

## Contribuer

Toute aide est la bienvenue, notamment sur :
- meilleure **découpe / synchronisation** des ayat
- meilleur **mot à mot**
- alignement traduction plus fiable
- amélioration UI / performance

Pour contribuer :
1. Fork le dépôt
2. Crée une branche
3. Ouvre une PR avec une description claire

---

## Dépannage

### La page ne s’ouvre pas
- Vérifie que la fenêtre `.bat` du serveur est toujours ouverte
- Essaie d’ouvrir `http://localhost:5500/` manuellement
- Regarde `launcher_log.txt` (créé à côté du fichier `.bat`)

### OBS ne trouve pas les fichiers (Missing Files)
- Tu n’as probablement pas dézippé le ZIP requirements, ou pas pointé vers le bon dossier
- Dans la fenêtre “Missing Files”, utilise **Search Directory** et sélectionne le dossier `media/assets` du ZIP

### Le format vertical n’apparaît pas dans OBS
- Vérifie que **Aitum Vertical / Vertical Canvas** est bien installé
- Active-le via **Docks** dans OBS, puis redémarre OBS

---

## Crédits

- Texte du Coran (tajwîd) : API Quran.com
- Traductions : QuranEnc
- Timings : API Mp3Quran

---

## Licence

Ce projet est sous licence **Non-Commerciale** :
tu peux l’utiliser, le modifier et le partager, **mais tu ne peux pas le vendre ni l’utiliser à but lucratif**.

Voir : [LICENSE](LICENSE)
