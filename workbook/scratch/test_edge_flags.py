import subprocess
import tempfile
from pathlib import Path
import pymupdf

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
html_test = Path("scratch/test_clean.html")

flag_options = [
    ("old_headless", ["--headless", "--disable-gpu", "--no-first-run", "--print-to-pdf-no-header"]),
    ("headless_new_no_header", ["--headless=new", "--disable-gpu", "--no-first-run", "--no-pdf-header-footer"]),
    ("old_headless_no_pdf_header_footer", ["--headless", "--disable-gpu", "--no-first-run", "--no-pdf-header-footer"]),
]

for name, flags in flag_options:
    pdf_out = Path(f"scratch/test_{name}.pdf")
    if pdf_out.exists():
        pdf_out.unlink()
    profile = Path(tempfile.mkdtemp(prefix=f"edge_{name}_"))
    cmd = [edge] + flags + [f"--user-data-dir={profile}", f"--print-to-pdf={pdf_out.resolve()}", html_test.resolve().as_uri()]
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
    if pdf_out.exists():
        doc = pymupdf.open(pdf_out)
        txt = doc[0].get_text()
        has_url = "file:///" in txt or ".html" in txt
        print(f"[{name}] exit={res.returncode}, has_url={has_url}")
        if not has_url:
            print(f"  SUCCESS! Clean text:\n{txt}")
        doc.close()
    else:
        print(f"[{name}] PDF not generated!")
