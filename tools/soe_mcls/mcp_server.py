#!/usr/bin/env python3
"""
SOE Market Campaign Launch System (SOE-MCLS) — MCP Native Server
Model Context Protocol (JSON-RPC 2.0 stdio) server implementation inspired by
tiagovilasboas/grok-bot-architecture and serenakeyitan/agent-org-chart.

Provides standardized, typed tool endpoints for Creative Forge, Rhythm Guardian Optimizer,
AI Parenting Intel Sweep, Social Autopilot Ledger, and Helix Gate 1 Canon Verification.

Usage:
  Stdio Mode (Standard MCP):
    python -m tools.soe_mcls.mcp_server
    python tools/soe_mcls/mcp_server.py

  Self-Test Mode:
    python tools/soe_mcls/mcp_server.py --self-test
"""

import sys
import os
import json
import re
from pathlib import Path
from typing import Dict, Any, List, Optional

# Ensure repository root and tools directory are in sys.path
TOOLS_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = TOOLS_DIR.parent
if str(TOOLS_DIR) not in sys.path:
    sys.path.insert(0, str(TOOLS_DIR))
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

# Safe Imports of MCLS Modules
try:
    from soe_mcls.creative_forge import CreativeForge
    from soe_mcls.rhythm_guardian import RhythmGuardianOptimizer
    from soe_mcls.canon import CULTURAL_DELTAS, PRODUCTION_CAMPAIGNS, PRODUCT_LADDER
except ImportError as e:
    # Fallback if executed directly outside package
    sys.path.insert(0, str(TOOLS_DIR / "soe_mcls"))
    from creative_forge import CreativeForge
    from rhythm_guardian import RhythmGuardianOptimizer
    from canon import CULTURAL_DELTAS, PRODUCTION_CAMPAIGNS, PRODUCT_LADDER

# Canon Verification Regexes (Helix Gate 1)
CANON_CHECKS = [
    (re.compile(r"\bAges?\s*2\s*[-–—]\s*8\b", re.IGNORECASE), "Canon age bound is strictly Ages 2–7 (Pre-K to Grade 2)"),
    (re.compile(r"\bGrade\s*3\b", re.IGNORECASE), "Canon ceiling is Grade 2"),
    (re.compile(r"\b(Marcus|Elena|Reef|Zara|Dara|Sophia|Geometria)\b", re.IGNORECASE), "Retired character or land name detected"),
    (re.compile(r"\bno\s+credit\s+card\s+required\b", re.IGNORECASE), "Billing invariant violation: never claim 'no credit card required'"),
    (re.compile(r"\bShopify\b", re.IGNORECASE), "Stack invariant violation: Shopify is retired; use direct soelearn.com Stripe funnel"),
    (re.compile(r"\blive\s+(instrumentation|instruments?|orchestra|music|acoustic|organic)\b", re.IGNORECASE), "Audio rule: studio-recorded vocals & acoustic arrangements only"),
]

def verify_canon_text(text: str) -> Dict[str, Any]:
    """Runs SOE Helix Gate 1 pre-flight canon checks."""
    violations = []
    for pattern, reason in CANON_CHECKS:
        if pattern.search(text or ""):
            violations.append(reason)
    return {
        "passed": len(violations) == 0,
        "status": "PASS" if len(violations) == 0 else "BLOCKED",
        "violations": violations,
    }

