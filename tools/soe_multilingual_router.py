#!/usr/bin/env python3
"""
============================================================================
SOE LIGHTWEIGHT MULTILINGUAL ROUTER (ZERO-DEPENDENCY ENGINE)
============================================================================
Ultra-fast (<1ms), zero-dependency inbound lead triage engine for
The Sound of Essentials (SOE): Rhythm Quest.

Runs on standard Python 3 with NO PyTorch, NO heavy ML models, and NO bloat.
Triages incoming parent and institutional inquiries across English (EN),
Spanish (ES), and French (FR) into the canonical Brevo 18-Campaign Engine.

Maps each lead to:
  1. Language: EN, ES, or FR (via function-word frequency analysis)
  2. Persona Segment: D2C Parent vs. B2B Institutional (Preschool, Clinic, etc.)
  3. Commercial Intent: Samples, Bulk Pricing, Licensing, or Support
  4. Urgency & Churn / Chargeback Risk Score
  5. Automated Brevo List ID & Campaign Template ID
============================================================================
"""

import sys
import re
import json
import argparse
from typing import Dict, Any, Tuple

# Ensure proper UTF-8 stdout encoding in Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ---------------------------------------------------------------------------
# 1. Canonical SOE Brevo Campaign Catalog Mapping (Templates 1-18)
# ---------------------------------------------------------------------------
BREVO_MAPPINGS = {
    "d2c_parent": {
        "list_id": 2,
        "list_name": "SOE_Album_Listeners",
        "template_id": 6,
        "template_name": "SOE Nurture 00 (Free Gift Delivery)",
        "audience": "D2C Caregiver / Homeschool"
    },
    "b2b_preschool": {
        "list_id": 101,
        "list_name": "B2B_Preschool_Chains",
        "template_id": 7,
        "template_name": "B2B 01: Private Preschool Chains (Δ3 Handcrafted)",
        "audience": "Preschool / Daycare Director"
    },
    "b2b_clinic": {
        "list_id": 102,
        "list_name": "B2B_Pediatric_Clinics",
        "template_id": 8,
        "template_name": "B2B 02: Pediatric Speech-Language & OT Clinics (Δ1 Sensory)",
        "audience": "Pediatric Therapist / Clinic"
    },
    "b2b_special_ed": {
        "list_id": 104,
        "list_name": "B2B_Special_Ed_Inclusive",
        "template_id": 10,
        "template_name": "B2B 04: Special Ed & Inclusive Classrooms (Δ1 Sensory)",
        "audience": "Special Ed / Sensory Educator"
    },
    "b2b_bilingual_esl": {
        "list_id": 108,
        "list_name": "B2B_Bilingual_ESL_Centers",
        "template_id": 14,
        "template_name": "B2B 08: International ESL & Bilingual Pre-K (Δ2 Arts)",
        "audience": "Bilingual / Dual-Language Director"
    },
    "b2b_licensing": {
        "list_id": 105,
        "list_name": "B2B_EdTech_Licensing",
        "template_id": 11,
        "template_name": "B2B 05: EdTech & Licensing Leads (Δ3 Handcrafted)",
        "audience": "EdTech / Procurement Executive"
    },
    "support": {
        "list_id": 999,
        "list_name": "SOE_Customer_Care",
        "template_id": None,
        "template_name": "Priority Human Inbox (info@soelearn.com)",
        "audience": "Existing Customer Support"
    }
}

# ---------------------------------------------------------------------------
# 2. Vocabulary & Linguistic Markers (EN, ES, FR)
# ---------------------------------------------------------------------------
STOP_WORDS = {
    "es": {
        "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "en", "para",
        "por", "con", "somos", "nuestro", "nuestra", "nuestros", "gracias", "hola", "niños",
        "años", "su", "sus", "más", "como", "pero", "este", "esta", "estos", "estas"
    },
    "fr": {
        "le", "la", "les", "un", "une", "des", "du", "de", "dans", "pour", "avec", "nous",
        "notre", "nos", "bonjour", "merci", "enfants", "ans", "est", "sont", "votre", "vos",
        "sur", "par", "qui", "que", "mais", "cette", "ces"
    },
    "en": {
        "the", "a", "an", "and", "in", "for", "of", "to", "with", "we", "our", "hello",
        "hi", "thanks", "kids", "children", "is", "are", "your", "on", "by", "that", "this"
    }
}

