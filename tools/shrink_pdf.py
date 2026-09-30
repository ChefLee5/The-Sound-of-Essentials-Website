#!/usr/bin/env python3
"""
shrink_pdf.py — get SOE fulfillment PDFs under a size cap.

Two independent passes, both optional:

  --dedupe    LOSSLESS. Finds image streams with byte-identical content and
              repoints every reference at a single copy. Chromium re-embeds the
              same asset once per placement, so a book that reuses hero art on
              every page carries dozens of copies of it. Costs nothing visually.

  --requant   LOSSY. Re-encodes images: line art (few distinct greys) is
              converted to greyscale, photos are re-encoded at --quality.
              Skips any image it cannot make smaller.

Two modifiers for --requant, both off by default so existing invocations
behave exactly as before:

  --recode-lossless   Also re-encode FlateDecode/LZW images as JPEG. Without
              this, --requant only touches images that are already JPEG, so a
              book exported by a browser's "Save as PDF" — which emits raw
              Flate bitmaps — comes out completely unchanged.

  --max-dim N Downsample any image whose longest side exceeds N pixels.
              300 dpi on US Letter is 2550x3300; a screen deliverable does not
              need it. Updates /Width and /Height to match.

Never writes over the input. Usage:

  python shrink_pdf.py in.pdf out.pdf --dedupe
  python shrink_pdf.py in.pdf out.pdf --dedupe --requant --quality 82
  python shrink_pdf.py in.pdf out.pdf --requant --recode-lossless --max-dim 1440
  python shrink_pdf.py in.pdf out.pdf --split 3        # -> out_part1.pdf ...
"""
import argparse, hashlib, io, os, sys, collections

try:
    import pikepdf
    from PIL import Image
except ImportError as e:
    sys.exit(f"missing dependency: {e}. Need: pip install pikepdf pillow")


def mb(n): return n / 1048576


def iter_images(pdf):
    for obj in pdf.objects:
        if not isinstance(obj, pikepdf.Stream):
            continue
        try:
            if obj.get("/Subtype") == "/Image":
                yield obj
        except Exception:
            continue


def dedupe(pdf, log=print):
    """Repoint byte-identical image streams at one canonical object."""
    canon = {}          # sha1 -> canonical object
    remap = {}          # objgen -> canonical object
    dup_bytes = 0
    for obj in iter_images(pdf):
        try:
            raw = obj.read_raw_bytes()
        except Exception:
            continue
        h = hashlib.sha1(raw).hexdigest()
        if h in canon:
            keep = canon[h]
            if keep.objgen != obj.objgen:
                remap[obj.objgen] = keep
                dup_bytes += len(raw)
        else:
            canon[h] = obj

    if not remap:
        log("   dedupe: nothing to do")
        return 0

    # Repoint every reference to a duplicate at its canonical twin.
    # Images sit inside each Form XObject's own /Resources, so this has to
    # recurse to arbitrary depth, not just scan top-level object keys.
    patched = 0
    visited = set()

    def walk(container):
        nonlocal patched
        try:
            if container.is_indirect:
                if container.objgen in visited:
                    return
                visited.add(container.objgen)
        except Exception:
            pass
        try:
            if isinstance(container, (pikepdf.Dictionary, pikepdf.Stream)):
                items = list(container.keys())
                for k in items:
                    try:
                        v = container[k]
                    except Exception:
                        continue
                    if getattr(v, "is_indirect", False) and v.objgen in remap:
                        container[k] = remap[v.objgen]; patched += 1
                    elif isinstance(v, (pikepdf.Dictionary, pikepdf.Array, pikepdf.Stream)):
                        walk(v)
            elif isinstance(container, pikepdf.Array):
                for i in range(len(container)):
                    try:
                        v = container[i]
                    except Exception:
                        continue
                    if getattr(v, "is_indirect", False) and v.objgen in remap:
                        container[i] = remap[v.objgen]; patched += 1
                    elif isinstance(v, (pikepdf.Dictionary, pikepdf.Array, pikepdf.Stream)):
                        walk(v)
        except Exception:
            return

    sys.setrecursionlimit(10000)
    walk(pdf.Root)
    for pg in pdf.pages:
        walk(pg)
    for obj in pdf.objects:
        if isinstance(obj, (pikepdf.Dictionary, pikepdf.Array, pikepdf.Stream)):
            walk(obj)

    log(f"   dedupe: {len(remap)} duplicate streams -> {len(canon)} unique "
        f"({patched} refs repointed, ~{mb(dup_bytes):.1f} MB reclaimable)")
    return dup_bytes


