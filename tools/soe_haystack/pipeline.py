import os
import re
from typing import List, Dict, Any, Optional
from soe_haystack.indexer import Document, SOEKnowledgeIndexer
from soe_haystack.config import haystack_config

class InvertedIndexBM25:
    """Lightweight deterministic BM25 / token-overlap retriever for exact keyword matching."""

    def __init__(self, documents: List[Document]):
        self.documents = documents
        self.doc_tokens = [self._tokenize(d.content) for d in documents]

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r'\b[a-zA-Z0-9_\-]+\b', text)]

    def retrieve(self, query: str, top_k: int = 4) -> List[Document]:
        q_tokens = set(self._tokenize(query))
        scored = []
        for doc, d_tokens in zip(self.documents, self.doc_tokens):
            if not d_tokens:
                continue
            common = q_tokens.intersection(set(d_tokens))
            # Score formula: token overlap + bonus for exact phrase hits
            score = len(common) / (len(q_tokens) + 1.0)
            q_lower = query.lower()
            if q_lower in doc.content.lower():
                score += 0.5
            # Type boosting based on query hints
            if "track" in q_lower or "song" in q_lower:
                if doc.meta.get("type") == "track":
                    score += 0.3
            elif "lesson" in q_lower or "tantrum" in q_lower or "activity" in q_lower:
                if doc.meta.get("type") == "lesson_extender":
                    score += 0.3
            elif "standard" in q_lower or "elof" in q_lower or "naeyc" in q_lower:
                if "standards" in doc.meta:
                    score += 0.4

            if score > 0:
                doc_copy = Document(
                    id=doc.id,
                    content=doc.content,
                    meta=doc.meta,
                    score=round(score, 3)
                )
                scored.append(doc_copy)

        scored.sort(key=lambda x: x.score, reverse=True)
        return scored[:top_k]

class HaystackRagPipeline:
    """Haystack 2.x Directed Graph RAG Pipeline for SOE Ecosystem."""

    def __init__(self):
        self.indexer = SOEKnowledgeIndexer()
        self.documents = self.indexer.get_all_documents()
        self.retriever = InvertedIndexBM25(self.documents)

    def run(self, query: str, top_k: int = 4) -> Dict[str, Any]:
        """Executes the Haystack 2.x retrieval and prompt synthesis graph."""
        retrieved_docs = self.retriever.retrieve(query, top_k=top_k)
        
        # If no strict match, fallback to core track + lesson
        if not retrieved_docs:
            fallback = [d for d in self.documents if d.meta.get("type") in ["track", "lesson_extender"]][:2]
            retrieved_docs = fallback

        context_blocks = []
        citations = []
        for i, d in enumerate(retrieved_docs, start=1):
            context_blocks.append(f"[{i}] {d.content}")
            citations.append({
                "source_id": d.id,
                "type": d.meta.get("type"),
                "title": d.meta.get("title") or d.meta.get("name") or d.id,
                "domain": d.meta.get("domain", "General"),
                "url": d.meta.get("url") or d.meta.get("audio_url", "https://soelearn.com/listen"),
                "relevance_score": d.score,
            })

        synthesized_context = "\n\n".join(context_blocks)

        prompt_template = f"""You are Seriphia, the guardian guide of The Sound of Essentials: Rhythm Quest.
Tone: Warm, grounded, serene, authoritative, crafted by a father's heart and a mother's love.
Strict Canon Invariants:
- Target age: Strictly Ages 2–7 (Toddler, Pre-K to Grade 2). Never cite age 8 or older.
- ZERO MUSIC HALLUCINATIONS: The SOE music catalog is already created, published, and immutable. There are exactly 19 canonical tracks with fixed titles:
  Track #1: Sunny Day (intro), Track #2: Days of the Week, Track #3: Alphabet Song Remix, Track #4: Horses Interlude,
  Track #5: Le Cheval, Track #6: Lets Stretch, Track #7: Drill Time, Track #8: Numbers, Track #9: My Body,
  Track #10: Manners, Track #11: Time, Track #12: Changes, Track #13: One hundred, Track #14: The Ocean,
  Track #15: Hard Words, Track #16: Shapes, Track #17: Months of the Year, Track #18: Rain, Track #19: After the Storm (outro).
- NEVER invent, rename, or extrapolate track titles. The expansion of SOE is in literature, tactile lesson extensions, and curriculum peripherals — NEVER in the music.
- In your recommendations, cite ONLY the exact published track titles and numbers from the retrieved context.
- Zero fake stats. Ground every recommendation in auditory science, sensory co-regulation, and Dalcroze rhythm.

Retrieved Grounded Context:
{synthesized_context}

User Question: {query}

Seriphia's Grounded Guidance:"""

        return {
            "query": query,
            "retrieved_documents_count": len(retrieved_docs),
            "citations": citations,
            "prompt_template": prompt_template,
            "grounded_context": synthesized_context,
        }
