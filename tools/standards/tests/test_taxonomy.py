import unittest
import sys
import os

# Add repo root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from tools.standards.models import StateProfile, StandardCode, NeurologicalImpact
from tools.standards.state_registry import STATES_REGISTRY, get_state, get_states_by_tier
from tools.standards.taxonomy import ELOF_TAXONOMY, NAEYC_TAXONOMY, STATE_STANDARDS_TAXONOMY

class TestTaxonomy(unittest.TestCase):
    def test_50_states_registry_counts(self):
        """Verify all 50 US states are cataloged across the 3 strategic tiers."""
        us_states = [s for s in STATES_REGISTRY.values() if s.code != "DC"]
        self.assertEqual(len(us_states), 50, f"Expected 50 states, found {len(us_states)}")

        tier_1 = get_states_by_tier(1)
        tier_2 = [s for s in get_states_by_tier(2) if s.code != "DC"]
        tier_3 = get_states_by_tier(3)

        self.assertEqual(len(tier_1), 28, f"Expected 28 Tier 1 Approved-List States, found {len(tier_1)}")
        self.assertEqual(len(tier_2), 16, f"Expected 16 Tier 2 Open-Territory States, found {len(tier_2)}")
        self.assertEqual(len(tier_3), 6, f"Expected 6 Tier 3 Head Start / Title I States, found {len(tier_3)}")

    def test_key_states_profile_data(self):
        """Verify specific high-priority states have accurate framework definitions."""
        tx = get_state("TX")
        self.assertIsNotNone(tx)
        self.assertEqual(tx.tier, 1)
        self.assertTrue(tx.approved_list_required)
        self.assertIn("Texas Pre-Kindergarten Guidelines", tx.standards_framework)

        ca = get_state("CA")
        self.assertIsNotNone(ca)
        self.assertEqual(ca.tier, 1)
        self.assertIn("California Preschool/TK", ca.standards_framework)

        ny = get_state("NY")
        self.assertIsNotNone(ny)
        self.assertEqual(ny.tier, 2)
        self.assertFalse(ny.approved_list_required)

    def test_elof_and_naeyc_taxonomy(self):
        """Verify national frameworks contain the required domains."""
        expected_elof_domains = {"P-LC", "P-LIT", "P-MATH", "P-SCI", "P-PMP", "P-ATL", "P-SE"}
        found_elof_domains = {code.domain for code in ELOF_TAXONOMY.values()}
        self.assertTrue(expected_elof_domains.issubset(found_elof_domains))

        expected_naeyc_standards = {"2.B", "2.C", "2.D", "2.F", "2.G", "2.J"}
        found_naeyc_standards = {code.domain for code in NAEYC_TAXONOMY.values()}
        self.assertTrue(expected_naeyc_standards.issubset(found_naeyc_standards))

if __name__ == "__main__":
    unittest.main()
