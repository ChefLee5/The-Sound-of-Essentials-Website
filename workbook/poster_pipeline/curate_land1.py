#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Apply Land 1 (Harmonia) word curation into posters.json.

Curation rules (owner notes 2026-07-09):
- 15-20 depictable words where the pool allows; text-by-nature topics
  (days/months, personal info, greetings) get a smaller honest set.
- objects_desc gives each non-obvious word a purely VISUAL description so the
  model never needs painted text; papers show squiggles, calendars are blank.
- people_rule overrides the strict two-hero clause only on pages that need
  extra figures; every extra figure exists to anchor exactly one word.
"""
import io
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent
POSTERS = BASE / "posters.json"

C = {}

C["land1_body-language-gestures.jpg"] = dict(
    words=["Point", "Shrug", "Thumbs up", "Thumbs down", "Clap", "Frown",
           "Yawn", "Stretch", "Cross arms", "High five", "Shake hands", "Bow"],
    people_rule=("The scene shows {heroes}, appearing exactly once as a pair "
                 "giving each other a joyful high five, plus about ten OTHER "
                 "diverse village children of varied appearance (none repeated, "
                 "all clearly different from the two heroes), each frozen "
                 "clearly performing exactly one different gesture from the "
                 "object list. No adults anywhere."),
    objects_desc={
        "Point": "a child pointing far into the distance with an outstretched arm",
        "Shrug": "a child shrugging with both palms turned up and shoulders raised",
        "Thumbs up": "a child giving a big thumbs-up",
        "Thumbs down": "a child giving a clear thumbs-down",
        "Clap": "a child clapping hands together",
        "Frown": "a child with an exaggerated frowning face",
        "Yawn": "a child yawning widely with a hand over the mouth",
        "Stretch": "a child stretching both arms high overhead",
        "Cross arms": "a child standing with arms firmly crossed",
        "High five": "the two hero children giving each other a joyful high five",
        "Shake hands": "two other children shaking hands",
        "Bow": "a child bowing politely from the waist",
    })

C["land1_celebrations-traditions.jpg"] = dict(
    words=["Parade", "Fireworks", "Candle", "Decoration", "Costume", "Gift",
           "Wrap", "Card", "Feast", "Toast", "Invitation"],
    people_rule=("The scene includes {heroes}, each appearing exactly once, "
                 "celebrating among a handful of festive villagers as listed "
                 "in the object list."),
    scene_extra=("Warm dusk lighting. Keep the very top center a calm dusk "
                 "sky; the fireworks bursts sit lower, off to the sides."),
    objects_desc={
        "Parade": "a small festive parade of drummers marching down the background street",
        "Fireworks": "colorful fireworks bursting in the evening sky at mid height",
        "Candle": "a tall lit candle in a brass holder",
        "Decoration": "colorful paper garlands and hanging lanterns strung overhead",
        "Costume": "a small child wearing a bright festival dragon costume",
        "Gift": "a wrapped gift box with a large ribbon bow",
        "Wrap": "a roll of patterned wrapping paper with ribbon beside it",
        "Card": "a folded greeting card standing open, decorated only with a drawn heart",
        "Feast": "a long table covered with festive dishes and fruit platters",
        "Toast": "two villagers raising their cups together in a cheerful toast",
        "Invitation": "an envelope sealed with a red wax stamp resting on a small tray",
    })

C["land1_clothing-getting-dressed.jpg"] = dict(
    words=["Shirt", "Pants", "Shorts", "Skirt", "Dress", "Sweater", "Jacket",
           "Tie", "Socks", "Shoes", "Boots", "Sandals", "Slippers", "Hat",
           "Scarf", "Gloves", "Belt", "Hanger", "Iron"],
    objects_desc={
        "Shirt": "a collared button-up shirt displayed on a clothes rack",
        "Pants": "a pair of long pants folded over a rail",
        "Shorts": "a pair of shorts",
        "Skirt": "a pleated skirt",
        "Dress": "a pretty summer dress on a dress form",
        "Sweater": "a knitted sweater folded on a shelf",
        "Jacket": "a jacket on a coat hook",
        "Tie": "a necktie draped on a stand",
        "Socks": "a pair of rolled colorful socks",
        "Shoes": "a pair of neat lace-up shoes",
        "Boots": "a pair of tall rain boots",
        "Sandals": "a pair of open sandals",
        "Slippers": "a pair of fluffy bunny slippers",
        "Hat": "a wide-brim sun hat",
        "Scarf": "a long soft scarf",
        "Gloves": "a pair of warm gloves",
        "Belt": "a leather belt coiled on a shelf",
        "Hanger": "an empty wooden clothes hanger",
        "Iron": "a clothes iron resting upright on an ironing board",
    })

C["land1_colors-patterns.jpg"] = dict(
    words=["Red", "Blue", "Yellow", "Green", "Orange", "Purple", "Pink",
           "Brown", "Black", "White", "Gray", "Striped", "Plaid", "Polka dot"],
    objects_desc={
        "Red": "a bright red kite",
        "Blue": "a solid blue bouncing ball",
        "Yellow": "a tall yellow sunflower in a pot",
        "Green": "a green watering can",
        "Orange": "a plump orange pumpkin",
        "Purple": "a purple butterfly resting on a fence",
        "Pink": "a pink piggy bank",
        "Brown": "a brown teddy bear sitting on a crate",
        "Black": "a black cat sitting upright",
        "White": "a white dove perched on a post",
        "Gray": "a smooth gray stone garden statue of a rabbit",
        "Striped": "a striped scarf draped over a chair",
        "Plaid": "a plaid picnic blanket spread on the grass",
        "Polka dot": "an open polka-dot umbrella leaning against a bench",
    })

C["land1_communication-technology.jpg"] = dict(
    words=["Phone", "Cell phone", "Keyboard", "Mouse", "Printer", "Charger",
           "Headphones", "Speaker", "Camera", "Screen", "Letter", "Envelope",
           "Stamp", "Newspaper", "Magazine"],
    objects_desc={
        "Phone": "an old-fashioned red corded telephone",
        "Cell phone": "a modern smartphone with a softly glowing blank screen",
        "Keyboard": "a computer keyboard with blank keys",
        "Mouse": "a computer mouse on a mouse pad",
        "Printer": "a desktop printer with blank paper in its tray",
        "Charger": "a charging cable coiled beside a wall plug",
        "Headphones": "a pair of headphones on a stand",
        "Speaker": "a small round speaker",
        "Camera": "a camera on a neck strap",
        "Screen": "a computer monitor showing only simple colorful shapes",
        "Letter": "a letter written entirely in wavy squiggle lines",
        "Envelope": "a plain envelope",
        "Stamp": "an oversized postage stamp with a simple flower picture",
        "Newspaper": "a folded newspaper printed only with wavy squiggle lines and a simple picture",
        "Magazine": "a glossy magazine with a picture-only cover",
    })

C["land1_daily-routines.jpg"] = dict(
    words=["Alarm clock", "Brush teeth", "Wash face", "Comb hair",
           "Get dressed", "Eat breakfast", "Pack lunch", "Do homework",
           "Read a book", "Take a bath", "Feed the pet", "Water plants",
           "Take out trash", "Go to sleep"],
    objects_desc={
        "Alarm clock": "a simple ringing analog alarm clock with plain dot markings",
        "Brush teeth": "a bathroom sink with a toothbrush and toothpaste in a cup",
        "Wash face": "a wash basin with a soft towel and a bar of soap",
        "Comb hair": "a comb resting beside a hand mirror",
        "Get dressed": "school clothes laid out neatly on a chair",
        "Eat breakfast": "a breakfast bowl and toast set on the kitchen table",
        "Pack lunch": "an open lunchbox being filled with fruit",
        "Do homework": "a small desk with an open blank notebook and a pencil",
        "Read a book": "an open picture book resting on an armchair",
        "Take a bath": "a bathtub with bubbles and a rubber duck",
        "Feed the pet": "a puppy waiting eagerly at a full food bowl",
        "Water plants": "a watering can beside potted plants on a windowsill",
        "Take out trash": "a tied trash bag waiting beside the door",
        "Go to sleep": "a cozy bed with a teddy bear under a crescent-moon window",
    })

C["land1_days-months-numbers.jpg"] = dict(
    words=["Calendar", "Birthday", "Holiday", "Season"],
    objects_desc={
        "Calendar": "a large wall calendar with a completely blank grid",
        "Birthday": "a birthday cake with lit candles",
        "Holiday": "a string of small festive pennant flags",
        "Season": ("a magical tree with four quarters: spring blossoms, green "
                   "summer leaves, orange autumn leaves and snowy winter branches"),
    })

C["land1_emotions-feelings.jpg"] = dict(
    words=["Happy", "Surprised", "Sad", "Angry", "Scared", "Excited", "Tired",
           "Shy", "Proud", "Confused", "Calm", "Bored"],
    people_rule=("The scene includes {heroes}, each appearing exactly once "
                 "({h1} laughing happily, {h2} looking amazed and surprised), "
                 "plus ten OTHER diverse village children (all clearly "
                 "different from the two heroes, none repeated), each clearly "
                 "showing exactly one different feeling from the object list. "
                 "No adults anywhere."),
    objects_desc={
        "Happy": "the laughing happy hero boy",
        "Surprised": "the amazed hero girl with wide eyes and an open mouth",
        "Sad": "a child with teary downcast eyes",
        "Angry": "a child with furrowed brows and puffed red cheeks",
        "Scared": "a child hiding behind their hands, peeking out",
        "Excited": "a child jumping with both arms up in delight",
        "Tired": "a drowsy child rubbing one eye",
        "Shy": "a child peeking out from behind a tree",
        "Proud": "a child standing tall holding a small gold medal",
        "Confused": "a child scratching their head with a puzzled tilt",
        "Calm": "a child sitting cross-legged peacefully under a tree",
        "Bored": "a child slumped with chin in hands on a bench",
    })

C["land1_family-relationships.jpg"] = dict(
    words=["Mother", "Father", "Baby", "Toddler", "Teenager", "Grandmother",
           "Grandfather", "Twin", "Family"],
    people_rule=("The scene includes {heroes}, each appearing exactly once "
                 "among the guests, plus ONE warm multi-generation village "
                 "family exactly as listed in the object list - no other "
                 "people anywhere."),
    objects_desc={
        "Mother": "a gentle mother pouring tea",
        "Father": "a father carrying a picnic basket",
        "Baby": "a baby asleep in a basket cradle",
        "Toddler": "a toddler taking wobbly first steps",
        "Teenager": "a tall teenager wearing headphones",
        "Grandmother": "a silver-haired grandmother knitting in a chair",
        "Grandfather": "a grandfather with a cane and a warm smile",
        "Twin": "twin children in matching outfits standing together",
        "Family": "the whole family gathered around a picnic table",
    })

C["land1_greetings-introductions.jpg"] = dict(
    words=["Handshake", "Wave", "Bow", "Hug", "Smile", "Friend"],
    people_rule=("The scene includes {heroes}, appearing exactly once as a "
                 "pair walking arm in arm as friends, plus a few pairs of "
                 "friendly villagers greeting one another exactly as listed "
                 "in the object list."),
    objects_desc={
        "Handshake": "two villagers shaking hands",
        "Wave": "a child waving cheerfully",
        "Bow": "two children bowing politely to each other",
        "Hug": "two friends hugging warmly",
        "Smile": "a villager with a big warm smile",
        "Friend": "the two hero children walking arm in arm as friends",
    })

C["land1_hobbies-recreation.jpg"] = dict(
    words=["Read", "Draw", "Paint", "Bake", "Garden", "Ride a bike",
           "Skateboard", "Soccer", "Basketball", "Tennis", "Board game",
           "Puzzle", "Knit", "Camp", "Fish", "Photography"],
    objects_desc={
        "Read": "an open picture book on a blanket",
        "Draw": "a sketchpad with a simple flower doodle and colored pencils",
        "Paint": "an easel holding a colorful painting of simple shapes",
        "Bake": "a tray of decorated cupcakes on a stand",
        "Garden": "a trowel and flower pots on a small garden bed",
        "Ride a bike": "a bright bicycle on its kickstand",
        "Skateboard": "a skateboard",
        "Soccer": "a soccer ball",
        "Basketball": "a basketball beside a hoop",
        "Tennis": "a tennis racket with a ball",
        "Board game": ("an open board game with dice and pawns, its board "
                       "decorated only with colored squares"),
        "Puzzle": "a half-finished jigsaw puzzle",
        "Knit": "a ball of yarn with knitting needles",
        "Camp": "a small camping tent",
        "Fish": "a fishing rod leaning on a bucket",
        "Photography": "a camera resting on a folded tripod",
    })

C["land1_manners-politeness.jpg"] = dict(
    words=["Share", "Take turns", "Listen", "Apologize", "Kind", "Gentle",
           "Bless you", "After you"],
    people_rule=("The scene includes {heroes}, appearing exactly once as the "
                 "pair sharing a plate of cookies, plus a few OTHER polite "
                 "village children in small scenes exactly as listed in the "
                 "object list, and ONE kindly adult holding the door open."),
    objects_desc={
        "Share": "the two hero children sharing a plate of cookies",
        "Take turns": "children waiting in a neat happy line to look through a telescope",
        "Listen": "a child listening attentively with a hand cupped to one ear",
        "Apologize": "a child with hands together apologizing to a friend over a dropped ice cream",
        "Kind": "a child helping another child up from the ground",
        "Gentle": "a child gently petting a small cat",
        "Bless you": "a child sneezing into a tissue while a friend offers the tissue box",
        "After you": "a kindly adult holding the door open as a child walks through",
    })

C["land1_music-instruments.jpg"] = dict(
    words=["Piano", "Guitar", "Drum", "Violin", "Flute", "Trumpet",
           "Tambourine", "Xylophone", "Microphone", "Headphones", "Note",
           "Choir", "Performer", "Audience", "Record"],
    people_rule=("The scene includes {heroes}, each appearing exactly once "
                 "performing on stage, plus a small children's choir and a "
                 "seated audience of villagers exactly as listed in the "
                 "object list."),
    scene_extra="Open evening sky above the stage stays calm and clear.",
    objects_desc={
        "Piano": "an upright piano",
        "Guitar": "an acoustic guitar on a stand",
        "Drum": "a big drum",
        "Violin": "a violin resting on a chair",
        "Flute": "a silver flute on a cushion",
        "Trumpet": "a shining trumpet",
        "Tambourine": "a tambourine",
        "Xylophone": "a rainbow xylophone with mallets",
        "Microphone": "a standing microphone",
        "Headphones": "a pair of headphones resting on a stool",
        "Note": "a large golden music-note decoration hanging above the stage",
        "Choir": "a small choir of children singing on risers",
        "Performer": "the hero girl performing at center stage",
        "Audience": "rows of villagers seated watching the show",
        "Record": "a vinyl record leaning beside a record player",
    })

C["land1_personal-information.jpg"] = dict(
    words=["Address", "Form", "Signature", "Passport", "Identification",
           "Birth certificate"],
    objects_desc={
        "Address": "a model house with a blank oval plaque beside its door",
        "Form": "a large paper form with empty checkboxes and wavy squiggle lines",
        "Signature": "a pen resting on a flowing squiggle signature line",
        "Passport": "a small dark passport booklet with a plain gold emblem",
        "Identification": "an identification card showing a simple portrait and squiggle lines",
        "Birth certificate": "an ornate bordered certificate with a ribbon seal and squiggle lines",
    })

C["land1_pets-at-home.jpg"] = dict(
    words=["Dog", "Cat", "Fish", "Bird", "Hamster", "Turtle", "Rabbit",
           "Collar", "Leash", "Bowl", "Cage", "Veterinarian"],
    people_rule=("The scene includes {heroes}, each appearing exactly once "
                 "caring for the pets, plus ONE kind adult veterinarian in a "
                 "white coat - no other people."),
    objects_desc={
        "Dog": "a friendly dog sitting and wagging its tail",
        "Cat": "a striped cat lounging on a cushion",
        "Fish": "a goldfish in a round bowl",
        "Bird": "a small blue bird perched on top of its cage",
        "Hamster": "a hamster running in an exercise wheel",
        "Turtle": "a small turtle on a flat rock",
        "Rabbit": "a floppy-eared rabbit nibbling a carrot",
        "Collar": "a red pet collar with a plain round tag on a low table",
        "Leash": "a leash hanging on a wall hook",
        "Bowl": "a full pet food bowl",
        "Cage": "a tall birdcage",
        "Veterinarian": "a kind adult veterinarian in a white coat gently examining the dog",
    })

C["land1_school-events-activities.jpg"] = dict(
    words=["Science fair", "Talent show", "Picture day", "Book fair",
           "Fire drill", "Graduation", "Award", "Certificate", "Stage",
           "Yearbook", "Coach", "Team"],
    people_rule=("The scene includes {heroes}, each appearing exactly once "
                 "enjoying the fair, plus several OTHER schoolchildren at the "
                 "event stations and ONE adult coach, exactly as listed in "
                 "the object list."),
    objects_desc={
        "Science fair": "a science-fair table with an erupting model volcano",
        "Talent show": "a child juggling colorful balls on the stage",
        "Picture day": "a camera on a tripod facing a decorated photo backdrop",
        "Book fair": "a book stall with rows of colorful picture-only book covers",
        "Fire drill": "a red alarm bell on the wall with children lining up neatly below it",
        "Graduation": "a child proudly wearing a graduation cap and gown",
        "Award": "a shining gold medal on a ribbon displayed on a stand",
        "Certificate": "a framed certificate decorated with fancy squiggle lines",
        "Stage": "a small wooden stage decorated with bunting",
        "Yearbook": "an open book showing a grid of small painted portraits",
        "Coach": "an adult coach with a cap and a whistle",
        "Team": "a group of children in matching plain blue jerseys",
    })

C["land1_the-home.jpg"] = dict(
    words=["Door", "Window", "Roof", "Stairs", "Sofa", "Table", "Bed",
           "Pillow", "Blanket", "Lamp", "Mirror", "Curtains", "Rug", "Sink",
           "Bathtub", "Refrigerator", "Key", "Mailbox", "Porch"],
    objects_desc={
        "Door": "a welcoming front door",
        "Window": "a bright window with flower boxes",
        "Roof": "a warm tiled roof",
        "Stairs": "a wooden staircase",
        "Sofa": "a comfy sofa",
        "Table": "a round dining table",
        "Bed": "a neatly made bed",
        "Pillow": "a plump pillow at the head of the bed",
        "Blanket": "a folded blanket at the foot of the bed",
        "Lamp": "a glowing table lamp",
        "Mirror": "an oval wall mirror",
        "Curtains": "soft curtains framing a window",
        "Rug": "a round patterned rug",
        "Sink": "a kitchen sink",
        "Bathtub": "a bathtub with claw feet",
        "Refrigerator": "a tall refrigerator",
        "Key": "an oversized golden key hanging on a hook by the door",
        "Mailbox": "a front-yard mailbox on a post",
        "Porch": "a front porch with a small bench",
    })

C["land1_the-neighborhood.jpg"] = dict(
    words=["Park", "Playground", "Library", "Grocery store", "Pharmacy",
           "Gas station", "Barbershop", "Laundromat", "Clinic",
           "Community garden", "Church", "Mosque", "Temple"],
    objects_desc={
        "Park": "a small green park with trees and a winding path",
        "Playground": "a corner playground with a little slide",
        "Library": "a building with tall windows full of bookshelves",
        "Grocery store": "a shopfront with fruit and vegetable stands outside",
        "Pharmacy": "a shop with a green cross symbol above the door",
        "Gas station": "a small fuel station with two pumps",
        "Barbershop": "a shop with a red-and-white striped barber pole",
        "Laundromat": "a shop window showing a row of round washing machines",
        "Clinic": "a white building with a red cross symbol",
        "Community garden": "raised garden beds with vegetables and flowers",
        "Church": "a small chapel with a steeple",
        "Mosque": "a small mosque with a dome and crescent",
        "Temple": "a small temple with tiered eaves",
    })

C["land1_the-playground-recess.jpg"] = dict(
    words=["Swing", "Slide", "Seesaw", "Monkey bars", "Sandbox", "Jump rope",
           "Hopscotch", "Bench", "Shade", "Water fountain", "Kick", "Catch",
           "Race"],
    people_rule=("The scene includes {heroes}, each appearing exactly once "
                 "playing happily, plus several OTHER children at recess "
                 "exactly as listed in the object list. No adults."),
    objects_desc={
        "Swing": "a swing set",
        "Slide": "a tall curvy slide",
        "Seesaw": "a seesaw",
        "Monkey bars": "a set of monkey bars",
        "Sandbox": "a sandbox with little buckets",
        "Jump rope": "a child skipping over a jump rope",
        "Hopscotch": "a chalk hopscotch grid of blank squares",
        "Bench": "a park bench",
        "Shade": "a big leafy shade tree",
        "Water fountain": "a small drinking fountain",
        "Kick": "a child kicking a soccer ball",
        "Catch": "a child catching a beach ball",
        "Race": "two children racing side by side",
    })


def main():
    posters = json.load(io.open(POSTERS, encoding="utf-8"))
    by_name = {p["basename"]: p for p in posters}
    for name, cur in C.items():
        p = by_name[name]
        assert p["status"] == "pending", f"{name} is {p['status']}, not pending"
        pool = set(p["vocab_pool"])
        missing = [w for w in cur["words"] if w not in pool]
        assert not missing, f"{name}: words not in pool: {missing}"
        p["words"] = cur["words"]
        p["objects_desc"] = cur["objects_desc"]
        if "people_rule" in cur:
            p["people_rule"] = cur["people_rule"]
        if "scene_extra" in cur:
            p["scene_extra"] = cur["scene_extra"]
        print(f"{name}: {len(cur['words'])} words")
    io.open(POSTERS, "w", encoding="utf-8").write(
        json.dumps(posters, indent=2, ensure_ascii=False))
    print(f"\ncurated {len(C)} posters")


if __name__ == "__main__":
    main()
