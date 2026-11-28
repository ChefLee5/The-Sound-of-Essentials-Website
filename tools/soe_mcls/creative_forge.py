from typing import Dict, Any, List, Optional
from soe_mcls.canon import CULTURAL_DELTAS, PRODUCTION_CAMPAIGNS, ALL_CAMPAIGNS, validate_three_layer_ad
from soe_mcls.config import settings

MULTILINGUAL_TEMPLATES = {
    "en": {
        "SCREEN_VS_SENSORY": {
            "layer_1_ache": "You can see it in their eyes after twenty minutes of algorithmic cartoons—that glazed, overstimulated restlessness that steals the peace right out of your living room.",
            "layer_2_solution": "Built with a father's heart and a mother's love, The Sound of Essentials replaces screen rot with 19 handcrafted songs, 4,000+ illustrated words, and 400 tactile daily quests for ages 2–7.",
            "layer_3_invitation": "Press play on a calmer home tonight. Unlock all 19 tracks of the Rhythm Quest album 100% free—no app downloads, no algorithms.",
            "headline": "Stream the Free 19-Track Rhythm Quest Album",
        },
        "ALGORITHM_VS_HANDCRAFTED": {
            "layer_1_ache": "Silicon Valley engineered their apps to harvest your child's attention span before they even learn to tie their shoes.",
            "layer_2_solution": "Give them something real to hold, sing, and master: an 8-week musical quest packed with rhythm blocks, sensory movement, and timeless vocabulary.",
            "layer_3_invitation": "Start with the music. Claim the complete 19-song Rhythm Quest album free right now.",
            "headline": "Handcrafted Music for Ages 2–7 (Free Album)",
        }
    },
    "es": {
        "ALGORITHM_VS_HANDCRAFTED": {
            "layer_1_ache": "Los algoritmos fueron diseñados para capturar la atención de tu hijo antes de que aprenda a leer.",
            "layer_2_solution": "Creado con el corazón de un padre y el amor de una madre: 19 canciones artesanales, 4,000+ palabras ilustradas y 400 actividades táctiles sin pantallas.",
            "layer_3_invitation": "Empieza hoy sin costo. Escucha el álbum completo de 19 canciones de Rhythm Quest totalmente gratis.",
            "headline": "Escucha el Álbum Gratis de 19 Canciones",
        }
    },
    "fr": {
        "ALGORITHM_VS_HANDCRAFTED": {
            "layer_1_ache": "Les algorithmes sont conçus pour capter l'attention de votre enfant avant même qu'il ne sache lire.",
            "layer_2_solution": "Créé avec le cœur d'un père et l'amour d'une mère : 19 chansons artisanales, 4,000+ mots illustrés et 400 activités tactiles sans écran.",
            "layer_3_invitation": "Commencez gratuitement aujourd'hui. Écoutez l'album complet de 19 chansons Rhythm Quest sans aucun risque.",
            "headline": "Écoutez l'Album Gratuit de 19 Chansons",
        }
    }
}

SOE_VIDEO_BRAND_TOKENS: Dict[str, Any] = {
    "surface_cream_hex": "#FFF8F0",
    "accent_orange_hex": "#FF6F00",
    "highlight_amber_hex": "#FFB300",
    "earth_walnut_hex": "#795548",
    "garden_green_hex": "#4CAF50",
    "canonical_age_range": "Ages 2–7 (Pre-K to Grade 2)",
    "heritage_motto": "Crafted by a father's heart and a mother's love",
    "canonical_scale_claims": ["19 studio-recorded songs", "4,000+ illustrated words", "157 scenes", "400 tactile daily quests", "7 Lands", "15 Heroes"],
    "rejected_atlas_styles": ["NEON_SIGN", "LED_WALL", "CIRCUIT_CITY"],
}

