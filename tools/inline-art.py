"""Splices the rendered assistant marks (tools/avatar-art.py) into client.js.

Run after editing client.js:
    python tools/avatar-art.py <whale-image> <gpt-image>
    python tools/inline-art.py
"""

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CLIENT = os.path.join(ROOT, "client.js")
ART = os.path.join(ROOT, ".probe", "avatar-art.json")

PLACEHOLDERS = {
    "__RGS_AI_ART_GPT__": "gpt",
    "__RGS_AI_ART_WHALE__": "whale",
}


def main():
    with open(ART, encoding="utf8") as handle:
        art = json.load(handle)
    with open(CLIENT, encoding="utf8") as handle:
        source = handle.read()
    replaced = 0
    for token, key in PLACEHOLDERS.items():
        if token in source:
            source = source.replace(token, art[key])
            replaced += 1
    with open(CLIENT, "w", encoding="utf8", newline="\n") as handle:
        handle.write(source)
    print("spliced", replaced, "placeholder(s);", len(source), "chars")


if __name__ == "__main__":
    main()
