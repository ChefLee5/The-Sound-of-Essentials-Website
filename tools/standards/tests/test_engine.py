import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from tools.standards.engine import StandardsEngine

class TestStandardsEngine(unittest.TestCase):
    def setUp(self):
        self.engine = StandardsEngine()

    def test_all_19_tracks_mapped(self):
        """Verify that all 19 canonical album tracks are mapped to accreditation standards."""
        crosswalk = self.engine.generate_master_crosswalk()
        self.assertEqual(len(crosswalk), 19, f"Expected 19 tracks, found {len(crosswalk)}")

    def test_track_accreditation_integrity(self):
        """Verify each track contains valid ELOF, NAEYC, and Neurological mappings."""
        crosswalk = self.engine.generate_master_crosswalk()
        canonical_lands = {"harmonia", "terrasol", "numeria", "vitalis", "luminosity", "aquaria", "celestia"}

        for track in crosswalk:
            # Basic identity
            self.assertGreaterEqual(track.track_id, 1)
            self.assertLessEqual(track.track_id, 19)
            self.assertIn(track.land.lower(), canonical_lands)
            self.assertGreater(track.bpm, 0)

            # Framework codes
            self.assertGreaterEqual(len(track.elof_codes), 1, f"Track {track.track_id} missing ELOF code")
            self.assertGreaterEqual(len(track.naeyc_codes), 1, f"Track {track.track_id} missing NAEYC code")

            # Neurological impact
            neuro = track.neurological_impact
            self.assertTrue(len(neuro.mechanism) > 10, f"Track {track.track_id} mechanism too brief")
            self.assertTrue(len(neuro.developmental_readiness) > 10)
            self.assertTrue(len(neuro.classroom_application) > 10)

            # Tactile extension
            self.assertTrue(len(track.tactile_extension_summary) > 15)

    def test_high_priority_neurological_anchors(self):
        """Verify specific sensory regulation and motor integration anchors."""
        crosswalk_map = {t.slug: t for t in self.engine.generate_master_crosswalk()}

        # Track 6: Let's Stretch -> Bilateral integration
        stretch = crosswalk_map.get("lets-stretch")
        self.assertIsNotNone(stretch)
        self.assertTrue(stretch.neurological_impact.bilateral_integration)
        self.assertIn("P-PMP.1", stretch.elof_codes)

        # Track 1: Sunny Day -> Vagal calming / transition ritual
        sunny = crosswalk_map.get("sunny-day")
        self.assertIsNotNone(sunny)
        self.assertTrue(sunny.neurological_impact.vagal_regulation)

        # Track 3: Alphabet Song Remix -> Phonemic segmentation
        abc = crosswalk_map.get("alphabet-song-remix")
        self.assertIsNotNone(abc)
        self.assertIn("P-LIT.1", abc.elof_codes)

if __name__ == "__main__":
    unittest.main()
