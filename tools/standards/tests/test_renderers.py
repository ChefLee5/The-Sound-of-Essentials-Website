import unittest
import sys
import os
import json
from pathlib import Path

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from tools.standards.renderers import StandardsRenderer

class TestStandardsRenderer(unittest.TestCase):
    def setUp(self):
        self.output_dir = os.path.join(os.path.dirname(__file__), "test_output")
        os.makedirs(self.output_dir, exist_ok=True)
        self.renderer = StandardsRenderer()

    def test_export_50_state_index(self):
        """Verify 50-state procurement index document generation."""
        out_path = os.path.join(self.output_dir, "50_STATES_INDEX_TEST.md")
        self.renderer.export_50_state_index(out_path)

        self.assertTrue(os.path.exists(out_path))
        with open(out_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("50-State Early Childhood Procurement Index", content)
        self.assertIn("Tier 1: 28 State-Approved Curriculum States", content)
        self.assertIn("Tier 2: 16 Open-Territory / Local District States", content)
        self.assertIn("Tier 3: 6 Federal Head Start & Title I States", content)
        self.assertIn("Texas", content)
        self.assertIn("California", content)
        self.assertIn("Florida", content)

    def test_export_json_and_markdown(self):
        """Verify master crosswalk exports in JSON and Markdown formats."""
        json_path = os.path.join(self.output_dir, "master_crosswalk_test.json")
        md_path = os.path.join(self.output_dir, "master_crosswalk_test.md")

        self.renderer.export_json(json_path)
        self.renderer.export_markdown(md_path)

        self.assertTrue(os.path.exists(json_path))
        self.assertTrue(os.path.exists(md_path))

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            self.assertEqual(len(data.get("tracks", [])), 19)
            self.assertEqual(len(data.get("states", [])), 51)  # 50 states + DC

        with open(md_path, "r", encoding="utf-8") as f:
            md_content = f.read()
            self.assertIn("| # | Track Title | Land | BPM | ELOF Codes | NAEYC | Neurological Mechanism |", md_content)
            self.assertIn("Drill Time", md_content)

    def test_export_html_exhibit(self):
        """Verify self-contained, printable procurement HTML exhibit generation."""
        html_path = os.path.join(self.output_dir, "exhibit_tx_test.html")
        self.renderer.export_html_exhibit(html_path, state_code="TX")

        self.assertTrue(os.path.exists(html_path))
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()

        self.assertIn("State Curriculum Procurement Compliance Exhibit", html)
        self.assertIn("Texas Pre-Kindergarten Guidelines", html)
        self.assertIn("The Sound of Essentials", html)
        self.assertIn("table", html)
        self.assertIn("@media print", html)

if __name__ == "__main__":
    unittest.main()
