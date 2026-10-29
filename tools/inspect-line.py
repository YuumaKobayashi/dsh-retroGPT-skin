"""Samples horizontal runs of colour in a screenshot to locate a divider line.

usage: python tools/inspect-line.py <image> [x]
Prints, for each row, the colour when it differs from the row above.
"""

import sys

from PIL import Image

path = sys.argv[1]
x = int(sys.argv[2]) if len(sys.argv) > 2 else None
img = Image.open(path).convert("RGB")
w, h = img.size
print("size", w, h)
if x is None:
    x = w // 2

prev = None
for y in range(h):
    c = img.getpixel((x, y))
    if c != prev:
        print(f"y{y} x{x} #{c[0]:02X}{c[1]:02X}{c[2]:02X}")
        prev = c
