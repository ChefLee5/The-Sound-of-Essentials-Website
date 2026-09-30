import json
import shutil
from pathlib import Path
from collections import Counter

BASE = Path(r"C:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website\workbook")
src_json = BASE / "workbook_content.json"
backup_json = BASE / "workbook_content_pre_assimilation_backup.json"

# Create safety backup
shutil.copy2(src_json, backup_json)
print(f"[backup] Saved backup to {backup_json.name}")

with open(src_json, "r", encoding="utf-8") as f:
    data = json.load(f)

# The 125 curated images categorized
land1_imgs = [
    "land1_greetings-introductions.jpg",
    "land1_the-classroom.jpg",
    "land1_the-playground-recess.jpg",
    "land1_daily-routines.jpg",
    "land1_emotions-feelings.jpg",
    "land1_family-relationships.jpg",
    "land1_manners-politeness.jpg",
    "land1_clothing-getting-dressed.jpg",
    "land1_colors-patterns.jpg",
    "land1_communication-technology.jpg",
    "land1_days-months-numbers.jpg",
    "land1_hobbies-recreation.jpg",
    "land1_music-instruments.jpg",
    "land1_personal-information.jpg",
    "land1_pets-at-home.jpg",
    "land1_school-events-activities.jpg",
    "land1_the-home.jpg",
    "land1_the-neighborhood.jpg",
    "land1_body-language-gestures.jpg",
    "land1_celebrations-traditions.jpg",
]

land2_imgs = [
    "land2_numbers-counting.jpg",
    "land2_shapes-geometry.jpg",
    "land2_measurement-at-home.jpg",
    "land2_basic-math-operations.jpg",
    "land2_time-clocks.jpg",
    "land2_money-currency.jpg",
    "land2_the-grocery-store-shopping.jpg",
    "land2_patterns-sequences.jpg",
    "land2_budget-savings.jpg",
    "land2_calendar-math.jpg",
    "land2_charts-graphs.jpg",
    "land2_cooking-measurements.jpg",
    "land2_data-statistics.jpg",
    "land2_distance-speed.jpg",
    "land2_estimation-comparison.jpg",
    "land2_fractions-decimals.jpg",
    "land2_problem-solving-logic.jpg",
    "land2_the-bank.jpg",
    "land2_weights-measures.jpg",
    "land7_digital-time-screens.jpg",
]

land3_imgs = [
    "land3_the-garden.jpg",
    "land3_seeds-growing.jpg",
    "land3_farm-to-table.jpg",
    "land3_trees-the-forest.jpg",
    "land3_weather-seasons.jpg",
    "land3_wild-animals.jpg",
    "land3_silas-vestas-cottage-outside.jpg",
    "land3_the-barnyard.jpg",
    "land3_the-environment.jpg",
    "land3_the-ocean-beach.jpg",
    "land3_camping-hiking.jpg",
    "land3_desert-dry-lands.jpg",
    "land3_fruits-vegetables.jpg",
    "land3_insects-bugs.jpg",
    "land3_inside-the-home.jpg",
    "land3_pets-companions.jpg",
    "land3_recycling-sustainability.jpg",
    "land3_rivers-lakes.jpg",
    "land3_rocks-minerals.jpg",
    "land3_shapes-in-the-world.jpg",
    # 8 Land 7 science & nature images for 28 total science scenes:
    "land7_the-solar-system.jpg",
    "land7_planet-earth.jpg",
    "land7_energy-forces.jpg",
    "land7_the-water-cycle-weather-systems.jpg",
    "land7_the-scientific-method.jpg",
    "land7_environment-sustainability.jpg",
    "land7_seasons-time-in-nature.jpg",
    "land7_time-concepts-history.jpg",
]

land5_imgs = [
    "land5_exercise-movement.jpg",
    "land5_sports-fitness.jpg",
    "land5_healthy-habits-hygiene.jpg",
    "land5_nutrition-food-groups.jpg",
    "land5_inside-the-body.jpg",
    "land5_sleep-rest.jpg",
    "land5_mental-health-emotions.jpg",
    "land5_eye-care-vision.jpg",
    "land5_first-aid-injuries.jpg",
    "land5_meal-time.jpg",
    "land5_personal-care-products.jpg",
    "land5_the-dentist.jpg",
    "land5_the-doctors-office.jpg",
    "land5_the-kitchen.jpg",
    "land5_the-pharmacy.jpg",
    "land5_the-produce-market.jpg",
]

# 16 unique Land 4 images for the 16 Mon/Wed days:
land4_imgs = [
    "land4_directions-navigation.jpg",
    "land4_geography-landforms.jpg",
    "land4_map-reading-gps.jpg",
    "land4_the-ocean-marine-life.jpg",
    "land4_freshwater-life.jpg",
    "land4_bicycle-walking.jpg",
    "land4_community-places.jpg",
    "land4_emergency-services.jpg",
    "land4_hotels-lodging.jpg",
    "land4_mail-postal-services.jpg",
    "land4_public-transportation.jpg",
    "land4_road-signs-safety.jpg",
    "land4_seasons-nature-cycles.jpg",
    "land4_the-airport-travel.jpg",
    "land4_transportation.jpg",
    "land4_weather-climate.jpg",
]

