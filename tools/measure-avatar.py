"""Measures the AI avatar tile against the first text line of its reply row.

Usage: python tools/measure-avatar.py <screenshot.png>
Prints the tile box, the estimated device pixel ratio (tile is 30 CSS px), and the
first text line's ink box, so the CSS offset can be corrected by real numbers.
"""

import sys

from PIL import Image


def is_green(px):
    r, g, b = px[0], px[1], px[2]
    return g > 110 and g - r > 40 and g - b > 30


def is_ink(px):
    r, g, b = px[0], px[1], px[2]
    return r > 150 and g > 150 and b > 150


def main():
    path = sys.argv[1]
    img = Image.open(path).convert("RGB")
    width, height = img.size
    px = img.load()

    # tile: widest green blob
    xs, ys = [], []
    for y in range(height):
        for x in range(width):
            if is_green(px[x, y]):
                xs.append(x)
                ys.append(y)
    if not xs:
        print("no green tile found")
        return
    left, right = min(xs), max(xs)
    top, bottom = min(ys), max(ys)
    tile_h = bottom - top + 1
    dpr = tile_h / 30.0
    print(f"image {width}x{height}")
    print(f"tile x {left}..{right} y {top}..{bottom} (h={tile_h}px) dpr≈{dpr:.2f}")
    print(f"tile css: h={tile_h / dpr:.1f}, top={top / dpr:.1f}")

    # first text line: bright ink to the right of the tile, scanning down
    text_x0 = right + 20
    lines = []
    current = None
    for y in range(0, height):
        count = 0
        for x in range(text_x0, width):
            if is_ink(px[x, y]):
                count += 1
        if count >= 6:
            if current is None:
                current = [y, y]
            else:
                current[1] = y
        elif current is not None:
            lines.append(tuple(current))
            current = None
            if len(lines) >= 3:
                break
    if current is not None:
        lines.append(tuple(current))
    print("text lines (device px):")
    for index, (a, b) in enumerate(lines):
        print(f"  line{index}: y {a}..{b} center {(a + b) / 2:.1f} -> css {(a + b) / 2 / dpr:.2f}")
    if lines:
        first = lines[0]
        center = (first[0] + first[1]) / 2
        tile_center = (top + bottom) / 2
        print(
            f"tile center {tile_center:.1f} vs first line center {center:.1f} "
            f"-> delta {tile_center - center:+.1f} device px "
            f"({(tile_center - center) / dpr:+.2f} css px)"
        )


if __name__ == "__main__":
    main()
