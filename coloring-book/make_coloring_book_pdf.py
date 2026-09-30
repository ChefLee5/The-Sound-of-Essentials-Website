#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOE Rhythm Quest Coloring Book — Print PDF Builder
Stages the tracked line-art masters into art_print/ as print-resolution JPEGs,
then drives a headless Chromium browser to produce the letter-landscape print
PDF automatically (no manual print dialog).

Masters stay in web/public/assets/coloring-book/ so the website and this book
read the same art. Nothing here is ever written back to them.

Usage:
  py make_coloring_book_pdf.py            # stage art + build HTML + PDF
  py make_coloring_book_pdf.py --art      # stage art only
  py make_coloring_book_pdf.py --pdf      # build PDF from existing HTML
"""
import argparse
import http.server
import pathlib
import subprocess
import sys
import threading
import functools

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = pathlib.Path(__file__).resolve().parent
ART_MASTERS = BASE.parent / "web" / "public" / "assets" / "coloring-book"
ART_PRINT = BASE / "art_print"
HTML_OUT = BASE / "Rhythm_Quest_Coloring_Book_print.html"
PDF_OUT = BASE / "Rhythm_Quest_Coloring_Book_print.pdf"

BROWSER_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

# The art box on an 11x8.5in landscape sheet is ~9.4in wide, so 2600px is
# ~277 dpi printed -- past what a home printer resolves. The masters are
# 5504x3072; 38 of them unscaled is ~197 MB, which no browser will lay out.
MAX_WIDTH = 2600
JPEG_QUALITY = 92
PORT = 8643


def stage_art():
    """Mirror the tracked masters into art_print/ as resized JPEGs.
    Originals are never touched. Unchanged files are skipped by mtime."""
    from PIL import Image

    ART_PRINT.mkdir(exist_ok=True)
    fresh = rebuilt = 0
    before = after = 0

    sources = sorted(ART_MASTERS.glob("CB_*.png")) + sorted(ART_MASTERS.glob("cover-*.jpg"))
    if not sources:
        print(f"[FAIL] no masters found in {ART_MASTERS}")
        return None

    for src in sources:
        dest = (ART_PRINT / src.name).with_suffix(".jpg")
        before += src.stat().st_size

        if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
            fresh += 1
            after += dest.stat().st_size
            continue

        img = Image.open(src)
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[-1])
            img = bg
        else:
            img = img.convert("RGB")

        if img.width > MAX_WIDTH:
            h = round(img.height * MAX_WIDTH / img.width)
            # LANCZOS antialiases the downscale so line weight stays even
            # instead of going ragged.
            img = img.resize((MAX_WIDTH, h), Image.LANCZOS)

        # subsampling=0 (4:4:4): line art is all hard edges, and chroma
        # subsampling is exactly what smears them.
        img.save(dest, "JPEG", quality=JPEG_QUALITY, subsampling=0,
                 optimize=True, dpi=(300, 300))
        rebuilt += 1
        after += dest.stat().st_size

    print(f"[ok] art_print/ - {rebuilt} rebuilt, {fresh} already current "
          f"({before // 1048576} MB masters -> {after // 1048576} MB staged)")
    return rebuilt + fresh


def find_browser():
    for path in BROWSER_CANDIDATES:
        if pathlib.Path(path).exists():
            return path
    return None


def build_pdf():
    """Serve the folder over loopback and print it headlessly.

    file:// would be simpler, but Chromium applies stricter rules to local
    files and the run is less predictable; a throwaway loopback server makes
    the render identical to what a browser shows.
    """
    browser = find_browser()
    if not browser:
        print("[FAIL] no Chrome or Edge found; checked:")
        for p in BROWSER_CANDIDATES:
            print("  -", p)
        return False

    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        # log_message belongs to the handler, not the server -- silencing it
        # on the server object does nothing and the build spams 40 GET lines.
        def log_message(self, *args):
            pass

    handler = functools.partial(QuietHandler, directory=str(BASE))
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()

    try:
        subprocess.run([
            browser,
            "--headless",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={PDF_OUT}",
            "--virtual-time-budget=90000",
            f"http://127.0.0.1:{PORT}/{HTML_OUT.name}",
        ], check=True, capture_output=True, timeout=600)
    except subprocess.CalledProcessError as exc:
        print("[FAIL] browser exited non-zero:", exc.stderr.decode(errors="replace")[:400])
        return False
    except subprocess.TimeoutExpired:
        print("[FAIL] browser timed out")
        return False
    finally:
        httpd.shutdown()

    if not PDF_OUT.exists():
        print("[FAIL] no PDF produced")
        return False

    print(f"[ok] {PDF_OUT.name} - {PDF_OUT.stat().st_size // 1048576} MB")
    return True


def main():
    ap = argparse.ArgumentParser(description="Stage art and build the coloring book PDF.")
    ap.add_argument("--art", action="store_true", help="stage art only")
    ap.add_argument("--pdf", action="store_true", help="build PDF from existing HTML")
    args = ap.parse_args()

    if not args.pdf:
        if stage_art() is None:
            return 1
        if args.art:
            return 0

    if not args.pdf:
        result = subprocess.run([sys.executable, str(BASE / "generate_coloring_book.py")])
        if result.returncode != 0:
            return result.returncode

    if not HTML_OUT.exists():
        print(f"[FAIL] {HTML_OUT.name} not found - run generate_coloring_book.py first")
        return 1

    return 0 if build_pdf() else 1


if __name__ == "__main__":
    sys.exit(main())
