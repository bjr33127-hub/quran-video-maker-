# Quran Video Maker (Local) — OBS Template + Quran Player

Create clean Quran recitation videos **in horizontal or vertical format** using **OBS** + a **local web Quran player** (this repo).  
You choose the **surah / verse / reciter / translation**, then record directly from OBS.

**English** | [Français](README_FR.md)

---

## Project Contents

This project is split into 2 parts:

### 1) In this repository (code)
- Local web Quran player (runs via a small local server)
- Windows `.bat` file that helps install Python (if needed) + starts the server
- Player configuration / UI

### 2) In Releases (required assets)
For the OBS template to work properly, you must **download a “requirements” ZIP from the GitHub Releases**.

✅ The ZIP includes:
- ready-to-import **OBS scenes**
- the **media required** for the template (overlays, images, files used in the scene, etc.)

➡️ Go to the repository **Releases** tab and download the **requirements** ZIP (or the latest “Release asset”).

---
## Example Result (Video)

[![Quran Video Maker — demo video](https://img.youtube.com/vi/8JD5a_yC2qc/maxresdefault.jpg)](https://youtu.be/8JD5a_yC2qc?si=gjaUjsg5CeA9ecKf)

This demo shows a Quran recitation video made using:
- the **local Quran player** (surah/ayah/reciter/translation selection)
- the **OBS template** (overlay + clean layout)
- **horizontal/vertical-ready** workflow (record directly from OBS)

## Requirements

- **OBS Studio**
- **Python** (the launcher helps install it if missing)
- OBS plugin: **Vertical Canvas / Aitum Vertical**
- This repository + the “requirements” ZIP (from Releases)

---

## Download Links

### OBS Studio (official)
https://obsproject.com/download

### Vertical Plugin (Vertical Canvas / Aitum Vertical)
- Official page (OBS Resources): https://obsproject.com/forum/resources/aitum-vertical.1715/
- GitHub (source / builds): https://github.com/Aitum/obs-vertical-canvas

---

## Installation (step by step)

### Step 0 — Download the “requirements” ZIP (REQUIRED)

1. Open the repository on GitHub
2. Go to the **Releases** tab
3. Download the **requirements** ZIP
4. Extract it to a simple folder, for example:

`C:\Users\<you>\Downloads\Quran-Video-Maker-requirements\`

✅ Inside, you should see:
- an **OBS scene** file (e.g. `scene.json` or a scene folder)
- a **photos + videos** folder (or equivalent)

✅ **Step 0 done!**

---

### Step 1 — OBS Setup (Template + Vertical Canvas)

#### 1) Install OBS
1. Install **OBS Studio**: https://obsproject.com/download
2. Open OBS once (so it creates its folders)

#### 2) Install the vertical plugin (Aitum Vertical / Vertical Canvas)
1. Install the plugin: https://obsproject.com/forum/resources/aitum-vertical.1715/
2. Restart OBS

#### 3) Enable the “Vertical” dock
In OBS (top menu):
- **Docks** → enable **Aitum Vertical** (or “Vertical Canvas” depending on the version)

You should see a vertical dock/panel appear.

#### 4) Import the template scene (from the requirements ZIP)
1. In OBS:
   - **Scene Collection** → **Import**
2. Select the scene file provided in the ZIP (e.g. `scene.json`)
3. Confirm the import, then select the imported scene collection

#### 5) Check / relink media (if OBS reports missing files)
If OBS shows “Missing Files”:
1. Click **Search Directory**
2. Select the **photos + videos** folder from the requirements ZIP
3. Let OBS relink files automatically

✅ **Step 1 done!**

---

### Step 2 — Run the Quran player locally

1. In this repository, run:
   - **`instalationofpython + launch-server.bat`**
2. Follow the instructions:
   - If Python is not installed, the script guides you  
   - Important: check **“Add Python to PATH”** during installation
3. When the server is running, open your browser and go to:

**`http://localhost:5500/`**

✅ If the page opens, the player is ready.

✅ **Step 2 done!**

---

### Step 3 — Connect OBS to the player

*(Normally the template scene already contains the correct source, but if needed:)*

1. In OBS, select the **Window Capture** source (or “Browser”), then choose your browser window that has the player open

✅ **Step 3 done!**

---

### Step 4 — Record your video

1. Open OBS and select the template scene
2. In the player (web page), choose:
   - reciter
   - surah / verse
   - translation
3. In OBS:
   - Click **Start Recording**
4. Start playback in the player, wait until the end, then:
   - **Stop Recording**

✅ **That’s it!** 🎬

---

## Important Notes

- **Vibe-coded** project: very little code was written manually.
- Ayah **splitting** is an **approximation**.
- Translation **alignment** is also an **approximation**.
- It’s not perfect — contributions are welcome to improve it as much as possible.

---

## Contributing

Any help is welcome, especially on:
- better ayah **splitting / synchronization**
- better **word-by-word**
- more reliable translation alignment
- UI / performance improvements

To contribute:
1. Fork the repository
2. Create a branch
3. Open a PR with a clear description

---

## Troubleshooting

### The page won’t open
- Make sure the server `.bat` window is still open
- Try opening `http://localhost:5500/` manually
- Check `launcher_log.txt` (created next to the `.bat` file)

### OBS can’t find files (Missing Files)
- You probably didn’t extract the requirements ZIP, or selected the wrong folder
- In the “Missing Files” window, use **Search Directory** and select the ZIP’s media folder

### Vertical format doesn’t appear in OBS
- Make sure **Aitum Vertical / Vertical Canvas** is installed
- Enable it via **Docks** in OBS, then restart OBS

---

## Credits

- Quran text (tajwîd): Quran.com API
- Translations: QuranEnc
- Timings: Mp3Quran API

---

## License

This project is **Non-Commercial**:
you can use, modify, and share it, **but you can’t sell it or use it for profit**.

See: [LICENSE](LICENSE)
