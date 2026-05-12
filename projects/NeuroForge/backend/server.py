from __future__ import annotations

import json
import random
import subprocess
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

HOST = "127.0.0.1"
PORT = 8008

MODE_BLUEPRINTS = {
    "invent": {
        "directive": "Invent a bold product concept with unique differentiators.",
        "angle": "new market creation",
        "action": "turn novelty into a believable product spine",
    },
    "improve": {
        "directive": "Improve the idea with practical upgrades and sharper UX.",
        "angle": "conversion and retention lift",
        "action": "tighten the weak parts until the workflow feels premium",
    },
    "pitch": {
        "directive": "Write an investor-style positioning with traction hooks.",
        "angle": "clear story and market urgency",
        "action": "compress the idea into something fundable and legible",
    },
    "code": {
        "directive": "Outline an implementation plan with frontend/backend architecture.",
        "angle": "systems clarity",
        "action": "turn the idea into a roadmap with components and sequencing",
    },
}

TONE_WORDS = {
    "bold": ["future-forward", "high-conviction", "punchy"],
    "professional": ["clear", "credible", "structured"],
    "playful": ["surprising", "lightweight", "memorable"],
    "technical": ["precise", "systems-focused", "implementation-aware"],
}

AUDIENCE_FRAMES = {
    "consumer": "designed for everyday end users who need instant value",
    "startup": "designed for a lean team shipping under time pressure",
    "enterprise": "designed for larger organizations that care about controls and rollout safety",
    "creator": "designed for creators who want leverage, speed, and visible momentum",
}

DEPTH_FRAMES = {
    "fast": "tight and rapid, optimized for quick ideation",
    "detailed": "deeper and more operational, optimized for solid next steps",
    "strategic": "wide-angle and high-context, optimized for decisions and sequencing",
}

STOP_WORDS = {
    "a",
    "an",
    "and",
    "as",
    "at",
    "for",
    "from",
    "in",
    "into",
    "of",
    "on",
    "or",
    "the",
    "to",
    "with",
}


def try_cpp_score(prompt: str) -> int | None:
    exe_path = Path(__file__).resolve().parent.parent / "cpp" / "braincore.exe"
    if not exe_path.exists():
        return None
    try:
        run = subprocess.run(
            [str(exe_path), prompt],
            capture_output=True,
            text=True,
            timeout=2,
            check=False,
        )
        value = int(run.stdout.strip())
        return max(1, min(100, value))
    except Exception:
        return None


