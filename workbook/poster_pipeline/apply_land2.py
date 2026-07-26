#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply Land 2 QA results to posters.json: anchors + status for the 15
keepers, word drops (Liter, Dozen), qa notes, and hardened re-roll specs for
budget-savings / fractions-decimals / time-clocks."""
import io, json, shutil

ANCHORS = {
    "land2_basic-math-operations": {"Add": [0.40, 0.54], "Subtract": [0.60, 0.50], "Plus": [0.22, 0.72], "Minus": [0.40, 0.74], "Equals": [0.585, 0.735], "Calculate": [0.78, 0.70]},
    "land2_calendar-math": {"Morning": [0.15, 0.42], "Noon": [0.37, 0.40], "Evening": [0.59, 0.40], "Midnight": [0.81, 0.40], "Schedule": [0.48, 0.65]},
    "land2_charts-graphs": {"Pie chart": [0.29, 0.37], "Bar graph": [0.66, 0.53], "Line graph": [0.89, 0.39], "Tally": [0.87, 0.78], "Survey": [0.44, 0.56]},
    "land2_cooking-measurements": {"Recipe": [0.17, 0.82], "Ingredient": [0.08, 0.72], "Measuring cup": [0.25, 0.78], "Measuring spoon": [0.31, 0.90], "Whisk": [0.43, 0.81], "Spatula": [0.55, 0.78], "Sift": [0.67, 0.81], "Stir": [0.575, 0.57], "Mix": [0.62, 0.65], "Pour": [0.30, 0.575], "Bake": [0.85, 0.60], "Timer": [0.895, 0.85]},
    "land2_data-statistics": {"Half": [0.55, 0.81], "Double": [0.70, 0.80], "Triple": [0.875, 0.67], "Rank": [0.53, 0.65], "Score": [0.12, 0.35]},
    "land2_distance-speed": {"Map": [0.35, 0.30], "Route": [0.50, 0.55], "Stopwatch": [0.87, 0.65], "Step": [0.58, 0.81], "Fast": [0.58, 0.40], "Slow": [0.40, 0.90], "Far": [0.72, 0.27], "Near": [0.88, 0.89], "Brake": [0.195, 0.62]},
    "land2_estimation-comparison": {"Bigger": [0.115, 0.51], "Smaller": [0.255, 0.56], "Taller": [0.47, 0.22], "Shorter": [0.58, 0.34], "Heavier": [0.66, 0.50], "Lighter": [0.89, 0.44], "More than": [0.75, 0.58], "Less than": [0.93, 0.59], "Most": [0.66, 0.72], "Least": [0.80, 0.78], "Same": [0.33, 0.86], "Different": [0.56, 0.87]},
    "land2_measurement-at-home": {"Ruler": [0.735, 0.755], "Tape measure": [0.275, 0.83], "Scale": [0.25, 0.59], "Temperature": [0.065, 0.30], "Gallon": [0.065, 0.56], "Pint": [0.15, 0.63]},
    "land2_money-currency": {"Wallet": [0.50, 0.785], "Purse": [0.755, 0.705], "Coins": [0.645, 0.775], "Bill": [0.605, 0.855], "Credit card": [0.805, 0.82], "Check": [0.755, 0.91], "Receipt": [0.915, 0.65], "Spend": [0.63, 0.44], "Earn": [0.245, 0.62]},
    "land2_numbers-counting": {"One": [0.10, 0.685], "Two": [0.265, 0.745], "Three": [0.075, 0.835], "Four": [0.545, 0.785], "Five": [0.45, 0.73], "Six": [0.715, 0.75], "Seven": [0.305, 0.89], "Eight": [0.89, 0.915], "Nine": [0.105, 0.93], "Ten": [0.935, 0.445], "Zero": [0.52, 0.89], "Pair": [0.66, 0.89], "Count": [0.55, 0.455]},
    "land2_patterns-sequences": {"Pattern": [0.10, 0.32], "Repeat": [0.165, 0.475], "Sort": [0.37, 0.81], "Symmetry": [0.12, 0.65], "Sequence": [0.86, 0.80], "Growing pattern": [0.605, 0.80], "Next": [0.64, 0.635]},
    "land2_problem-solving-logic": {"Puzzle": [0.825, 0.875], "Clue": [0.625, 0.78], "Group": [0.215, 0.70], "Order": [0.505, 0.475], "Cause": [0.12, 0.85], "Effect": [0.24, 0.90], "Experiment": [0.08, 0.43], "Evidence": [0.225, 0.525]},
    "land2_shapes-geometry": {"Circle": [0.31, 0.73], "Square": [0.22, 0.16], "Rectangle": [0.17, 0.79], "Triangle": [0.2525, 0.515], "Oval": [0.34, 0.54], "Diamond": [0.51, 0.495], "Star": [0.545, 0.3525], "Heart": [0.515, 0.6175], "Sphere": [0.665, 0.7475], "Cube": [0.7825, 0.735], "Cylinder": [0.9475, 0.78], "Cone": [0.9025, 0.8925], "Pyramid": [0.8125, 0.885]},
    "land2_the-bank": {"Bank": [0.50, 0.28], "Teller": [0.585, 0.50], "ATM": [0.86, 0.53], "Safe": [0.115, 0.53], "Deposit": [0.395, 0.585], "Withdraw": [0.55, 0.605]},
    "land2_weights-measures": {"Scale": [0.86, 0.36], "Length": [0.25, 0.565], "Height": [0.25, 0.30], "Weight": [0.475, 0.425], "Volume": [0.0725, 0.565], "Ton": [0.75, 0.615], "Pound": [0.665, 0.425], "Area": [0.50, 0.85], "Perimeter": [0.13, 0.82]},
}

QA_NOTES = {
    "land2_cooking-measurements": "patched: 'Recipe card' title wiped from card",
    "land2_measurement-at-home": "patched: MILK wiped from carton; 'Liter' dropped (no juice bottle painted)",
    "land2_problem-solving-logic": "patched: '800' wiped from easel board",
    "land2_money-currency": "patched: BANK (card) + CHEQUE (paper) lettering healed out via pixel-mask",
    "land2_numbers-counting": ("patched: buttons 5->3, cherries 5->4, top egg tray 12->10, price-tag digits wiped; "
                               "'Dozen' dropped; anchors follow PAINTED groups, not objects_desc "
                               "(Three=buttons, Four=cherries, Five=strawberries, Seven=candles, "
                               "Eight=bottom carton, Ten=top tray; sunflowers x5 + second nest unlabeled surplus)"),
}

GARMENTS = ("the hero girl is a dark-skinned Black girl with a long side braid wearing her pink "
            "dress with a bow and pink shoes; the hero boy is a dark-skinned Black boy with short "
            "curly hair ALWAYS wearing his grey tech hoodie with glowing cyan hexagon panels and "
            "grey cargo pants, never a suit")

posters = json.load(io.open("posters.json", encoding="utf-8"))
by = {p["basename"].replace(".jpg", ""): p for p in posters}

for base, anch in ANCHORS.items():
    p = by[base]
    p["anchors"] = anch
    p["status"] = "anchored"
    if base in QA_NOTES:
        p["qa_note"] = QA_NOTES[base]

by["land2_measurement-at-home"]["words"].remove("Liter")
by["land2_numbers-counting"]["words"].remove("Dozen")

# ---- re-roll 1: budget-savings (Kwame in suit; readable RECEIPT header) ----
p = by["land2_budget-savings"]
p["status"] = "pending"
p["v1_scene_url"] = p.pop("scene_url", None)
p.pop("job_id", None)
p["objects_desc"]["Receipt"] = ("a long paper receipt covered only in wavy squiggle lines, "
                                "completely blank header, NO letters or words anywhere on it")
p["people_rule"] = ("The scene includes {heroes}, each appearing exactly once - " + GARMENTS +
                    " - plus ONE other village child receiving a lent toy; no other people.")

# ---- re-roll 2: fractions-decimals (wrong cut geometry) ---------------------
p = by["land2_fractions-decimals"]
p["status"] = "pending"
p["v1_scene_url"] = p.pop("scene_url", None)
p.pop("job_id", None)
p["objects_desc"].update({
    "One half": "a berry pie cut into exactly TWO equal half-circle pieces, slightly separated",
    "One third": "a round cake cut into exactly THREE equal wedges, one wedge lifted out",
    "One quarter": "a pizza cut into exactly FOUR equal quarter slices, one slice pulled away",
    "Three quarters": "a large round cookie with exactly one quarter missing, three quarters remaining",
})
shutil.copyfile("scenes/land2_fractions-decimals.png", "scenes/land2_fractions-decimals_v1backup.png")

# ---- re-roll 3: time-clocks (both heroes off-model; digital timer digits) ---
p = by["land2_time-clocks"]
p["status"] = "pending"
p["v1_scene_url"] = p.pop("scene_url", None)
p.pop("job_id", None)
p["people_rule"] = ("The scene includes {heroes}, each appearing exactly once - " + GARMENTS +
                    " - no other people.")
p["scene_extra"] = ("Strictly NO digital clocks, digital timers, segment displays or number "
                    "readouts anywhere - every clock face uses plain dot markers only.")

with io.open("posters.json", "w", encoding="utf-8") as f:
    json.dump(posters, f, indent=1, ensure_ascii=False)

n_anch = sum(1 for q in posters if q.get("status") == "anchored" and q["land"] == 2)
n_pend = sum(1 for q in posters if q.get("status") == "pending" and q["land"] == 2)
print("land2 anchored:", n_anch, "pending:", n_pend)
print("fractions v1 backed up")
