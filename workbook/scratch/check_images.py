import re
from pathlib import Path

def main():
    pages_dir = Path("OEBPS/pages")
    all_pages = list(pages_dir.rglob("*.xhtml"))
    print(f"Total XHTML pages found: {len(all_pages)}")

    all_srcs = set()
    broken_srcs = []
    
    for p in all_pages:
        txt = p.read_text(encoding="utf-8")
        srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', txt)
        for s in srcs:
            all_srcs.add(s)
            # resolve path relative to the xhtml file
            resolved = (p.parent / s).resolve()
            if not resolved.exists():
                broken_srcs.append((p.relative_to(pages_dir), s, resolved))

    print(f"Total unique img src references: {len(all_srcs)}")
    print(f"Total broken img src references: {len(broken_srcs)}")
    
    if broken_srcs:
        print("\nSample broken references (up to 10):")
        for page, src, res in broken_srcs[:10]:
            print(f"  Page: {page} -> src='{src}'\n    Resolved to: {res}\n    Exists: {res.exists()}")

if __name__ == "__main__":
    main()