SOE_3D_STYLE_PRESETS: Dict[str, Dict[str, Any]] = {
    "PAPER_POPUP": {
        "atlas_id": "#02",
        "atlas_name": "Paper Pop-Up",
        "category": "Material worlds",
        "format": "Story",
        "materials_and_lighting": "Die-cut folded card layers standing on real paper fold hinges over a warm wooden table in golden lamplight (#FFF8F0 cream card stock, pale cut edges, #FF6F00 foil accents).",
        "soe_use_case": "7 Lands storybook openings, 4,000+ words vocabulary reveals, Origin Story reels.",
    },
    "SOFT_CLAY": {
        "atlas_id": "#03",
        "atlas_name": "Soft Clay",
        "category": "Material worlds",
        "format": "Explainer",
        "materials_and_lighting": "Matte plasticine stop-motion tabletop forms with subtle craft finger impressions in front of a seamless #FFF8F0 paper backdrop.",
        "soe_use_case": "Screen-free sensory phonics mechanics and Rhythm Ready tactile quest explainers (Ages 2–7).",
    },
    "TINY_DIORAMA": {
        "atlas_id": "#04",
        "atlas_name": "Tiny Diorama",
        "category": "Spaces and journeys",
        "format": "Explainer",
        "materials_and_lighting": "Floating cross-section terrain tile showing soil, clay, and rock strata with chunky matte buildings and rounded trees in warm morning key light.",
        "soe_use_case": "7 Musical Lands map walkthroughs (Harmonia, Numeria, Vitalis, Celestia, Aquaria, Terrasol, Luminosity).",
    },
    "MARBLE_RUN": {
        "atlas_id": "#09",
        "atlas_name": "Marble Run",
        "category": "Machines that explain",
        "format": "Explainer",
        "materials_and_lighting": "Handmade walnut board with pale maple rails on brass pins, brass paddle gates, swirled glass marbles, and wood-burned glass jars over a warm seamless backdrop.",
        "soe_use_case": "Biological neural wiring, phonological loops, and cause-and-effect contrast against algorithmic feeds.",
    },
    "PAINTED_STORYBOOK": {
        "atlas_id": "#13",
        "atlas_name": "Painted",
        "category": "Filters over 3D",
        "format": "Story",
        "materials_and_lighting": "Lit 3D forms rendered with directional oil-on-linen brushwork, raking golden-hour highlights (#FF6F00), and warm textured paper edges.",
        "soe_use_case": "Heirloom storybook interludes and 19-track album emotional teasers.",
    },
    "EXPLODED_BUNDLE": {
        "atlas_id": "#08",
        "atlas_name": "Exploded View",
        "category": "Diagrams with depth",
        "format": "Explainer",
        "materials_and_lighting": "Hero heirloom bundle suspended above a clean #FFF8F0 studio sweep separating cleanly along its vertical axis with ink-slate numbered callouts.",
        "soe_use_case": "Essential Picture Dictionary ($55 Digital / $79 Print), Workbooks ($21 Digital / $35 Print), and Full Quest Bundle ($89) product architecture demos.",
    },
    "SPOTLIGHT_STAGE": {
        "atlas_id": "#06",
        "atlas_name": "Spotlight Stage",
        "category": "Spaces and journeys",
        "format": "Story",
        "materials_and_lighting": "Warm timber miniature theatre stage with crimson velvet wings, layered flat card cut-outs, warm light shafts, and front easel caption card.",
        "soe_use_case": "Track-by-track studio performance spotlights and Rhythm Pass ($14.99/mo) seasonal unveilings.",
    },
    "LOW_POLY_PAPER": {
        "atlas_id": "#01",
        "atlas_name": "Low-Poly",
        "category": "Filters over 3D",
        "format": "Explainer",
        "materials_and_lighting": "Faceted cut-paper/stone geometry re-skinned to #FFF8F0 cream, warm sand, #FF6F00 terracotta orange, and Terrasol sage green.",
        "soe_use_case": "Fast geometric concept explainers for B2B Montessori/Pre-K educators and AI parenting research.",
    },
}

