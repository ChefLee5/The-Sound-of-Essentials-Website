"""
Lulu Print API Tool Proxy for The Sound of Essentials
Imports and exposes the LuluClient from workbook.lulu_client
"""

import sys
from pathlib import Path

# Add workbook directory to python path
workbook_dir = Path(__file__).resolve().parent.parent / "workbook"
if str(workbook_dir) not in sys.path:
    sys.path.insert(0, str(workbook_dir))

from lulu_client import (
    LuluClient,
    PACKAGE_WORKBOOK_PAPERBACK_MATTE,
    PACKAGE_WORKBOOK_PAPERBACK_GLOSS,
    PACKAGE_WORKBOOK_COIL_GLOSS,
    PACKAGE_WORKBOOK_COIL_MATTE,
    SOE_WORKBOOK_PAGE_COUNT,
    main,
)

if __name__ == "__main__":
    main()