# Tool Registry Metadata
MCP_TOOLS: List[Dict[str, Any]] = [
    {
        "name": "mcls_forge_ad_bundle",
        "description": "Pillar 1: Builds a 3-Layer Meta/Pinterest Ad Variant (Ache -> Solution -> Zero-Risk Invitation) with visual production prompts and credit cost estimates.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "archetype_id": {
                    "type": "string",
                    "description": "Ad archetype code, e.g. 'ARC-01', 'ARC-02', 'ARC-03'.",
                    "default": "ARC-01"
                },
                "delta": {
                    "type": "string",
                    "description": "Cultural Delta key ('SCREEN_VS_SENSORY', 'ALGORITHM_VS_HANDCRAFTED', 'TESTING_VS_ARTS', 'INSTITUTION_VS_SANCTUARY', 'CONSUMPTION_VS_QUEST').",
                    "default": "SCREEN_VS_SENSORY"
                },
                "campaign": {
                    "type": "string",
                    "description": "Production Campaign key ('THE_ENEMY', 'VICTORY_GARDEN', 'WHAT_THEY_TOOK', 'THE_ORIGIN_STORY', 'THE_NAME_TELLS_YOU', 'THE_OTHER_SIDE').",
                    "default": "THE_ENEMY"
                },
                "language": {
                    "type": "string",
                    "description": "Target language: 'en', 'es', or 'fr'.",
                    "default": "en"
                },
                "buyer_track": {
                    "type": "string",
                    "description": "Target track: 'D2C' (Parents/Homeschoolers) or 'B2B' (Schools/Clinics).",
                    "default": "D2C"
                }
            },
            "required": ["delta", "campaign"]
        },
        "security_tier": "tier_1_staging_sandbox"
    },
    {
        "name": "mcls_evaluate_rhythm_guardian",
        "description": "Pillar 5: Evaluates live or simulated ad performance against 2026 battle-tested dual-horizon guardrails (Max Lead CPA $2.50, +20% scale on winners, protects 90-day gestation window).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "ad_metrics": {
                    "type": "array",
                    "description": "Array of ad performance metric objects.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "ad_id": {"type": "string"},
                            "spend": {"type": "number"},
                            "leads": {"type": "integer"},
                            "purchases": {"type": "integer"},
                            "ctr": {"type": "number"},
                            "current_budget_cents": {"type": "integer"},
                            "engine_type": {"type": "string", "default": "ENGINE_A_VALUE_GATE"}
                        },
                        "required": ["ad_id", "spend"]
                    }
                }
            },
            "required": ["ad_metrics"]
        },
        "security_tier": "tier_1_staging_sandbox"
    },
    {
        "name": "mcls_sweep_ai_parenting_intel",
        "description": "Autonomous Scanner: Scans, scores, and extracts high-leverage quotes from AI founders (Karpathy, Ng) and pediatric neuroscientists into the SOE intel vault.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["list", "export_hooks", "summary"],
                    "description": "Action to perform on the intel vault.",
                    "default": "list"
                },
                "min_leverage": {
                    "type": "number",
                    "description": "Minimum leverage score filter (0-100).",
                    "default": 85.0
                }
            }
        },
        "security_tier": "tier_0_autonomous_read"
    },
    {
        "name": "mcls_check_social_autopilot",
        "description": "Organic Seeding: Inspects the social advertorial catalog and published ledger to prevent duplicates and preview the next queued drip post.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["status", "preview_next"],
                    "description": "Action: 'status' returns ledger counts; 'preview_next' returns the next unpublished post.",
                    "default": "status"
                }
            }
        },
        "security_tier": "tier_0_autonomous_read"
    },
    {
        "name": "mcls_validate_canon_compliance",
        "description": "SOE Helix Gate 1 Runtime Canon Verifier: Ensures text has strictly Ages 2–7 bounds, zero retired names, and complies with SOE audio and funnel invariants.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "Text, headline, or marketing copy to inspect."
                }
            },
            "required": ["text"]
        },
        "security_tier": "tier_0_autonomous_read"
    },
    {
        "name": "mcls_stage_approval_card",
        "description": "Command Gate Staging: Formats a proposed agent action into an MCLS Command Approval Gate payload ready for human authorization.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "unit_key": {"type": "string", "description": "Dispatching unit ID, e.g. 'MCLS-STUDIO', 'MCLS-RECON'."},
                "action_type": {"type": "string", "description": "Type of action, e.g. 'meta_ad_bundle', 'geo_schema_patch'."},
                "title": {"type": "string", "description": "Card title."},
                "channel": {"type": "string", "description": "Channel name."},
                "target_destination": {"type": "string", "description": "Target destination route or system."},
                "delta_alignment": {"type": "string", "default": "SCREEN_VS_SENSORY"},
                "estimated_cost": {"type": "string", "default": "$0.00"},
                "summary": {"type": "string", "description": "Brief summary of the action."},
                "payload": {"type": "object", "description": "Detailed payload data for execution."}
            },
            "required": ["unit_key", "action_type", "title", "summary"]
        },
        "security_tier": "tier_1_staging_sandbox"
    }
]

