from PIL import Image
import sys

if len(sys.argv) != 2:
    raise SystemExit("usage: python tools/sample-colors.py <screenshot>")
p = sys.argv[1]
im = Image.open(p).convert("RGB")
w, h = im.size
print("size", w, h)
def sample(x, y):
    r, g, b = im.getpixel((x, y))
    return f"({x},{y}) #{r:02X}{g:02X}{b:02X} rgb({r},{g},{b})"
# scan a vertical line at x=700 (inside text column, avoid glyphs) printing colour runs
x = 990
prev = None
start = 0
for y in range(h):
    c = im.getpixel((x, y))
    if c != prev:
        if prev is not None and y - start > 3:
            print(f"y{start}-{y-1} ({y-start}px) #{prev[0]:02X}{prev[1]:02X}{prev[2]:02X}")
        prev = c
        start = y
print(f"y{start}-{h-1} ({h-start}px) #{prev[0]:02X}{prev[1]:02X}{prev[2]:02X}")
