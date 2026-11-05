import os
import json
import urllib.request
from typing import Dict, Any, List, Optional
from soe_haystack.pipeline import HaystackRagPipeline
from soe_haystack.config import haystack_config

class SOEHaystackEngine:
    """Enterprise Haystack RAG Engine for The Sound of Essentials."""

    def __init__(self):
        self.pipeline = HaystackRagPipeline()

    def _generate_llm_response(self, prompt: str) -> Optional[str]:
        """Calls OpenRouter if key is present, otherwise returns None for local synthesis."""
        api_key = haystack_config.OPENROUTER_API_KEY or os.getenv("OPENROUTER_API_KEY", "")
        if not api_key:
            return None

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://soelearn.com",
            "X-Title": "SOE Haystack RAG Engine",
        }
        payload = {
            "model": haystack_config.DEFAULT_MODEL,
            "messages": [
                {"role": "system", "content": "You are Seriphia, the guardian of The Sound of Essentials. Ages 2-7 strictly."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 500,
        }
        try:
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=12) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                return res_data["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"Warning: OpenRouter call error: {e}")
            return None

    def ask_seriphia(self, question: str) -> Dict[str, Any]:
        """Parent concierge query answering with grounded citations and actionable recommendations."""
        res = self.pipeline.run(query=question, top_k=4)
        citations = res["citations"]

        # 1. Try LLM generation if OpenRouter is active
        llm_answer = self._generate_llm_response(res["prompt_template"])
        
        # 2. Local Grounded Synthesis if offline
        if not llm_answer:
            primary_rec = citations[0] if citations else {"title": "Track #1: Sunny Day (intro)", "domain": "Sensory Calm"}
            title = primary_rec.get("title", "Track #1: Sunny Day (intro)")
            domain = primary_rec.get("domain", "Sensory Co-Regulation")
            
            llm_answer = (
                f"Peace be with your home. For {question.strip().rstrip('?')}, our highest pedagogical recommendation "
                f"is to begin with {title} ({domain}). In early childhood (ages 2–7), the developing nervous system "
                f"co-regulates through acoustic tempo before cognitive instruction can take root. "
                f"Play the track at 90 BPM, engage in hands-on tactile touch (soft clapping or seed sorting), "
                f"and let the rhythm settle little bodies peacefully without the dopamine drop-off of flashing screens."
            )

        return {
            "status": "SUCCESS",
            "query": question,
            "seriphia_response": llm_answer,
            "recommended_tracks_and_lessons": citations,
            "canon_invariants": {
                "age_bracket": "Strictly Ages 2–7 (Pre-K to Grade 2)",
                "pedagogy": "Sound Before Symbols • Dalcroze Kinesthetics • Sensory Vagus Calm",
                "brand_voice": "Crafted by a father's heart and a mother's love",
                "free_access_url": "https://soelearn.com/listen",
            }
        }

    def search_dictionary(self, concept_query: str) -> Dict[str, Any]:
        """Conceptual semantic search across Picture Dictionary and 7 Lands."""
        res = self.pipeline.run(query=concept_query, top_k=5)
        return {
            "status": "SUCCESS",
            "concept_query": concept_query,
            "matching_scenes_and_words": res["citations"],
            "total_matches": len(res["citations"]),
        }

    def crosswalk_standards(self, standard_query: str) -> Dict[str, Any]:
        """Aligns state early learning standards (Head Start ELOF / NAEYC) with SOE tracks and lessons."""
        query_enriched = f"standard {standard_query}"
        res = self.pipeline.run(query=query_enriched, top_k=3)
        return {
            "status": "SUCCESS",
            "standards_query": standard_query,
            "curriculum_crosswalk_matches": res["citations"],
            "compliance_ready": True,
        }

    def triage_support_email(self, email_body: str) -> Dict[str, Any]:
        """Drafts empathetic, grounded responses for incoming Brevo CRM support emails."""
        res = self.pipeline.run(query=email_body, top_k=3)
        citations = res["citations"]
        rec = citations[0] if citations else {"title": "Rhythm Quest Album"}

        draft = (
            f"Dear Parent,\n\n"
            f"Thank you for reaching out to us. We completely understand what you are experiencing with your little explorer.\n\n"
            f"Based on our foundational work in early sensory rhythm, we recommend starting with '{rec.get('title')}' "
            f"from the free 19-track album. At ages 2–7, mapping sound through gentle repetition creates "
            f"calm co-regulation without tears or screen fatigue.\n\n"
            f"You can stream this track right away at https://soelearn.com/listen.\n\n"
            f"With warmth,\n"
            f"The Sound of Essentials Family\n"
            f"(Crafted by a father's heart and a mother's love)"
        )

        return {
            "status": "SUCCESS",
            "original_email_snippet": email_body[:100],
            "draft_response": draft,
            "referenced_sources": citations,
        }

_haystack_engine = None

def get_haystack_engine() -> SOEHaystackEngine:
    global _haystack_engine
    if _haystack_engine is None:
        _haystack_engine = SOEHaystackEngine()
    return _haystack_engine
