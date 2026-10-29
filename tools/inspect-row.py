"""Prints luminance along selected rows so a band edge can be located exactly."""

import sys

from PIL import Image

path = sys.argv[1]
img = Image.open(path).convert("RGB")
w, h = img.size
px = img.load()


def lum(p):
    return (p[0] * 299 + p[1] * 587 + p[2] * 114) // 1000


rows = [int(v) for v in sys.argv[2].split(",")]
for y in rows:
    values = [lum(px[x, y]) for x in range(w)]
    runs = []
    start = 0
    prev = values[0]
    for x in range(1, w):
        if values[x] != prev:
            if x - start >= 3:
                runs.append((start, x - 1, prev))
            start = x
            prev = values[x]
    if w - start >= 3:
        runs.append((start, w - 1, prev))
    print(f"y={y}: " + ", ".join(f"x{a}-{b}:{c}" for a, b, c in runs[:14]))