class CreativeForge:
    """MCLS Pillar 1: Archetype & Asset Forge (3-Layer Copy + Visual/Video Specs)."""

    def build_ad_variant(
        self,
        archetype_id: str,
        delta: str,
        campaign: str,
        language: str = "en",
        buyer_track: str = "D2C",
        audio_track_number: int = 1,
    ) -> Dict[str, Any]:
        if delta not in CULTURAL_DELTAS:
            raise ValueError(f"Unknown Cultural Delta: {delta}")
        if campaign not in ALL_CAMPAIGNS:
            raise ValueError(f"Unknown Production Campaign: {campaign}")

        lang_dict = MULTILINGUAL_TEMPLATES.get(language, MULTILINGUAL_TEMPLATES["en"])
        copy_block = lang_dict.get(delta, MULTILINGUAL_TEMPLATES["en"]["SCREEN_VS_SENSORY"])

        validate_three_layer_ad(copy_block)

        primary_text = (
            f"{copy_block['layer_1_ache']}\n\n"
            f"{copy_block['layer_2_solution']}\n\n"
            f"{copy_block['layer_3_invitation']}"
        )

        campaign_slug = campaign.lower()
        delta_slug = delta.lower()
        destination_url = (
            f"{settings.BASE_DOMAIN}/listen"
            f"?utm_source=meta&utm_medium=paid_social"
            f"&utm_campaign={campaign_slug}"
            f"&utm_term={delta_slug}"
            f"&utm_content={archetype_id}_{language}"
        )

        visual_prompt = (
            f"Warm, grounded, tactile editorial photograph in golden morning light. "
            f"A parent and a 4-year-old child sitting on a woven rug exploring an open illustrated picture dictionary "
            f"and clapping to music. Screen-free sanctuary aesthetic, Kodak Portra 400 film grain, "
            f"theme: {CULTURAL_DELTAS[delta]}, campaign: {ALL_CAMPAIGNS[campaign]}."
        )

        return {
            "archetype_id": archetype_id,
            "delta": delta,
            "campaign": campaign,
            "language": language,
            "buyer_track": buyer_track,
            "primary_text": primary_text,
            "headline": copy_block["headline"],
            "layers": copy_block,
            "destination_url": destination_url,
            "visual_prompt": visual_prompt,
            "audio_track_number": audio_track_number,
            "call_to_action_type": "LISTEN_NOW" if buyer_track == "D2C" else "LEARN_MORE",
        }

    def build_video_iteration_packet(
        self,
        topic: str,
        style_preset: str = "PAPER_POPUP",
        delta: str = "SCREEN_VS_SENSORY",
        campaign: str = "THE_ENEMY",
        language: str = "en",
        audio_track_number: int = 1,
        duration_seconds: int = 15,
        iteration_notes: Optional[List[str]] = None,
        allow_screen_rot_contrast: bool = False,
    ) -> Dict[str, Any]:
        """Builds an SOE brand-locked 4-stage Three.js / Remotion video iteration packet (SRT-synced)."""
        style_key = (style_preset or "PAPER_POPUP").strip().upper()
        if style_key in SOE_VIDEO_BRAND_TOKENS["rejected_atlas_styles"] and not allow_screen_rot_contrast:
            raise ValueError(
                f"Style preset '{style_key}' is blocked by SOE Visual Quality Gate unless allow_screen_rot_contrast=True."
            )
        if style_key not in SOE_3D_STYLE_PRESETS:
            valid = ", ".join(sorted(SOE_3D_STYLE_PRESETS.keys()))
            raise ValueError(f"Unknown SOE 3D Style Preset '{style_key}'. Choose from: {valid}")

        ad_variant = self.build_ad_variant(
            archetype_id="ARC-VID-01",
            delta=delta,
            campaign=campaign,
            language=language,
            audio_track_number=audio_track_number,
        )
        preset = SOE_3D_STYLE_PRESETS[style_key]
        layers = ad_variant["layers"]

        beat_1_end = max(3, int(round(duration_seconds * 0.30)))
        beat_2_end = max(beat_1_end + 3, int(round(duration_seconds * 0.72)))
        total_end = max(beat_2_end + 2, int(duration_seconds))

        def _fmt_ts(sec: int) -> str:
            mins, rem = divmod(sec, 60)
            return f"00:{mins:02d}:{rem:02d},000"

        srt_cues = [
            {
                "index": 1,
                "start_sec": 0,
                "end_sec": beat_1_end,
                "srt_range": f"{_fmt_ts(0)} --> {_fmt_ts(beat_1_end)}",
                "beat": "LAYER_1_ACHE",
                "text": layers["layer_1_ache"],
                "scene_instruction": "Cool desaturated contrast beat before camera pushes into warm tactile world.",
            },
            {
                "index": 2,
                "start_sec": beat_1_end,
                "end_sec": beat_2_end,
                "srt_range": f"{_fmt_ts(beat_1_end)} --> {_fmt_ts(beat_2_end)}",
                "beat": "LAYER_2_SOLUTION",
                "text": layers["layer_2_solution"],
                "scene_instruction": f"Unfold {preset['atlas_name']} scene in #FFF8F0 cream & #FF6F00 golden light; showcase Ages 2–7 tactile quest craft.",
            },
            {
                "index": 3,
                "start_sec": beat_2_end,
                "end_sec": total_end,
                "srt_range": f"{_fmt_ts(beat_2_end)} --> {_fmt_ts(total_end)}",
                "beat": "LAYER_3_INVITATION",
                "text": layers["layer_3_invitation"],
                "scene_instruction": "Lock end card on soelearn.com/listen with 19-track free album medallion & motif pulse.",
            },
        ]

        srt_text = "\n\n".join(
            f"{cue['index']}\n{cue['srt_range']}\n{cue['text']}" for cue in srt_cues
        )

        notes = [n.strip() for n in (iteration_notes or []) if str(n).strip()]
        prompt_seed = (
            f"Build a {total_end}-second code-only Three.js / Remotion scene for '{topic}' using "
            f"Futurepedia Style {preset['atlas_id']} ({preset['atlas_name']} — {preset['category']}). "
            f"Enforce SOE Brand Tokens: background {SOE_VIDEO_BRAND_TOKENS['surface_cream_hex']}, "
            f"primary accent {SOE_VIDEO_BRAND_TOKENS['accent_orange_hex']}, highlight {SOE_VIDEO_BRAND_TOKENS['highlight_amber_hex']}, "
            f"audio track #{audio_track_number} instrumental percussion cues, and exact SRT beat timing below. "
            f"Strict canon: {SOE_VIDEO_BRAND_TOKENS['canonical_age_range']}, 4,000+ illustrated words, zero dark neon cyber-slop.\n\n"
            f"{srt_text}"
        )

        return {
            "topic": topic,
            "duration_seconds": total_end,
            "style_preset": style_key,
            "atlas_reference": preset,
            "brand_tokens": SOE_VIDEO_BRAND_TOKENS,
            "stage_1_audio_and_srt": {
                "audio_source": f"SOE Studio Track #{audio_track_number} + Narration Voiceover (SRT-Aligned)",
                "native_web_audio_sfx": "Soft wooden clack / chime synced at SRT beat transitions (muted under vocals)",
                "srt_cues": srt_cues,
                "srt_text": srt_text,
            },
            "stage_2_atlas_style_seed": {
                "atlas_id": preset["atlas_id"],
                "atlas_name": preset["atlas_name"],
                "materials_and_lighting": preset["materials_and_lighting"],
                "prompt_seed": prompt_seed,
            },
            "stage_3_code_iteration_loop": {
                "editable_axes": [
                    "1_beat_scene_changes",
                    "2_physics_and_camera_fixes",
                    "3_brand_palette_and_hero_lock",
                    "4_srt_word_timing_tightening",
                ],
                "operator_iteration_notes": notes,
                "remotion_composition": "TactileExplainer",
            },
            "stage_4_crystallized_skill_spec": {
                "skill_id": f"soe-video-{style_key.lower()}",
                "locked_palette": [
                    SOE_VIDEO_BRAND_TOKENS["surface_cream_hex"],
                    SOE_VIDEO_BRAND_TOKENS["accent_orange_hex"],
                    SOE_VIDEO_BRAND_TOKENS["highlight_amber_hex"],
                ],
                "reusable_for_series": True,
                "destination_url": ad_variant["destination_url"],
                "headline": ad_variant["headline"],
            },
        }