def heuristic_score(prompt: str) -> int:
    unique_chars = len(set(prompt.lower()))
    words = len([word for word in prompt.split() if word])
    length_bonus = min(32, len(prompt) // 4)
    novelty_bonus = min(24, unique_chars)
    structure_bonus = min(18, words)
    base = 24
    jitter = random.randint(-3, 7)
    return max(1, min(100, base + length_bonus + novelty_bonus + structure_bonus + jitter))


def extract_keywords(prompt: str) -> list[str]:
    cleaned = "".join(character if character.isalnum() or character.isspace() else " " for character in prompt.lower())
    words = [word for word in cleaned.split() if len(word) > 2 and word not in STOP_WORDS]
    unique_words: list[str] = []
    for word in words:
        if word not in unique_words:
            unique_words.append(word)
    return unique_words[:5] or ["concept", "workflow", "strategy"]


def titleize_keywords(keywords: list[str]) -> str:
    return " ".join(word.capitalize() for word in keywords[:2])


def compute_metrics(prompt: str, mode: str, depth: str) -> tuple[int, int, int]:
    creativity = try_cpp_score(prompt)
    if creativity is None:
        creativity = heuristic_score(prompt)

    word_count = len(prompt.split())
    feasibility = 58 + min(18, word_count) + (8 if mode == "code" else 0) + (6 if depth != "fast" else 0)
    launch_energy = 54 + creativity // 3 + (8 if mode == "pitch" else 0) + (5 if depth == "strategic" else 0)

    return creativity, max(40, min(96, feasibility)), max(45, min(98, launch_energy))


def build_title(keywords: list[str], mode: str) -> str:
    suffix = {
        "invent": "Concept Engine",
        "improve": "Improvement Stack",
        "pitch": "Launch Pitch",
        "code": "Build Blueprint",
    }.get(mode, "Strategy Map")
    return f"{titleize_keywords(keywords)} {suffix}"


def build_payload(prompt: str, mode: str, tone: str, audience: str, depth: str) -> dict[str, Any]:
    keywords = extract_keywords(prompt)
    blueprint = MODE_BLUEPRINTS.get(mode, MODE_BLUEPRINTS["invent"])
    tone_words = TONE_WORDS.get(tone, TONE_WORDS["bold"])
    audience_frame = AUDIENCE_FRAMES.get(audience, AUDIENCE_FRAMES["consumer"])
    depth_frame = DEPTH_FRAMES.get(depth, DEPTH_FRAMES["detailed"])
    creativity, feasibility, launch_energy = compute_metrics(prompt, mode, depth)

    title = build_title(keywords, mode)
    lead_keyword = keywords[0].capitalize()
    secondary_keyword = keywords[1].capitalize() if len(keywords) > 1 else "Momentum"

    concept_frame = [
        {
            "label": "Core Concept",
            "text": f"Use '{prompt}' as the basis for a {lead_keyword}-driven experience focused on {blueprint['angle']}."
        },
        {
            "label": "Audience Fit",
            "text": f"Shape the product for {audience_frame}."
        },
        {
            "label": "Signature Hook",
            "text": f"The standout moment is a live {secondary_keyword.lower()} dashboard that turns raw usage into visible next actions."
        },
        {
            "label": "Voice",
            "text": f"Keep the delivery {', '.join(tone_words)} while staying {depth_frame}."
        },
    ]

    execution_layers = [
        {
            "label": "Frontend",
            "text": "Ship a dense single-page workstation with guided prompting, structured result cards, history recall, and exportable narrative blocks."
        },
        {
            "label": "Backend",
            "text": "Use a modular Python API that transforms the prompt into concept framing, action sequencing, and risk analysis instead of one flat paragraph."
        },
        {
            "label": "Systems",
            "text": "Keep the optional C++ scorer as a fast auxiliary metric generator for novelty and prompt texture."
        },
        {
            "label": "Analytics",
            "text": "Expose creativity, feasibility, and launch-energy metrics to make each response feel reviewable rather than magical."
        },
    ]

    action_plan = [
        {
            "label": "Sprint 1",
            "text": f"Prototype the prompt composer and {title.lower()} output schema so the experience is legible from the first run."
        },
        {
            "label": "Sprint 2",
            "text": f"Implement {blueprint['action']} with stronger state management, history, and replayable prompts."
        },
        {
            "label": "Sprint 3",
            "text": "Add sharing, exports, and benchmark prompts so the tool demonstrates visible value to collaborators."
        },
        {
            "label": "Sprint 4",
            "text": "Instrument real usage patterns and refine the scoring model against the most useful outputs."
        },
    ]

    risks = [
        {
            "label": "Risk",
            "text": "The concept could feel broad if the prompt remains vague. Counter that by forcing sharper output sections and stronger action language."
        },
        {
            "label": "Execution Gap",
            "text": "A single score is not enough. Pair it with feasibility and launch energy so users can judge the response from multiple angles."
        },
        {
            "label": "Trust",
            "text": "Expose how the app thinks in visible cards and narrative explanations so the result feels inspectable instead of opaque."
        },
    ]

    next_prompts = [
        f"Rewrite this idea for a premium {audience} launch plan.",
        f"Turn the same concept into a narrower MVP with a 2-week build scope.",
        f"Expand the analytics layer for the {lead_keyword.lower()} workflow.",
    ]

    narrative = (
        f"Mode directive: {blueprint['directive']}\n"
        f"Tone: {', '.join(tone_words)}\n"
        f"Audience: {audience_frame}\n"
        f"Depth: {depth_frame}\n\n"
        f"Working title: {title}\n\n"
        f"Narrative:\n"
        f"Build this around the prompt '{prompt}'. The product should feel like a focused system rather than a loose collection of AI tricks. "
        f"Its strongest move is translating input into a visible operating model: what the idea is, why it matters, how it ships, where it can fail, and which prompt should come next. "
        f"That makes the experience useful for both ideation and execution.\n\n"
        f"The UI should foreground structure: a composer on the left, a dense result workspace in the middle, and session memory on the right. "
        f"The backend should return data that can be inspected section by section, which gives the user leverage to iterate intentionally.\n\n"
        f"If this were pushed further, the next major step would be collaborative sessions, export formats, and calibrated scoring based on saved outcomes."
    )

    return {
        "title": title,
        "positioning": f"{title} turns {prompt.lower()} into a structured product strategy with visible execution layers and reviewable metrics.",
        "creativity_score": creativity,
        "feasibility_score": feasibility,
        "launch_energy": launch_energy,
        "keywords": [lead_keyword, secondary_keyword, mode.capitalize(), tone.capitalize(), audience.capitalize()],
        "concept_frame": concept_frame,
        "execution_layers": execution_layers,
        "action_plan": action_plan,
        "risks": risks,
        "next_prompts": next_prompts,
        "narrative": narrative,
    }


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:  # noqa: A003
        return

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        super().end_headers()

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path != "/api/health":
            self.send_response(404)
            self.end_headers()
            return

        cpp_path = Path(__file__).resolve().parent.parent / "cpp" / "braincore.exe"
        output = json.dumps(
            {
                "status": "ok",
                "cpp_status": "ready" if cpp_path.exists() else "optional / not compiled",
                "modes": list(MODE_BLUEPRINTS.keys()),
            }
        ).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(output)

    def do_POST(self) -> None:  # noqa: N802
        if self.path != "/api/generate":
            self.send_response(404)
            self.end_headers()
            return

        content_len = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(content_len)

        try:
            payload: dict[str, Any] = json.loads(body.decode("utf-8"))
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"error":"Invalid JSON"}')
            return

        prompt = str(payload.get("prompt", "")).strip()
        mode = str(payload.get("mode", "invent"))
        tone = str(payload.get("tone", "bold"))
        audience = str(payload.get("audience", "consumer"))
        depth = str(payload.get("depth", "detailed"))

        if not prompt:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"error":"Prompt is required"}')
            return

        output = json.dumps(build_payload(prompt, mode, tone, audience, depth)).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(output)


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"NeuroForge backend running on http://{HOST}:{PORT}")
    server.serve_forever()
