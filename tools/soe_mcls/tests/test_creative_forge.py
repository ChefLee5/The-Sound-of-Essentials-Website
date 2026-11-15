import pytest
from soe_mcls.creative_forge import CreativeForge

def test_generate_ad_package_enforces_canon():
    forge = CreativeForge()
    package = forge.build_ad_variant(
        archetype_id="ARC-01",
        delta="SCREEN_VS_SENSORY",
        campaign="THE_ENEMY",
        language="en",
        buyer_track="D2C"
    )
    assert package["archetype_id"] == "ARC-01"
    assert "soelearn.com/listen" in package["destination_url"]
    assert "utm_campaign=the_enemy" in package["destination_url"]
    assert "utm_content=ARC-01" in package["destination_url"]
    assert len(package["primary_text"].split("\n\n")) == 3  # 3-Layer Rule paragraphs
    assert "warm" in package["visual_prompt"].lower() or "tactile" in package["visual_prompt"].lower()

def test_multilingual_generation():
    forge = CreativeForge()
    pkg_es = forge.build_ad_variant("ARC-02", "ALGORITHM_VS_HANDCRAFTED", "VICTORY_GARDEN", language="es")
    pkg_fr = forge.build_ad_variant("ARC-02", "ALGORITHM_VS_HANDCRAFTED", "VICTORY_GARDEN", language="fr")
    assert "Escucha" in pkg_es["headline"] or "Gratis" in pkg_es["headline"]
    assert "Écoutez" in pkg_fr["headline"] or "Gratuit" in pkg_fr["headline"]
    assert "4 232" not in pkg_fr["primary_text"]
    assert "4,000+" in pkg_fr["primary_text"]


def test_video_iteration_pipeline_locks_brand_and_srt():
    forge = CreativeForge()
    packet = forge.build_video_iteration_packet(
        topic="How Acoustic Rhythm Wires Early Reading",
        style_preset="MARBLE_RUN",
        duration_seconds=15,
        iteration_notes=["Slow marble drop to match beat 2 SRT cue"],
    )
    assert packet["atlas_reference"]["atlas_id"] == "#09"
    assert packet["brand_tokens"]["surface_cream_hex"] == "#FFF8F0"
    assert packet["brand_tokens"]["accent_orange_hex"] == "#FF6F00"
    assert len(packet["stage_1_audio_and_srt"]["srt_cues"]) == 3
    assert "00:00:00,000 -->" in packet["stage_1_audio_and_srt"]["srt_text"]
    assert packet["stage_3_code_iteration_loop"]["operator_iteration_notes"] == [
        "Slow marble drop to match beat 2 SRT cue"
    ]
    assert packet["stage_4_crystallized_skill_spec"]["skill_id"] == "soe-video-marble_run"


def test_video_iteration_rejects_unapproved_neon_style_by_default():
    forge = CreativeForge()
    with pytest.raises(ValueError, match="blocked by SOE Visual Quality Gate"):
        forge.build_video_iteration_packet(
            topic="Neon Trap",
            style_preset="NEON_SIGN",
        )