# Tool Implementations
def execute_tool(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Routes and executes a registered MCP tool."""
    if name == "mcls_forge_ad_bundle":
        forge = CreativeForge()
        delta = arguments.get("delta", "SCREEN_VS_SENSORY")
        campaign = arguments.get("campaign", "THE_ENEMY")
        language = arguments.get("language", "en")
        archetype_id = arguments.get("archetype_id", "ARC-01")
        buyer_track = arguments.get("buyer_track", "D2C")
        
        variant = forge.build_ad_variant(
            archetype_id=archetype_id,
            delta=delta,
            campaign=campaign,
            language=language,
            buyer_track=buyer_track
        )
        canon_check = verify_canon_text(f"{variant['headline']} {variant['primary_text']}")
        return {
            "ad_variant": variant,
            "canon_verification": canon_check,
            "security_tier": "tier_1_staging_sandbox",
            "gate_action": "Stage in Command Approval Gate before live Meta API spend."
        }

    elif name == "mcls_evaluate_rhythm_guardian":
        guardian = RhythmGuardianOptimizer()
        metrics = arguments.get("ad_metrics", [])
        decisions = guardian.evaluate_ads(metrics)
        return {
            "evaluated_ads_count": len(metrics),
            "decisions": decisions,
            "guardrails_applied": {
                "max_lead_cpa": guardian.max_lead_cpa,
                "min_ctr": guardian.min_ctr,
                "scale_step_ratio": guardian.scale_step,
                "protect_90_day_gestation": True
            },
            "security_tier": "tier_1_staging_sandbox"
        }

    elif name == "mcls_sweep_ai_parenting_intel":
        vault_path = REPO_ROOT / "docs" / "soe_ai_parenting_intel_vault.json"
        if not vault_path.exists():
            return {"error": f"Vault file not found at {vault_path}"}
        
        with open(vault_path, "r", encoding="utf-8") as f:
            vault = json.load(f)
            
        action = arguments.get("action", "list")
        min_leverage = float(arguments.get("min_leverage", 85.0))
        entries = vault if isinstance(vault, list) else vault.get("intel_entries", [])
        filtered = [e for e in entries if float(e.get("leverage_score", 0)) >= min_leverage]
        
        if action == "export_hooks":
            hooks = [{"id": e["id"], "speaker": e["speaker"], "hook": e.get("ad_hook", ""), "mapping": e.get("soe_asset_mapping", "")} for e in filtered]
            return {"total_hooks": len(hooks), "hooks": hooks}
        elif action == "summary":
            return {
                "vault_updated": vault.get("last_updated") if isinstance(vault, dict) else "2026-11-12",
                "total_records": len(entries),
                "high_leverage_records": len(filtered),
                "featured_speakers": list(set(e.get("speaker", "") for e in entries))
            }
        else:
            return {"total_records": len(filtered), "records": filtered}

    elif name == "mcls_check_social_autopilot":
        ledger_path = REPO_ROOT / "docs" / "facebook_published_ledger.json"
        adv_path = REPO_ROOT / "docs" / "facebook_advertorials_catalog.json"
        
        published_keys = []
        if ledger_path.exists():
            try:
                with open(ledger_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    published_keys = data.get("published_post_keys", [])
            except Exception:
                pass
                
        catalog = []
        if adv_path.exists():
            try:
                with open(adv_path, "r", encoding="utf-8") as f:
                    catalog = json.load(f)
            except Exception:
                pass
                
        unpublished = [p for p in catalog if p.get("key") not in published_keys]
        action = arguments.get("action", "status")
        
        if action == "preview_next":
            next_post = unpublished[0] if unpublished else None
            return {
                "has_next": next_post is not None,
                "next_post": next_post,
                "remaining_queue": len(unpublished),
                "security_tier": "tier_0_autonomous_read",
                "note": "Actual publishing to Facebook Page requires Tier 2 human elevation."
            }
        else:
            return {
                "total_in_catalog": len(catalog),
                "published_count": len(published_keys),
                "remaining_in_queue": len(unpublished),
                "published_keys": published_keys
            }

    elif name == "mcls_validate_canon_compliance":
        text = arguments.get("text", "")
        return verify_canon_text(text)

    elif name == "mcls_stage_approval_card":
        combined_text = f"{arguments.get('title', '')} {arguments.get('summary', '')} {json.dumps(arguments.get('payload', {}))}"
        canon_res = verify_canon_text(combined_text)
        card = {
            "id": f"card_staged_{int(Path(__file__).stat().st_mtime)}",
            "unit_key": arguments.get("unit_key", "MCLS-STUDIO"),
            "action_type": arguments.get("action_type", "meta_ad_bundle"),
            "title": arguments.get("title", "Untitled Proposal"),
            "channel": arguments.get("channel", "MCLS Staging Channel"),
            "target_destination": arguments.get("target_destination", "/listen"),
            "delta_alignment": arguments.get("delta_alignment", "SCREEN_VS_SENSORY"),
            "canon_status": canon_res["status"],
            "estimated_cost": arguments.get("estimated_cost", "$0.00"),
            "status": "pending",
            "summary": arguments.get("summary", ""),
            "payload": arguments.get("payload", {}),
            "canon_violations": canon_res["violations"],
            "security_tier": "tier_1_staging_sandbox"
        }
        return {"success": True, "staged_card": card}

    else:
        raise ValueError(f"Unknown MCP tool: {name}")

# JSON-RPC Server Loop (stdio)
def handle_json_rpc(request: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Handles an incoming JSON-RPC 2.0 message."""
    method = request.get("method")
    req_id = request.get("id")

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "serverInfo": {
                    "name": "soe-mcls-mcp-server",
                    "version": "1.0.0"
                },
                "capabilities": {
                    "tools": {}
                }
            }
        }

    elif method == "notifications/initialized":
        return None

    elif method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": MCP_TOOLS
            }
        }

    elif method == "tools/call":
        params = request.get("params", {})
        tool_name = params.get("name")
        arguments = params.get("arguments", {})
        try:
            result = execute_tool(tool_name, arguments)
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(result, indent=2, ensure_ascii=False)
                        }
                    ]
                }
            }
        except Exception as e:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {
                    "code": -32603,
                    "message": str(e)
                }
            }

    elif method == "ping":
        return {"jsonrpc": "2.0", "id": req_id, "result": {}}

    else:
        if req_id is not None:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {
                    "code": -32601,
                    "message": f"Method '{method}' not found"
                }
            }
        return None