# 16 unique Land 6 images for the 16 Tue/Thu days:
land6_imgs = [
    "land6_community-helpers-services.jpg",
    "land6_occupations-careers.jpg",
    "land6_tools-construction.jpg",
    "land6_rights-responsibilities.jpg",
    "land6_government-civics.jpg",
    "land6_safety-emergencies.jpg",
    "land6_school-subjects-education.jpg",
    "land6_types-of-workers.jpg",
    "land6_voting-elections.jpg",
    "land6_banking-online-services.jpg",
    "land6_childcare-parenting.jpg",
    "land6_forms-documents.jpg",
    "land6_job-interview-skills.jpg",
    "land6_legal-court-terms.jpg",
    "land6_money-management-bills.jpg",
    "land6_resume-applications.jpg",
]

# 8 unique Land 7 images for the 8 Friday review days:
land7_friday_imgs = [
    "land7_inventions-discoveries.jpg",
    "land7_the-future-dreams.jpg",
    "land7_ages-life-stages.jpg",
    "land7_historical-timekeeping.jpg",
    "land7_telling-time-clocks.jpg",
    "land7_the-calendar-cycles.jpg",
    "land7_time-in-music-rhythm.jpg",
    "land7_energy-forces.jpg",
]

def make_alt(filename: str) -> str:
    clean = filename.split("_", 1)[-1].replace(".jpg", "").replace(".png", "").replace("-", " ")
    return clean.title() + " Illustration"

day_index = 0
mon_wed_index = 0
tue_thu_index = 0
fri_index = 0

for w in data.get("weeks", []):
    wn = w.get("week", 1)
    for d in w.get("days", []):
        dn = d.get("day", 1)
        b = d.get("blocks", {})
        
        # 1. Block A (Reading & Phonics): Land 1
        a_img = land1_imgs[day_index % len(land1_imgs)]
        if "A" in b:
            b["A"]["img"] = a_img
            b["A"]["img_alt"] = make_alt(a_img)
            b["A"].pop("img_source", None)
            
        # 2. Block B (Math & Problem Solving): Land 2
        b_img = land2_imgs[day_index % len(land2_imgs)]
        if "B" in b:
            b["B"]["img"] = b_img
            b["B"]["img_alt"] = make_alt(b_img)
            b["B"].pop("img_source", None)

        # 3. Block C (Science & Nature): Land 3 + Land 7 Science
        c_img = land3_imgs[day_index % len(land3_imgs)]
        if "C" in b:
            b["C"]["img"] = c_img
            b["C"]["img_alt"] = make_alt(c_img)
            b["C"].pop("img_source", None)

        # 4. Block D (Daily Movement & Health): Land 5
        d_img = land5_imgs[day_index % len(land5_imgs)]
        if "D" in b:
            b["D"]["img"] = d_img
            b["D"]["img_alt"] = make_alt(d_img)
            b["D"].pop("img_source", None)

        # 5. Block E (Rotating Subject):
        # Mon (Day 1) & Wed (Day 3) -> Land 4 Aquaria (16 unique across 8 weeks)
        # Tue (Day 2) & Thu (Day 4) -> Land 6 Luminosity (16 unique across 8 weeks)
        # Fri (Day 5) -> Land 7 Celestia (8 unique across 8 weeks)
        if "E" in b:
            b["E"].pop("img_source", None)
            if dn in (1, 3):
                e_img = land4_imgs[mon_wed_index % len(land4_imgs)]
                mon_wed_index += 1
            elif dn in (2, 4):
                e_img = land6_imgs[tue_thu_index % len(land6_imgs)]
                tue_thu_index += 1
            else: # Day 5 (Fri)
                e_img = land7_friday_imgs[fri_index % len(land7_friday_imgs)]
                fri_index += 1
            b["E"]["img"] = e_img
            b["E"]["img_alt"] = make_alt(e_img)

        # 6. Blocks G, H, I, J: Remove image fields and dictionary references completely
        for slot in ("G", "H", "I", "J"):
            if slot in b:
                b[slot].pop("img", None)
                b[slot].pop("img_alt", None)
                b[slot].pop("img_source", None)

        day_index += 1

with open(src_json, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"[success] Processed {day_index} days across 8 weeks.")
print(f"          Mon/Wed unique Land 4 images used: {mon_wed_index}")
print(f"          Tue/Thu unique Land 6 images used: {tue_thu_index}")
print(f"          Friday unique Land 7 images used:  {fri_index}")