SEGMENT_PATTERNS = {
    "support": [
        r"\b(refund|chargeback|billed twice|double charge|cancel|charged me|scam|fraud|return)\b",
        r"\b(reembolso|cobro doble|cobrado dos veces|cancelar|devolución|disputa|factura)\b",
        r"\b(remboursement|double débit|débité deux fois|annuler|contestation|facturation)\b"
    ],
    "b2b_clinic": [
        r"\b(speech|patholog|occupational|clinic|therap|sensory processing|audiolog)\b",
        r"\b(fonoaudiolog|terapia del habla|lenguaje|ocupacional|clínica|neurodesarrollo)\b",
        r"\b(orthophon|ergothérap|clinique|troubles du langage|développement)\b"
    ],
    "b2b_special_ed": [
        r"\b(special ed|inclusive classroom|sensory overload|autis|adhd|neuro-affirming)\b",
        r"\b(educación especial|aula inclusiva|sensorial|autismo|necesidades especiales)\b",
        r"\b(besoins particuliers|sensoriel|classe inclusive|autisme)\b"
    ],
    "b2b_bilingual_esl": [
        r"\b(bilingual|dual-language|esl|language immersion|french immersion|spanish immersion)\b",
        r"\b(bilingüe|doble inmersión|inmersión lingüística|clases de inglés)\b",
        r"\b(bilingue|immersion|langue seconde|fle)\b"
    ],
    "b2b_preschool": [
        r"\b(preschool|daycare|nursery|kindergarten|early learning center|school director|head start)\b",
        r"\b(preescolar|jardín infantil|guardería|escuela infantil|directora de jardín|colegio)\b",
        r"\b(école maternelle|garderie|crèche|centre de la petite enfance|cpe|directrice)\b"
    ],
    "b2b_licensing": [
        r"\b(licens|edtech|curriculum adoption|procurement|state doe|district-wide|franchise)\b",
        r"\b(licencia|distrito escolar|adopción curricular|franquicia|distribución)\b",
        r"\b(licence|partenariat|diffusion|commission scolaire)\b"
    ],
    "d2c_parent": [
        r"\b(my daughter|my son|my child|my 3-year-old|my 4-year-old|my 5-year-old|homeschool|mom|dad)\b",
        r"\b(mi hija|mi hijo|mi niño|mi niña|educar en casa|mamá|papá|familia)\b",
        r"\b(ma fille|mon fils|mon enfant|école à la maison|maman|papa|famille)\b"
    ]
}

INTENT_PATTERNS = {
    "request_samples": [
        r"\b(sample|preview|trial|overview|test track|hear a track)\b",
        r"\b(muestra|probar|escuchar|ejemplo|ver el material)\b",
        r"\b(échantillon|extrait|tester|aperçu)\b"
    ],
    "bulk_pricing": [
        r"\b(bulk|quote|pricing for|how much for \d+|group rate|purchase order)\b",
        r"\b(cotización|precio por volumen|descuento|para \d+ niños|presupuesto)\b",
        r"\b(devis|tarif de groupe|prix pour \d+|commande groupée)\b"
    ],
    "licensing_partnership": [
        r"\b(license|licensing|partnership|distribute|enterprise contract)\b",
        r"\b(licencia|alianza|socio|convenio institucional)\b",
        r"\b(partenariat|accord de licence|distribution commerciale)\b"
    ],
    "order_support": [
        r"\b(order #|shipping|track my order|download link|can't access|password)\b",
        r"\b(número de pedido|envío|no puedo descargar|enlace de descarga)\b",
        r"\b(numéro de commande|livraison|téléchargement|accès)\b"
    ]
}


class LightweightMultilingualRouter:
    """Zero-dependency, sub-millisecond lead routing engine for SOE."""

    def detect_language(self, text: str) -> Tuple[str, float]:
        """Detect whether text is EN, ES, or FR using token distribution."""
        tokens = re.findall(r"\b[a-zA-ZáéíóúüñàâçèêëîïôûùA-ZÁÉÍÓÚÜÑÀÂÇÈÊËÎÏÔÛÙ]+\b", text.lower())
        if not tokens:
            return "en", 0.5

        scores = {"en": 0, "es": 0, "fr": 0}
        for token in tokens:
            for lang, words in STOP_WORDS.items():
                if token in words:
                    scores[lang] += 1

        total_hits = sum(scores.values())
        if total_hits == 0:
            # Default to English if ambiguous Latin script
            return "en", 0.6

        best_lang = max(scores, key=scores.get)
        confidence = scores[best_lang] / total_hits
        return best_lang, round(min(confidence, 0.99), 2)

    def route_inquiry(self, text: str, sender_email: str = "") -> Dict[str, Any]:
        """Triage an incoming inquiry in <1ms without network or ML dependencies."""
        lang, lang_conf = self.detect_language(text)
        lower_text = text.lower()

        # 1. Classify Audience Segment
        lead_segment = "d2c_parent"
        segment_conf = 0.70
        for seg, patterns in SEGMENT_PATTERNS.items():
            if any(re.search(pat, lower_text) for pat in patterns):
                lead_segment = seg
                segment_conf = 0.92
                break

        # 2. Classify Commercial Intent
        intent = "general_inquiry"
        for int_name, patterns in INTENT_PATTERNS.items():
            if any(re.search(pat, lower_text) for pat in patterns):
                intent = int_name
                break

        # 3. Urgency & Churn Flags
        urgency_score = 0
        if lead_segment == "support" or "immediately" in lower_text or "hoy mismo" in lower_text or "urgent" in lower_text:
            urgency_score = 2
        elif intent in ["bulk_pricing", "licensing_partnership"]:
            urgency_score = 1

        churn_risk = 0.95 if lead_segment == "support" and any(k in lower_text for k in ["chargeback", "cancel", "reembolso", "disputa", "remboursement"]) else 0.05

        # 4. Resolve Brevo Workflow
        brevo_meta = BREVO_MAPPINGS.get(lead_segment, BREVO_MAPPINGS["d2c_parent"])

        return {
            "sender_email": sender_email,
            "language": {
                "detected": lang,
                "confidence": lang_conf
            },
            "classification": {
                "lead_segment": lead_segment,
                "confidence": segment_conf,
                "primary_intent": intent,
                "urgency_score": urgency_score,
                "churn_risk": churn_risk
            },
            "brevo_dispatch": {
                "target_list_id": brevo_meta["list_id"],
                "target_list_name": brevo_meta["list_name"],
                "auto_template_id": brevo_meta["template_id"],
                "campaign_name": brevo_meta["template_name"],
                "target_audience": brevo_meta["audience"]
            }
        }


