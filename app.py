"""
Server Flask (OPSIONAL) untuk template cafe.
Website sudah bisa dibuka langsung lewat index.html tanpa file ini.

Data cafe dan menu dibaca dari config.js, jadi cukup edit satu file itu saja.

Jalankan dengan: python app.py
"""
import json
from pathlib import Path

from flask import Flask, abort, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
CONFIG_FILE = BASE_DIR / "config.js"

# Hanya file dengan ekstensi ini (di folder yang sama) yang boleh dibuka browser
PUBLIC_EXT = {".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".gif"}

app = Flask(__name__, static_folder=None)


def load_data():
    """Baca data dari config.js (isinya berformat JSON di dalam variabel JS)."""
    text = CONFIG_FILE.read_text(encoding="utf-8")
    return json.loads(text[text.index("{"): text.rindex("}") + 1])


@app.route("/")
def index():
    """Halaman utama."""
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/api/menu")
def api_menu():
    """Endpoint JSON daftar menu. Opsional: /api/menu?category=Kopi"""
    try:
        menu = load_data()["menu"]
    except (ValueError, KeyError) as err:
        return jsonify({"error": f"config.js tidak valid: {err}"}), 500

    category = request.args.get("category")
    if category:
        menu = [m for m in menu if m["category"] == category]
    return jsonify(menu)


@app.route("/<path:filename>")
def public_file(filename):
    """Sajikan file HTML/CSS/JS/gambar yang ada di folder yang sama."""
    path = Path(filename)
    if path.name != filename or path.suffix.lower() not in PUBLIC_EXT:
        abort(404)
    if not (BASE_DIR / filename).is_file():
        abort(404)
    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    # debug=True hanya untuk pengembangan, matikan saat deploy
    app.run(host="0.0.0.0", port=5000, debug=True)
