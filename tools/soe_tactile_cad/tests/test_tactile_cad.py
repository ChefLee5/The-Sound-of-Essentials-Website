"""Unit tests for SOE Cloud Academy Text-to-CAD Engine & DFM Safety Validator."""

from __future__ import annotations

import tempfile
from pathlib import Path

import pytest

from soe_tactile_cad.generator import (
    build_slant3d_order_payload,
    generate_harmonia_nameplate,
    generate_nfc_hero_totem_plinth,
    generate_vitalis_knuckle_board,
)


def test_harmonia_nameplate_watertight_and_child_safe() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        res = generate_harmonia_nameplate("EMMA", Path(tmp))
        dfm = res["dfm"]
        assert res["sku"] == "SOE-HARM-NAME-01"
        assert res["child_name"] == "EMMA"
        assert Path(res["stl_path"]).exists()
        assert Path(res["build123d_script_path"]).exists()
        assert dfm["watertight_manifold"] is True
        assert dfm["boundary_edges"] == 0
        assert dfm["non_manifold_edges"] == 0
        assert dfm["degenerate_triangles"] == 0
        assert dfm["cpsc_1501_child_safe_ages_2_7"] is True
        assert dfm["dfm_passed"] is True


def test_vitalis_and_nfc_totem_dfm_and_canon_guard() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        knuckle = generate_vitalis_knuckle_board(beats=8, output_dir=Path(tmp))
        assert knuckle["dfm"]["dfm_passed"] is True
        assert knuckle["dfm"]["boundary_edges"] == 0

        totem = generate_nfc_hero_totem_plinth("Seriphia", output_dir=Path(tmp))
        assert totem["dfm"]["dfm_passed"] is True
        assert totem["land"] == "all_lands"

        lil_g = generate_nfc_hero_totem_plinth("Lil G", output_dir=Path(tmp))
        assert lil_g["dfm"]["dfm_passed"] is True
        assert lil_g["land"] == "concord"

        with pytest.raises(ValueError):
            generate_nfc_hero_totem_plinth("Marcus", output_dir=Path(tmp))


def test_slant3d_order_payload_shape() -> None:
    payload = build_slant3d_order_payload(
        customer_name="Jane Doe",
        customer_email="jane@soelearn.com",
        shipping_address={
            "address_line_1": "123 Rhythm Way",
            "city": "Boise",
            "state": "ID",
            "postal_code": "83713",
            "country": "US",
        },
        sku="SOE-HARM-NAME-01",
        stl_file_url="https://soelearn.com/cad/harmonia_nameplate_emma.stl",
    )
    assert payload["endpoint"] == "https://www.slant3dapi.com/api/order"
    assert payload["line_items"][0]["filament"] == "PLA"
    assert payload["line_items"][0]["sku"] == "SOE-HARM-NAME-01"

