"""
JSON exporter for SOE Lesson Extensions.
"""

import json
from typing import List
from soe_curriculum.models import LessonExtension


def export_json(lesson: LessonExtension, indent: int = 2) -> str:
    """Serialize a single lesson to formatted JSON string."""
    return json.dumps(lesson.model_dump(), indent=indent, ensure_ascii=False)


def export_batch_json(lessons: List[LessonExtension], indent: int = 2) -> str:
    """Serialize multiple lessons to formatted JSON string."""
    data = [l.model_dump() for l in lessons]
    return json.dumps(data, indent=indent, ensure_ascii=False)
