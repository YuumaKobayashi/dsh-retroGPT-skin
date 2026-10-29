"""Measures where the dark page colour turns into the AI band colour, column by column."""

import sys

from PIL import Image

path = sys.argv[1]
img = Image.open(path).convert("RGB")
w, h = img.size
px = img.load()
print("size", w, h)


def lum(p):
    return (p[0] * 299 + p[1] * 587 + p[2] * 114) // 1000


# sample a few columns and print the run-length profile of luminance
cols = [int(w * f) for f in (0.02, 0.05, 0.08, 0.12, 0.2, 0.35, 0.5, 0.7, 0.9, 0.98)]
for x in cols:
    runs = []
    prev = None
    start = 0
    for y in range(h):
        v = lum(px[x, y])
        if prev is None:
            prev = v
            continue
        if abs(v - prev) > 6:
            runs.append((start, y - 1, prev))
            start = y
        prev = v
    runs.append((start, h - 1, prev))
    compact = ", ".join(f"y{a}-{b}:{c}" for a, b, c in runs[:6])
    print(f"x={x:5d}  {compact}")
