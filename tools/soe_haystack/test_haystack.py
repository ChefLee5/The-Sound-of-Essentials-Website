import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from soe_haystack import get_haystack_engine
from soe_haystack.indexer import SOEKnowledgeIndexer


def test_critical_thinking_foundation_indexed():
    indexer = SOEKnowledgeIndexer()
    ct_docs = indexer.build_critical_thinking_documents()

    strategies = [d for d in ct_docs if d.meta.get("type") == "critical_thinking_strategy"]
    quests = [d for d in ct_docs if d.meta.get("type") == "socratic_quest"]
    units = [d for d in ct_docs if d.meta.get("type") == "remodelled_unit"]
    standards = [d for d in ct_docs if d.meta.get("type") == "intellectual_standard"]
    taxonomy = [d for d in ct_docs if d.meta.get("type") == "socratic_taxonomy"]

    assert len(strategies) == 39, f"Expected 35 strategies + 4 supplements = 39, got {len(strategies)}"
    assert len(quests) == 7, f"Expected 7 flagship Socratic quests, got {len(quests)}"
    assert len(units) == 70, f"Expected 70 remodelled units, got {len(units)}"
    assert len(standards) == 12, f"Expected 12 universal intellectual standards, got {len(standards)}"
    assert len(taxonomy) == 6, f"Expected 6 Socratic taxonomy categories, got {len(taxonomy)}"
    assert len(ct_docs) == 134

    # Sovereignty guardrail: every URL must route through SOE-owned domain
    for doc in ct_docs:
        assert doc.meta["url"].startswith("https://soelearn.com/"), f"Non-sovereign URL in {doc.id}: {doc.meta['url']}"


def test_critical_thinking_retrieval_queries():
    engine = get_haystack_engine()

    # Exact strategy code lookup
    s30 = engine.query_critical_thinking("S-30 examining assumptions")
    assert s30["status"] == "SUCCESS"
    assert s30["total_matches"] >= 1
    assert any(m["source_id"] == "ct_strategy_s-30" for m in s30["matches"])

    # Socratic Wonder Circle / Land quest retrieval
    terrasol = engine.query_critical_thinking("Terrasol condensation cold cup Socratic Wonder Circle")
    assert any(m["type"] in {"socratic_quest", "remodelled_unit", "critical_thinking_strategy"} for m in terrasol["matches"])

    # Existing core concierge & ELOF crosswalk queries stay grounded
    tantrum = engine.ask_seriphia("My 3 year old is having a tantrum before bedtime")
    assert tantrum["status"] == "SUCCESS"
    assert len(tantrum["recommended_tracks_and_lessons"]) >= 1

    cw = engine.crosswalk_standards("ELOF phonological awareness preschool")
    assert cw["compliance_ready"] is True
    assert len(cw["curriculum_crosswalk_matches"]) >= 1


def main():
    engine = get_haystack_engine()

    print("--- 1. Testing Parent Concierge Query (Ask Seriphia) ---")
    q = "My 3 year old is having a tantrum before bedtime"
    res = engine.ask_seriphia(q)
    print("Query:", q)
    print("Response:", res["seriphia_response"])
    print("Citations:")
    for c in res["recommended_tracks_and_lessons"]:
        print(f"  * [{c['type']}] {c['title']} ({c.get('domain', 'N/A')}) - URL: {c['url']}")

    print("\n--- 2. Testing Picture Dictionary Conceptual Search ---")
    dict_res = engine.search_dictionary("bravery and courage in nature")
    print("Total Matches:", dict_res["total_matches"])
    for m in dict_res["matching_scenes_and_words"][:3]:
        print(f"  * {m['title']} ({m['domain']})")

    print("\n--- 3. Testing Institutional Standards Crosswalk ---")
    cw_res = engine.crosswalk_standards("ELOF phonological awareness preschool")
    for cw in cw_res["curriculum_crosswalk_matches"]:
        print(f"  * {cw['title']} -> {cw['domain']}")

    print("\n--- 4. Testing Critical Thinking & Socratic Inquiry RAG ---")
    ct_res = engine.query_critical_thinking("S-30 examining assumptions cold cup condensation")
    print("Total Matches:", ct_res["total_matches"])
    for m in ct_res["matches"][:4]:
        print(f"  * [{m['type']}] {m['title']} (score={m['relevance_score']})")

    test_critical_thinking_foundation_indexed()
    test_critical_thinking_retrieval_queries()
    print("\n[SUCCESS] All Haystack tests completed successfully!")


if __name__ == "__main__":
    main()
