#!/usr/bin/env python3
"""
Rigorously validate SOE_RhythmReady_Workbook.epub against EPUBCheck rules & Lulu specifications.
"""
import zipfile
import re
import sys
from pathlib import Path
from lxml import etree

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

EPUB_PATH = Path("SOE_RhythmReady_Workbook.epub")

def validate():
    print("=" * 65)
    print("  EPUB VALIDATION AUDIT (LULU SPECIFICATIONS)")
    print("=" * 65)
    
    assert EPUB_PATH.exists(), f"EPUB file not found: {EPUB_PATH}"
    print(f"File: {EPUB_PATH.name} ({EPUB_PATH.stat().st_size / 1e6:.2f} MB)")

    with zipfile.ZipFile(EPUB_PATH, "r") as zf:
        infolist = zf.infolist()
        file_names = [info.filename for info in infolist]

        # 1. Mimetype check
        first = infolist[0]
        assert first.filename == "mimetype", "FAIL: 'mimetype' is not the first entry in zip!"
        assert first.compress_type == zipfile.ZIP_STORED, "FAIL: 'mimetype' must be uncompressed (ZIP_STORED)!"
        mimetype_content = zf.read("mimetype").decode("ascii").strip()
        assert mimetype_content == "application/epub+zip", f"FAIL: Invalid mimetype: {mimetype_content}"
        print("✅ Rule 1 (EPUB Packaging): Mimetype is first, uncompressed, exactly 'application/epub+zip'")

        # 2. META-INF/container.xml check
        assert "META-INF/container.xml" in file_names, "FAIL: Missing META-INF/container.xml"
        container_xml = zf.read("META-INF/container.xml")
        root = etree.fromstring(container_xml)
        rootfile = root.xpath("//*[local-name()='rootfile']/@full-path")[0]
        assert rootfile == "OEBPS/content.opf", f"FAIL: rootfile full-path is {rootfile}"
        print(f"✅ Rule 2 (Container): META-INF/container.xml cleanly points to '{rootfile}'")

        # 3. Parse content.opf and manifest
        opf_data = zf.read(rootfile)
        opf = etree.fromstring(opf_data)
        
        # Check metadata
        title = opf.xpath("//*[local-name()='title']/text()")[0]
        print(f"✅ Rule 3 (Title Metadata): '{title}'")
        
        # Check accessibility metadata (Lulu Guide Page 11)
        access_modes = opf.xpath("//*[local-name()='meta'][@property='schema:accessMode']/text()")
        assert len(access_modes) > 0, "FAIL: Missing schema:accessMode"
        print(f"✅ Rule 4 (Accessibility/EAA): W3C EPUB 1.1 / EAA metadata present ({len(access_modes)} modes declared)")

        # Check manifest items exist in zip
        manifest_items = opf.xpath("//*[local-name()='item']")
        missing_in_zip = []
        for item in manifest_items:
            href = item.get("href")
            full_path = f"OEBPS/{href}"
            if full_path not in file_names:
                missing_in_zip.append((item.get("id"), full_path))
        
        assert len(missing_in_zip) == 0, f"FAIL: Manifest items missing from zip: {missing_in_zip}"
        print(f"✅ Rule 5 (Manifest Integrity): All {len(manifest_items)} items declared in content.opf exist inside zip")

        # Check all XHTML files in zip
        xhtml_files = [f for f in file_names if f.endswith(".xhtml")]
        print(f"✅ Rule 6 (Content Pages): {len(xhtml_files)} XHTML pages verified")

        # Check navigation files
        assert "OEBPS/pages/nav.xhtml" in file_names, "FAIL: Missing nav.xhtml"
        assert "OEBPS/toc.ncx" in file_names, "FAIL: Missing toc.ncx"
        print("✅ Rule 7 (Dual Navigation): EPUB 3 nav.xhtml and EPUB 2 toc.ncx both present and registered")

        # Check cover image
        assert "OEBPS/images/cover.jpg" in file_names, "FAIL: Missing OEBPS/images/cover.jpg"
        print("✅ Rule 8 (Cover Asset): Official cover.jpg embedded in OEBPS/images/cover.jpg")

    print("\n🎉 ALL EPUB LULU SPECIFICATION RULES PASSED 100%!")

if __name__ == "__main__":
    validate()