def requant(pdf, quality=82, min_gain=0.10, recode_lossless=False, max_dim=0,
            log=print):
    """Re-encode images. Greyscale for line art, quality drop for photos."""
    saved = 0; touched = 0; resized = 0; seen = set()
    for obj in iter_images(pdf):
        if obj.objgen in seen:
            continue
        seen.add(obj.objgen)
        try:
            raw = obj.read_raw_bytes()
            if obj.get("/Filter") == "/DCTDecode":
                im = Image.open(io.BytesIO(raw)); im.load()
            elif recode_lossless:
                # Flate/LZW: let pikepdf undo the filter, the PNG predictor and
                # the colour space, then re-encode the pixels as JPEG. A browser
                # "Save as PDF" export is entirely images of this kind.
                im = pikepdf.PdfImage(obj).as_pil_image()
            else:
                continue                     # only touch JPEGs; leave PNG/CCITT alone
        except Exception:
            continue

        try:
            shrunk = False
            if max_dim and max(im.width, im.height) > max_dim:
                s = max_dim / max(im.width, im.height)
                im = im.resize((max(1, round(im.width * s)),
                                max(1, round(im.height * s))), Image.LANCZOS)
                shrunk = True

            # Line art detection: RGB but effectively greyscale
            is_lineart = False
            if im.mode == "RGB":
                small = im.resize((min(im.width, 400), min(im.height, 400)))
                rgb = small.convert("RGB")
                px = list(rgb.getdata())[::7]
                if px and all(abs(r - g) < 8 and abs(g - b) < 8 for r, g, b in px):
                    is_lineart = True

            buf = io.BytesIO()
            if is_lineart:
                im.convert("L").save(buf, "JPEG", quality=quality,
                                     optimize=True, progressive=False)
                cs = pikepdf.Name("/DeviceGray")
            else:
                im.convert("RGB").save(buf, "JPEG", quality=quality,
                                       optimize=True, progressive=False)
                cs = pikepdf.Name("/DeviceRGB")
            new = buf.getvalue()
        except Exception:
            continue

        if len(new) < len(raw) * (1 - min_gain):
            obj.write(new, filter=pikepdf.Name("/DCTDecode"))
            obj["/ColorSpace"] = cs
            obj["/BitsPerComponent"] = 8
            # The pixel grid changed, so the stored dimensions must follow it.
            obj["/Width"] = im.width
            obj["/Height"] = im.height
            # Predictor params and any Decode array describe the *old* encoding
            # and colour space. /SMask is deliberately left alone — dropping it
            # would flatten transparency.
            for k in ("/DecodeParms", "/Decode"):
                if k in obj:
                    del obj[k]
            saved += len(raw) - len(new); touched += 1
            if shrunk:
                resized += 1

    log(f"   requant: {touched} images re-encoded at q{quality}"
        + (f", {resized} downsampled to <={max_dim}px" if max_dim else "")
        + f" (~{mb(saved):.1f} MB saved)")
    return saved


def save(pdf, path):
    pdf.save(path, compress_streams=True,
             object_stream_mode=pikepdf.ObjectStreamMode.generate,
             recompress_flate=True, linearize=False)


def split(path, parts, log=print):
    pdf = pikepdf.open(path)
    n = len(pdf.pages); per = -(-n // parts)
    base, ext = os.path.splitext(path)
    out = []
    for i in range(parts):
        lo, hi = i * per, min((i + 1) * per, n)
        if lo >= hi: break
        dst = pikepdf.Pdf.new()
        for p in range(lo, hi):
            dst.pages.append(pdf.pages[p])
        o = f"{base}_part{i+1}{ext}"
        save(dst, o); dst.close()
        out.append(o)
        log(f"   part {i+1}: pages {lo+1}-{hi}  {mb(os.path.getsize(o)):.1f} MB  {os.path.basename(o)}")
    pdf.close()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("dst")
    ap.add_argument("--dedupe", action="store_true")
    ap.add_argument("--requant", action="store_true")
    ap.add_argument("--quality", type=int, default=82)
    ap.add_argument("--recode-lossless", action="store_true",
                    help="also re-encode Flate/LZW images as JPEG")
    ap.add_argument("--max-dim", type=int, default=0,
                    help="downsample images whose longest side exceeds N px")
    ap.add_argument("--split", type=int, default=0)
    a = ap.parse_args()

    if os.path.abspath(a.src) == os.path.abspath(a.dst):
        sys.exit("refusing to overwrite the source file")

    before = os.path.getsize(a.src)
    print(f"{os.path.basename(a.src)}  {mb(before):.1f} MB")
    pdf = pikepdf.open(a.src)
    print(f"   pages: {len(pdf.pages)}")
    if a.dedupe:  dedupe(pdf)
    if a.requant: requant(pdf, a.quality, recode_lossless=a.recode_lossless,
                          max_dim=a.max_dim)
    save(pdf, a.dst); pdf.close()

    after = os.path.getsize(a.dst)
    print(f"-> {os.path.basename(a.dst)}  {mb(after):.1f} MB  "
          f"({100*(1-after/before):+.1f}%)")

    if a.split:
        print(f"   splitting into {a.split}:")
        split(a.dst, a.split)


if __name__ == "__main__":
    main()