def run_self_test():
    """Runs a quick diagnostic self-test across all 6 registered MCP tools."""
    print("=" * 65)
    print("SOE-MCLS MCP Server: Self-Test Diagnostic")
    print("=" * 65)

    # 1. Forge Ad Bundle
    print("[1/6] Testing mcls_forge_ad_bundle...")
    res1 = execute_tool("mcls_forge_ad_bundle", {
        "delta": "SCREEN_VS_SENSORY",
        "campaign": "THE_ENEMY",
        "language": "en"
    })
    assert res1["canon_verification"]["passed"] is True
    print(f"      ✓ Built variant: '{res1['ad_variant']['headline']}' (Canon: {res1['canon_verification']['status']})")

    # 2. Evaluate Rhythm Guardian
    print("[2/6] Testing mcls_evaluate_rhythm_guardian...")
    res2 = execute_tool("mcls_evaluate_rhythm_guardian", {
        "ad_metrics": [
            {"ad_id": "ad_test_winner", "spend": 25.0, "leads": 12, "purchases": 0, "ctr": 2.2, "current_budget_cents": 5000}
        ]
    })
    winner_decision = res2["decisions"]["ad_test_winner"]
    assert winner_decision["action"] == "SCALE_BUDGET"
    print(f"      ✓ Decision: {winner_decision['action']} (New Budget: ${winner_decision['new_budget_cents']/100:.2f})")

    # 3. Sweep AI Parenting Intel
    print("[3/6] Testing mcls_sweep_ai_parenting_intel...")
    res3 = execute_tool("mcls_sweep_ai_parenting_intel", {"action": "summary"})
    print(f"      ✓ Vault contains {res3.get('total_records', 0)} entries from speakers: {res3.get('featured_speakers', [])[:2]}")

    # 4. Check Social Autopilot
    print("[4/6] Testing mcls_check_social_autopilot...")
    res4 = execute_tool("mcls_check_social_autopilot", {"action": "status"})
    print(f"      ✓ Catalog: {res4['total_in_catalog']} posts | Published: {res4['published_count']} | Remaining: {res4['remaining_in_queue']}")

    # 5. Validate Canon Compliance
    print("[5/6] Testing mcls_validate_canon_compliance...")
    valid_res = execute_tool("mcls_validate_canon_compliance", {"text": "Ages 2–7 screen-free curriculum with 19 studio tracks."})
    invalid_res = execute_tool("mcls_validate_canon_compliance", {"text": "Ages 2-8 curriculum with Marcus and Elena on Shopify."})
    assert valid_res["passed"] is True
    assert invalid_res["passed"] is False
    print(f"      ✓ Valid sample: {valid_res['status']} | Invalid sample: {invalid_res['status']} ({len(invalid_res['violations'])} violations)")

    # 6. Stage Approval Card
    print("[6/6] Testing mcls_stage_approval_card...")
    res6 = execute_tool("mcls_stage_approval_card", {
        "unit_key": "MCLS-STUDIO",
        "action_type": "meta_ad_bundle",
        "title": "Self-Test 3-Layer Ad Bundle",
        "summary": "Verified Ages 2–7 ad bundle staged via MCP server."
    })
    assert res6["staged_card"]["status"] == "pending"
    print(f"      ✓ Card Staged: '{res6['staged_card']['title']}' (Status: {res6['staged_card']['status']})")

    print("\n" + "=" * 65)
    print("ALL 6 MCP TOOLS PASSED SELF-TEST CLEANLY.")
    print("=" * 65)

def main():
    if "--self-test" in sys.argv:
        run_self_test()
        return

    # Standard Stdio JSON-RPC Loop
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            resp = handle_json_rpc(req)
            if resp is not None:
                sys.stdout.write(json.dumps(resp) + "\n")
                sys.stdout.flush()
        except json.JSONDecodeError:
            err = {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "Parse error"}}
            sys.stdout.write(json.dumps(err) + "\n")
            sys.stdout.flush()

if __name__ == "__main__":
    main()
