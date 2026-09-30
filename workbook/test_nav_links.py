from bs4 import BeautifulSoup
from pathlib import Path
import re

nav_path = Path("OEBPS/pages/nav.xhtml")
soup = BeautifulSoup(nav_path.read_text(encoding="utf-8"), "html.parser")
broken = [a["href"] for a in soup.find_all("a", href=True) if not (nav_path.parent / a["href"]).resolve().exists()]
print("Nav links count:", len(soup.find_all("a", href=True)))
print("Nav broken:", broken)

ncx_path = Path("OEBPS/toc.ncx")
srcs = re.findall(r'<content src="(.*?)"', ncx_path.read_text(encoding="utf-8"))
broken_ncx = [s for s in srcs if not (ncx_path.parent / s).resolve().exists()]
print("NCX points count:", len(srcs))
print("NCX broken:", broken_ncx)

assert len(broken) == 0, "Broken nav links found!"
assert len(broken_ncx) == 0, "Broken NCX links found!"
print("All navigation links verified 100% PASS!")