def run_demo():
    print("\n" + "=" * 68)
    print("   THE SOUND OF ESSENTIALS (SOE) — ZERO-BLOAT MULTILINGUAL TRIAGE   ")
    print("=" * 68)
    print("Engine: Pure Python Standard Library (0 extra MB, <1ms execution)")

    router = LightweightMultilingualRouter()

    sample_leads = [
        {
            "label": "Spanish (ES) · B2B Preschool / Kindergarten Lead",
            "email": "directora@jardincolombia.edu.co",
            "text": "Hola, somos un preescolar en Bogotá con 90 niños de 3 a 5 años. Nos gustaría solicitar una cotización por volumen y muestras de las canciones para el próximo ciclo."
        },
        {
            "label": "French (FR) · B2B Pediatric Speech Clinic Lead",
            "email": "contact@orthophonie-montreal.qc.ca",
            "text": "Bonjour, notre clinique d'orthophonie à Montréal recherche des outils musicaux pour les enfants avec retard de parole. Pouvez-vous nous envoyer un extrait du dictionnaire ?"
        },
        {
            "label": "English (EN) · D2C Parent Lead",
            "email": "sarah.m.parent@gmail.com",
            "text": "Hi! My 4-year-old daughter loves the Terrasol sample track! Can I get the free coloring book and the 19-track album download link?"
        },
        {
            "label": "English (EN) · Priority Billing / Chargeback Dispute",
            "email": "billing_issue@customer.com",
            "text": "I was billed twice on my credit card for the Rhythm Pass subscription today. Please refund the duplicate charge immediately or I will file a chargeback!"
        },
        {
            "label": "Spanish (ES) · Bilingual Immersion School",
            "email": "coordinacion@escuelabilingue.mx",
            "text": "Buenos días, somos una escuela bilingüe de inmersión en Guadalajara. Queremos evaluar el currículo de The Sound of Essentials para nuestras clases de inglés y música."
        }
    ]

    for lead in sample_leads:
        print(f"\n▶ Scenario: {lead['label']}")
        print(f"  From    : {lead['email']}")
        print(f"  Message : \"{lead['text']}\"")

        res = router.route_inquiry(lead['text'], lead['email'])

        print("  ┌── Triage Output ──")
        print(f"  │ Language       : \033[1m{res['language']['detected'].upper()}\033[0m (confidence: {res['language']['confidence']})")
        print(f"  │ Segment        : \033[1m{res['classification']['lead_segment']}\033[0m (conf: {res['classification']['confidence']})")
        print(f"  │ Intent         : {res['classification']['primary_intent']}")
        print(f"  │ Urgency Level  : {res['classification']['urgency_score']} / 2")
        print(f"  │ Churn Flag     : {res['classification']['churn_risk']}")
        print(f"  │ Brevo List     : #{res['brevo_dispatch']['target_list_id']} ({res['brevo_dispatch']['target_list_name']})")
        print(f"  │ Brevo Template : #{res['brevo_dispatch']['auto_template_id']} -> {res['brevo_dispatch']['campaign_name']}")
        print("  └───────────────────")

    print("\n" + "=" * 68)
    print("✔ Triage executed in microseconds with 0 MB external dependencies.")
    print("=" * 68 + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SOE Zero-Bloat Multilingual Router")
    parser.add_argument("--text", type=str, help="Inbound message text to triage")
    parser.add_argument("--email", type=str, default="lead@example.com", help="Sender email")
    parser.add_argument("--demo", action="store_true", help="Run multi-sample demo")

    args = parser.parse_args()

    if args.demo or len(sys.argv) == 1:
        run_demo()
    elif args.text:
        router = LightweightMultilingualRouter()
        output = router.route_inquiry(args.text, args.email)
        print(json.dumps(output, indent=2, ensure_ascii=False))
