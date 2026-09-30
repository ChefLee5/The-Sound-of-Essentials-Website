import json
import os

account_id = "6379067759"
container_id = "265288233"
public_id = "GTM-N2NKDFW6"

built_in_variables = [
    {"type": "PAGE_URL", "name": "Page URL"},
    {"type": "PAGE_PATH", "name": "Page Path"},
    {"type": "PAGE_HOSTNAME", "name": "Page Hostname"},
    {"type": "REFERRER", "name": "Referrer"},
    {"type": "EVENT", "name": "Event"},
    {"type": "CLICK_ELEMENT", "name": "Click Element"},
    {"type": "CLICK_CLASSES", "name": "Click Classes"},
    {"type": "CLICK_ID", "name": "Click ID"},
    {"type": "CLICK_TARGET", "name": "Click Target"},
    {"type": "CLICK_URL", "name": "Click URL"},
    {"type": "CLICK_TEXT", "name": "Click Text"},
    {"type": "HISTORY_SOURCE", "name": "History Source"},
    {"type": "NEW_HISTORY_FRAGMENT", "name": "New History Fragment"},
    {"type": "NEW_HISTORY_STATE", "name": "New History State"},
    {"type": "OLD_HISTORY_FRAGMENT", "name": "Old History Fragment"},
    {"type": "OLD_HISTORY_STATE", "name": "Old History State"}
]

for b in built_in_variables:
    b["accountId"] = account_id
    b["containerId"] = container_id

dlv_names = [
    "page_path", "page_title", "page_location",
    "form_name", "form_source", "lead_type",
    "cta_text", "cta_location", "cta_url",
    "track_id", "track_title",
    "item_name", "item_id", "value", "currency", "ecommerce",
    "utm_source", "utm_medium", "utm_campaign"
]

variables = []
var_id = 1
for name in dlv_names:
    variables.append({
        "accountId": account_id,
        "containerId": container_id,
        "variableId": str(var_id),
        "name": f"DLV - {name}",
        "type": "v",
        "parameter": [
            {"type": "INTEGER", "key": "dataLayerVersion", "value": "2"},
            {"type": "BOOLEAN", "key": "setDefaultValue", "value": "false"},
            {"type": "TEMPLATE", "key": "name", "value": name}
        ]
    })
    var_id += 1

# Constant for GA4 Measurement ID
variables.append({
    "accountId": account_id,
    "containerId": container_id,
    "variableId": str(var_id),
    "name": "Constant - GA4 Measurement ID",
    "type": "c",
    "parameter": [
        {"type": "TEMPLATE", "key": "value", "value": "G-H5977S1HY4"}
    ]
})

custom_events = [
    ("101", "Custom Event - virtual_pageview", "virtual_pageview"),
    ("102", "Custom Event - generate_lead", "generate_lead"),
    ("103", "Custom Event - begin_checkout", "begin_checkout"),
    ("104", "Custom Event - view_item", "view_item"),
    ("105", "Custom Event - audio_play", "audio_play"),
    ("106", "Custom Event - share", "share"),
    ("107", "Custom Event - cta_click", "cta_click")
]

triggers = []
for tid, tname, ename in custom_events:
    triggers.append({
        "accountId": account_id,
        "containerId": container_id,
        "triggerId": tid,
        "name": tname,
        "type": "CUSTOM_EVENT",
        "customEventFilter": [
            {
                "type": "EQUALS",
                "parameter": [
                    {"type": "TEMPLATE", "key": "arg0", "value": "{{_event}}"},
                    {"type": "TEMPLATE", "key": "arg1", "value": ename}
                ]
            }
        ]
    })

triggers.append({
    "accountId": account_id,
    "containerId": container_id,
    "triggerId": "108",
    "name": "Click - All Elements",
    "type": "CLICK",
    "autoEventFilter": []
})

triggers.append({
    "accountId": account_id,
    "containerId": container_id,
    "triggerId": "109",
    "name": "History Change - SPA Navigation",
    "type": "HISTORY_CHANGE"
})

