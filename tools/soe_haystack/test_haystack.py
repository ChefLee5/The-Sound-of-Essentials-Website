import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from soe_haystack import get_haystack_engine

def main():
    engine = get_haystack_engine()
    
    print("--- 1. Testing Parent Concierge Query (Ask Seriphia) ---")
    q = "My 3 year old is having a tantrum before bedtime"
    res = engine.ask_seriphia(q)
    print("Query:", q)
    print("Response:", res["seriphia_response"])
    print("Citations:")
    for c in res["recommended_tracks_and_lessons"]:
        print(f"  • [{c['type']}] {c['title']} ({c.get('domain', 'N/A')}) - URL: {c['url']}")

    print("\n--- 2. Testing Picture Dictionary Conceptual Search ---")
    dict_res = engine.search_dictionary("bravery and courage in nature")
    print("Total Matches:", dict_res["total_matches"])
    for m in dict_res["matching_scenes_and_words"][:3]:
        print(f"  • {m['title']} ({m['domain']})")

    print("\n--- 3. Testing Institutional Standards Crosswalk ---")
    cw_res = engine.crosswalk_standards("ELOF phonological awareness preschool")
    for cw in cw_res["curriculum_crosswalk_matches"]:
        print(f"  * {cw['title']} -> {cw['domain']}")

    print("\n[SUCCESS] All Haystack tests completed successfully!")

if __name__ == "__main__":
    main()
