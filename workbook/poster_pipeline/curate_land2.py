#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply Land 2 (math land, heroes Octavia & Kwame) curation into posters.json.

Math-land policy: numbers taught by COUNTABLE OBJECTS, comparisons by object
pairs, operations by wooden symbol blocks + hero actions. Words that only
exist as digits/symbols/labels (Numerator, PIN, A.M., unit abbreviations)
are not curated. Expect a pixel-patch pass for stray digits regardless.
"""
import io
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent
POSTERS = BASE / "posters.json"

C = {}

C["land2_basic-math-operations.jpg"] = dict(
    words=["Add", "Subtract", "Plus", "Minus", "Equals", "Calculate"],
    objects_desc={
        "Add": "the hero boy combining two small piles of apples into one basket",
        "Subtract": "the hero girl taking two pears out of a full basket",
        "Plus": "a large wooden plus-symbol block",
        "Minus": "a large wooden minus-symbol block",
        "Equals": "a large wooden equals-symbol block of two stacked bars",
        "Calculate": "a wooden abacus with colorful beads",
    })

C["land2_budget-savings.jpg"] = dict(
    words=["Piggy bank", "Wallet", "Savings", "Goal", "Receipt", "Tip", "Lend"],
    people_rule=("The scene includes {heroes}, each appearing exactly once, "
                 "plus ONE other village child receiving a lent toy - no other people."),
    objects_desc={
        "Piggy bank": "a pink piggy bank on a shelf",
        "Wallet": "an open leather wallet",
        "Savings": "a glass jar filled with gold coins",
        "Goal": "a child's drawing of a red bicycle pinned above the savings jar",
        "Receipt": "a long paper receipt covered only in wavy squiggle lines",
        "Tip": "a small dish holding a few coins beside a teacup",
        "Lend": "the hero boy handing a toy truck to another child",
    })

C["land2_calendar-math.jpg"] = dict(
    words=["Morning", "Noon", "Evening", "Midnight", "Schedule"],
    objects_desc={
        "Morning": "a round window showing a golden sunrise over the village",
        "Noon": "a round window showing the bright sun high in a blue sky",
        "Evening": "a round window showing an orange dusk with a lit lantern",
        "Midnight": "a round window showing a crescent moon and stars",
        "Schedule": "a wall planner of blank squares decorated with small picture stickers",
    },
    scene_extra=("A cozy room whose wall holds FOUR round windows in a row, each "
                 "showing the same village at a different time of day."))

C["land2_charts-graphs.jpg"] = dict(
    words=["Bar graph", "Pie chart", "Line graph", "Tally", "Survey"],
    people_rule=("The scene includes {heroes}, each appearing exactly once, plus "
                 "TWO villagers being surveyed - no other people."),
    objects_desc={
        "Bar graph": ("a large easel poster with three plain colored bars of "
                      "different heights, topped with small fruit pictures"),
        "Pie chart": "a round poster divided into plain colored slices",
        "Line graph": "a poster with a single rising zigzag line",
        "Tally": "a small chalkboard with neat groups of five chalk strokes",
        "Survey": ("the hero girl holding a clipboard of squiggle lines while "
                   "asking two villagers questions"),
    })

C["land2_cooking-measurements.jpg"] = dict(
    words=["Recipe", "Ingredient", "Measuring cup", "Measuring spoon", "Whisk",
           "Spatula", "Sift", "Stir", "Mix", "Pour", "Bake", "Timer"],
    objects_desc={
        "Recipe": "a recipe card showing a cake picture and wavy squiggle lines",
        "Ingredient": "a basket holding eggs, a flour sack and butter",
        "Measuring cup": "a clear measuring cup with plain tick marks",
        "Measuring spoon": "a ring of nested measuring spoons",
        "Whisk": "a wire whisk",
        "Spatula": "a rubber spatula",
        "Sift": "a flour sifter dusting flour onto dough",
        "Stir": "the hero boy stirring a big bowl with a wooden spoon",
        "Mix": "a mixing bowl of swirled two-color batter",
        "Pour": "the hero girl pouring milk from a jug into a bowl",
        "Bake": "golden cookies on a baking tray beside a warm oven",
        "Timer": "a rounded kitchen timer with a plain dial and no numbers",
    })

C["land2_data-statistics.jpg"] = dict(
    words=["Half", "Double", "Triple", "Rank", "Score"],
    people_rule=("The scene includes {heroes}, each appearing exactly once, plus "
                 "THREE children standing on podium steps - no other people."),
    objects_desc={
        "Half": "an apple sliced into two equal halves on a board",
        "Double": "a plate with two identical cupcakes beside a plate with one",
        "Triple": "an ice-cream cone stacked with three scoops",
        "Rank": "three blank podium steps of different heights with children on them",
        "Score": "a chalkboard with two columns of tally strokes",
    })

C["land2_distance-speed.jpg"] = dict(
    words=["Map", "Route", "Stopwatch", "Step", "Fast", "Slow", "Far", "Near",
           "Brake"],
    objects_desc={
        "Map": "a pictorial village map pinned to a post, no words on it",
        "Route": "a winding dotted trail on the ground leading to a small flag",
        "Stopwatch": "a stopwatch with a plain face and no numbers",
        "Step": "a trail of footprints crossing a sandy patch",
        "Fast": "the hero boy sprinting with speed lines behind him",
        "Slow": "a small turtle walking calmly beside the path",
        "Far": "a tiny house on the far horizon",
        "Near": "a large flowerpot right at the front of the scene",
        "Brake": "the hero girl braking her bicycle to a gentle stop",
    })

C["land2_estimation-comparison.jpg"] = dict(
    words=["Bigger", "Smaller", "Taller", "Shorter", "Heavier", "Lighter",
           "More than", "Less than", "Most", "Least", "Same", "Different"],
    objects_desc={
        "Bigger": "a huge pumpkin",
        "Smaller": "a tiny pumpkin beside it",
        "Taller": "a very tall sunflower",
        "Shorter": "a short sunflower next to it",
        "Heavier": "the balance-scale pan sunk low holding a watermelon",
        "Lighter": "the balance-scale pan risen high holding a single strawberry",
        "More than": "a basket overflowing with apples",
        "Less than": "a basket holding only two apples",
        "Most": "the fullest of three marble jars",
        "Least": "the emptiest of three marble jars",
        "Same": "two perfectly identical striped kittens sitting together",
        "Different": "one spotted puppy sitting among the kittens",
    })

C["land2_fractions-decimals.jpg"] = dict(
    words=["Whole", "One half", "One third", "One quarter", "Three quarters",
           "Part", "Equal parts", "Fraction"],
    objects_desc={
        "Whole": "an uncut round golden pie",
        "One half": "a berry pie cut into two equal halves, slightly separated",
        "One third": "a round cake cut into three equal wedges with one lifted out",
        "One quarter": "a pizza with a single quarter slice pulled away",
        "Three quarters": "a large cookie with one bite-quarter missing",
        "Part": "a single pie slice alone on a small plate",
        "Equal parts": "a chocolate bar snapped into equal square pieces",
        "Fraction": "a wooden toy circle of removable colored equal wedges",
    })

C["land2_measurement-at-home.jpg"] = dict(
    words=["Ruler", "Tape measure", "Scale", "Temperature", "Gallon", "Pint",
           "Liter"],
    objects_desc={
        "Ruler": "a wooden ruler with plain tick marks and no numbers",
        "Tape measure": "a yellow tape measure partly pulled out, plain ticks only",
        "Scale": "a kitchen scale with a plain dial",
        "Temperature": "a wall thermometer with a red column and plain tick marks",
        "Gallon": "a big round milk jug",
        "Pint": "a small milk carton",
        "Liter": "a tall slim juice bottle",
    })

C["land2_money-currency.jpg"] = dict(
    words=["Wallet", "Purse", "Coins", "Bill", "Credit card", "Check",
           "Receipt", "Spend", "Earn"],
    people_rule=("The scene includes {heroes}, each appearing exactly once, plus "
                 "ONE friendly adult shopkeeper - no other people."),
    objects_desc={
        "Wallet": "an open leather wallet",
        "Purse": "a small red coin purse with a clasp",
        "Coins": "a neat pile of plain gold and silver coins with no markings",
        "Bill": "paper banknotes decorated only with plain scroll patterns, no numbers",
        "Credit card": "a plain blue bank card with a gold chip and no writing",
        "Check": "a paper cheque covered only in wavy squiggle lines",
        "Receipt": "a long till receipt of squiggle lines curling off the counter",
        "Spend": "the hero girl handing a coin to the shopkeeper for a pear",
        "Earn": "the hero boy receiving a coin after sweeping with his broom",
    })

C["land2_numbers-counting.jpg"] = dict(
    words=["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
           "Nine", "Ten", "Zero", "Pair", "Dozen", "Count"],
    objects_desc={
        "One": "one shiny red apple alone on a stool",
        "Two": "two green pears side by side",
        "Three": "three bananas in a bunch",
        "Four": "four strawberries in a square tray",
        "Five": "five cherries laid in a row",
        "Six": "six oranges in a wooden bowl",
        "Seven": "seven sunflowers standing in a row of pots",
        "Eight": "eight large buttons in a line on a shelf",
        "Nine": "nine marbles resting in a square grid tray",
        "Ten": "ten candles standing on a rack",
        "Zero": "a cozy bird nest that is completely empty",
        "Pair": "a pair of red mittens pinned together",
        "Dozen": "an egg carton holding twelve eggs",
        "Count": "the hero boy counting on his fingers",
    })

C["land2_patterns-sequences.jpg"] = dict(
    words=["Pattern", "Repeat", "Sort", "Symmetry", "Sequence",
           "Growing pattern", "Next"],
    objects_desc={
        "Pattern": "a bead necklace with a strict red-blue-red-blue pattern",
        "Repeat": "a wall border of hearts and stars repeating along the shelf",
        "Sort": "the hero girl sorting red and green apples into two baskets",
        "Symmetry": "a butterfly with perfectly mirrored wings resting on a flower",
        "Sequence": "a line of nesting dolls arranged from biggest to smallest",
        "Growing pattern": "stacked blocks forming stairs: one, then two, then three",
        "Next": "a bead string with one empty space and the matching bead waiting beside it",
    })

C["land2_problem-solving-logic.jpg"] = dict(
    words=["Puzzle", "Clue", "Group", "Order", "Cause", "Effect", "Experiment",
           "Evidence"],
    objects_desc={
        "Puzzle": "a half-finished jigsaw puzzle on a table",
        "Clue": "a magnifying glass held over a single muddy paw print",
        "Group": "toys sorted into two hoops - balls in one, blocks in the other",
        "Order": "three children lined up neatly from shortest to tallest",
        "Cause": "a tipped-over watering can",
        "Effect": "the puddle spreading from the tipped can",
        "Experiment": "two potted plants side by side - one tall in sunlight, one small in shade",
        "Evidence": "a trail of muddy paw prints leading to a happy dog",
    },
    people_rule=("The scene includes {heroes}, each appearing exactly once as "
                 "young detectives, plus THREE other children lined up by height "
                 "- no other people."))

C["land2_shapes-geometry.jpg"] = dict(
    words=["Circle", "Square", "Rectangle", "Triangle", "Oval", "Diamond",
           "Star", "Heart", "Sphere", "Cube", "Cylinder", "Cone", "Pyramid"],
    objects_desc={
        "Circle": "a round blue wooden hoop",
        "Square": "a square orange picture frame",
        "Rectangle": "a rectangular red door mat",
        "Triangle": "a silver triangle instrument hanging from a stand",
        "Oval": "an oval mirror",
        "Diamond": "a diamond-shaped kite leaning on the wall",
        "Star": "a golden star ornament",
        "Heart": "a heart-shaped red cushion",
        "Sphere": "a striped beach ball",
        "Cube": "a large plain wooden toy block",
        "Cylinder": "a tall cylindrical drum",
        "Cone": "an orange traffic cone",
        "Pyramid": "a small wooden pyramid toy",
    })

C["land2_the-bank.jpg"] = dict(
    words=["Bank", "Teller", "ATM", "Safe", "Deposit", "Withdraw"],
    people_rule=("The scene includes {heroes}, each appearing exactly once, plus "
                 "ONE friendly adult bank teller behind the counter - no other people."),
    objects_desc={
        "Bank": "the grand wooden counter hall of a small village bank with columns",
        "Teller": "a friendly adult teller smiling behind the counter window",
        "ATM": "a wall machine with a softly glowing blank screen and a card slot",
        "Safe": "a big round steel vault door standing ajar",
        "Deposit": "the hero girl handing a jar of coins across the counter",
        "Withdraw": "the teller handing plain banknotes to the hero boy",
    })

C["land2_time-clocks.jpg"] = dict(
    words=["Clock", "Watch", "Hour hand", "Minute hand", "Alarm", "Timer",
           "Stopwatch", "Sunrise", "Sunset"],
    objects_desc={
        "Clock": "a huge analog wall clock with plain dot markers and no numbers",
        "Watch": "a wristwatch displayed on a stand",
        "Hour hand": "the short thick hand of the huge wall clock",
        "Minute hand": "the long thin hand of the huge wall clock",
        "Alarm": "a twin-bell alarm clock",
        "Timer": "an hourglass with golden sand flowing",
        "Stopwatch": "a stopwatch with a plain face",
        "Sunrise": "a window showing the sun rising golden over hills",
        "Sunset": "a window showing an orange sun setting",
    })

C["land2_weights-measures.jpg"] = dict(
    words=["Scale", "Length", "Height", "Weight", "Volume", "Ton", "Pound",
           "Area", "Perimeter"],
    objects_desc={
        "Scale": "a tall standing balance scale with two brass pans",
        "Length": "a long ribbon stretched out flat along a table edge",
        "Height": "the hero girl being measured against a wall growth chart of plain tick marks",
        "Weight": "the hero boy placing a pumpkin onto one scale pan",
        "Volume": "a glass pitcher half full of orange juice",
        "Ton": "a cartoon elephant statue standing on a huge platform scale",
        "Pound": "a plain small sack of sugar resting on a scale pan",
        "Area": "a checkered picnic blanket made of clear square patches",
        "Perimeter": "a low wooden fence running all the way around a flower bed",
    })


def main():
    posters = json.load(io.open(POSTERS, encoding="utf-8"))
    by_name = {p["basename"]: p for p in posters}
    total = 0
    for name, cur in C.items():
        p = by_name[name]
        assert p["status"] == "pending", f"{name} is {p['status']}"
        pool = set(p["vocab_pool"])
        missing = [w for w in cur["words"] if w not in pool]
        assert not missing, f"{name}: not in pool: {missing}"
        p["words"] = cur["words"]
        p["objects_desc"] = cur["objects_desc"]
        if "people_rule" in cur:
            p["people_rule"] = cur["people_rule"]
        if "scene_extra" in cur:
            p["scene_extra"] = cur["scene_extra"]
        total += len(cur["words"])
        print(f"{name}: {len(cur['words'])} words")
    io.open(POSTERS, "w", encoding="utf-8").write(
        json.dumps(posters, indent=2, ensure_ascii=False))
    print(f"\ncurated {len(C)} posters, {total} words")


if __name__ == "__main__":
    main()
