# Long Live Kodak — Film Frame Generator

Add authentic-looking film frames to your photos in the browser. This is a single-file, dependency-free web app using HTML, CSS, and vanilla JavaScript with a canvas-based renderer and live controls.

## Features
* **Drag & Drop Upload** — Drop a photo or use the file picker.
* **Live Controls** — Tweak frame thickness, roughness, scratches, paper texture, edge variations, imperfections, and asymmetry.
* **Presets** — Minimal, Classic, Vintage, and Distressed.
* **High-Quality Output** — Download as PNG or JPG.
* **Offline & Dependency-Free** — Open the HTML file directly in a browser; no build step.

## Project Structure
* `kodak_frame_generator_v2.html` — Main page and UI markup (links to external CSS/JS).
* `style.css` — All extracted styles.
* `app.js` — All application logic and canvas rendering.
* `Readme.md` — This document.

## Getting Started
1. Open `kodak_frame_generator_v2.html` in your browser (double-click or drag into a tab).
2. Drop an image into the upload area or click to choose a file.
3. Adjust controls or select a preset.
4. Click Download (PNG/JPG) to save your framed photo.

Notes:
* Image files larger than ~10MB are rejected for performance.
* Works fully offline in modern browsers.

## Usage
1. **Upload** — Drag and drop or click the upload card to choose an image.
2. **Tweak** — Use the control sliders or pick a preset.
3. **Regenerate** — Click “Regenerate Frame” to randomize subtle variations.
4. **Download** — Choose PNG or JPG.
5. **New Image** — Start again with another upload.

## Controls
* **Thickness** — Base width of the film frame.
* **Roughness** — Micro-variations along the inner edge to mimic imperfect cuts.
* **Scratches** — Number of fine scratches on the frame area.
* **Paper Texture** — Amount of noise/texture within the black frame region.
* **Frame Variations** — Random minor width changes across the frame edges.
* **Edge Imperfections** — Organic dots/divots along outer borders.
* **Asymmetry** — Random imbalance between the four sides (top/right/bottom/left).

## Presets
* **Minimal** — Clean, subtle frame.
* **Classic** — Balanced film look (default).
* **Vintage** — Heavier wear and texture.
* **Distressed** — Strong imperfections and grit.

## Development
This app was refactored to separate concerns:
* Inline CSS moved to `style.css`.
* Inline JavaScript moved to `app.js`.
* `kodak_frame_generator_v2.html` now references these external files.

No build tooling is required. If desired, you can serve locally (optional):

```bash
python3 -m http.server 8041
# then open http://localhost:8041/kodak_frame_generator_v2.html
```

### Running on a VPS (port 8041)
```bash
# from the project directory
python3 -m http.server 8041 --bind 0.0.0.0
# then open http://<your-domain-or-ip>:8041/kodak_frame_generator_v2.html
```
* Ensure your firewall allows inbound TCP 8041.
* Optional: put Nginx/Caddy in front if you want TLS and a friendly URL.

### Using run.sh
```bash
./run.sh                      # serves on 0.0.0.0:8041
./run.sh 9000                 # serves on 0.0.0.0:9000
HOST=127.0.0.1 PORT=9000 ./run.sh
```
- On a VPS, ensure port 8041 is open in your firewall.
- Open http://<your-domain-or-ip>:8041/kodak_frame_generator_v2.html

### Docker
Build and run the container:
```bash
docker build -t longlivekodak .
docker run --rm -p 8041:8041 longlivekodak
# then open http://localhost:8041/kodak_frame_generator_v2.html
```

Notes:
* The container runs as a non-root user and serves static files on port 8041.
* `index.html` is symlinked to `kodak_frame_generator_v2.html` for convenience.

### Docker Compose
One-step startup with Compose v2:
```bash
docker compose up -d
# then open http://localhost:8041/kodak_frame_generator_v2.html
```
Stop the stack:
```bash
docker compose down
```
Change the external port by editing `docker-compose.yml`:
```yaml
ports:
  - "8041:8041"  # change the left side to your desired host port
```

## License
MIT