tags = [
    {
        "accountId": account_id,
        "containerId": container_id,
        "tagId": "201",
        "name": "Google Tag - GA4 Base Configuration",
        "type": "googtag",
        "parameter": [
            {"type": "TEMPLATE", "key": "tagId", "value": "{{Constant - GA4 Measurement ID}}"}
        ],
        "firingTriggerId": ["2147479553"]
    },
    {
        "accountId": account_id,
        "containerId": container_id,
        "tagId": "202",
        "name": "GA4 Event - Virtual Pageview",
        "type": "gaawe",
        "parameter": [
            {"type": "TEMPLATE", "key": "eventName", "value": "page_view"},
            {"type": "TEMPLATE", "key": "measurementId", "value": "{{Constant - GA4 Measurement ID}}"}
        ],
        "firingTriggerId": ["101"]
    },
    {
        "accountId": account_id,
        "containerId": container_id,
        "tagId": "203",
        "name": "GA4 Event - Generate Lead",
        "type": "gaawe",
        "parameter": [
            {"type": "TEMPLATE", "key": "eventName", "value": "generate_lead"},
            {"type": "TEMPLATE", "key": "measurementId", "value": "{{Constant - GA4 Measurement ID}}"}
        ],
        "firingTriggerId": ["102"]
    },
    {
        "accountId": account_id,
        "containerId": container_id,
        "tagId": "204",
        "name": "GA4 Event - Begin Checkout",
        "type": "gaawe",
        "parameter": [
            {"type": "TEMPLATE", "key": "eventName", "value": "begin_checkout"},
            {"type": "TEMPLATE", "key": "measurementId", "value": "{{Constant - GA4 Measurement ID}}"}
        ],
        "firingTriggerId": ["103"]
    },
    {
        "accountId": account_id,
        "containerId": container_id,
        "tagId": "205",
        "name": "GA4 Event - View Item",
        "type": "gaawe",
        "parameter": [
            {"type": "TEMPLATE", "key": "eventName", "value": "view_item"},
            {"type": "TEMPLATE", "key": "measurementId", "value": "{{Constant - GA4 Measurement ID}}"}
        ],
        "firingTriggerId": ["104"]
    },
    {
        "accountId": account_id,
        "containerId": container_id,
        "tagId": "206",
        "name": "GA4 Event - Audio Play",
        "type": "gaawe",
        "parameter": [
            {"type": "TEMPLATE", "key": "eventName", "value": "audio_play"},
            {"type": "TEMPLATE", "key": "measurementId", "value": "{{Constant - GA4 Measurement ID}}"}
        ],
        "firingTriggerId": ["105"]
    },
    {
        "accountId": account_id,
        "containerId": container_id,
        "tagId": "207",
        "name": "GA4 Event - Social Share",
        "type": "gaawe",
        "parameter": [
            {"type": "TEMPLATE", "key": "eventName", "value": "share"},
            {"type": "TEMPLATE", "key": "measurementId", "value": "{{Constant - GA4 Measurement ID}}"}
        ],
        "firingTriggerId": ["106"]
    },
    {
        "accountId": account_id,
        "containerId": container_id,
        "tagId": "208",
        "name": "GA4 Event - CTA Button Click",
        "type": "gaawe",
        "parameter": [
            {"type": "TEMPLATE", "key": "eventName", "value": "cta_click"},
            {"type": "TEMPLATE", "key": "measurementId", "value": "{{Constant - GA4 Measurement ID}}"}
        ],
        "firingTriggerId": ["107"]
    }
]

container_data = {
    "exportFormatVersion": 2,
    "exportTime": "2026-09-27 16:30:00",
    "containerVersion": {
        "path": f"accounts/{account_id}/containers/{container_id}/versions/0",
        "accountId": account_id,
        "containerId": container_id,
        "containerVersionId": "0",
        "container": {
            "path": f"accounts/{account_id}/containers/{container_id}",
            "accountId": account_id,
            "containerId": container_id,
            "name": "The Sound of Essentials",
            "publicId": public_id,
            "usageContext": ["WEB"]
        },
        "tag": tags,
        "trigger": triggers,
        "variable": variables,
        "builtInVariable": built_in_variables
    }
}

paths = [
    r"c:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website\web\public\soe_gtm_container.json",
    r"c:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website\soe_gtm_container.json",
    r"c:\Users\ldmur\Downloads\soe_gtm_container.json"
]

for p in paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(container_data, f, indent=2)
    print(f"Generated: {p}")
