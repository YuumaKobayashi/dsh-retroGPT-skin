"""Turns the two reference logos the user supplied into small transparent PNGs.

Not part of the shipped plugin: the output is inlined into client.js as data URIs.
Run:  python tools/avatar-art.py <whale-image> <gpt-image>
"""

import base64
import io
import json
import os
import sys

from PIL import Image

def luminance(r, g, b):
    return (r * 299 + g * 587 + b * 114) // 1000


def glyph_from_light_logo(path, crop=None, low=110, high=210):
    """White glyph on a dark plate: alpha ramps up with luminance."""
    img = Image.open(path).convert("RGBA")
    if crop:
        img = img.crop(crop)
    w, h = img.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    src = img.load()
    dst = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = src[x, y]
            lum = luminance(r, g, b)
            alpha = int(max(0.0, min(1.0, (lum - low) / (high - low))) * 255)
            if alpha:
                dst[x, y] = (255, 255, 255, alpha)
    return out


def glyph_from_dark_logo(path, low=110, high=235):
    """Dark glyph on a light plate: alpha ramps DOWN with luminance."""
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    src = img.load()
    dst = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = src[x, y]
            lum = luminance(r, g, b)
            alpha = int(max(0.0, min(1.0, (high - lum) / (high - low))) * 255)
            if alpha:
                dst[x, y] = (255, 255, 255, alpha)
    return out


def square(img, size=96, pad=0.12):
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    w, h = img.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - w) // 2, (side - h) // 2), img)
    inner = max(8, int(size * (1 - 2 * pad)))
    canvas = canvas.resize((inner, inner), Image.LANCZOS)
    final = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    final.paste(canvas, ((size - inner) // 2, (size - inner) // 2), canvas)
    return final


def render(img, name, size=72):
    img = square(img, size=size)
    # white ink + alpha only: LA keeps the payload small and lossless
    alpha = img.getchannel("A")
    img = Image.merge("LA", (Image.new("L", img.size, 255), alpha))
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    data = buf.getvalue()
    img.convert("RGBA").save(os.path.join(".probe", name + ".png"))
    return base64.b64encode(data).decode("ascii"), len(data)


def main():
    if len(sys.argv) != 3:
        raise SystemExit("usage: python tools/avatar-art.py <whale-image> <gpt-image>")
    src_whale, src_gpt = sys.argv[1:]
    os.makedirs(".probe", exist_ok=True)
    whale = glyph_from_light_logo(src_whale, crop=(100, 40, 215, 155), low=90, high=200)
    gpt = glyph_from_dark_logo(src_gpt, low=110, high=230)
    arts = {}
    arts["whale"], whale_len = render(whale, "whale")
    arts["gpt"], gpt_len = render(gpt, "gpt")
    with open(".probe/avatar-art.json", "w", encoding="utf8") as handle:
        json.dump(arts, handle)
    print("whale", whale_len, "gpt", gpt_len)


if __name__ == "__main__":
    main()
