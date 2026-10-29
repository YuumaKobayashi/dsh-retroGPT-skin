// turns the two reference logos the user supplied into small transparent PNGs
// (not part of the shipped plugin; the result is inlined into client.js as a data URI)
import { writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const PY = process.env.DSH_PYTHON || "python";
const [SRC_WHALE, SRC_GPT] = process.argv.slice(2);
if (!SRC_WHALE || !SRC_GPT) {
	console.error("usage: node tools/avatar-art.mjs <whale-image> <gpt-image>");
	process.exit(2);
}

const script = String.raw`
import sys, base64, io
from PIL import Image

def load(path):
    return Image.open(path).convert("RGBA")

def trim(img, tolerance=24):
    # background = the dominant border colour
    px = img.load()
    w, h = img.size
    samples = [px[0,0], px[w-1,0], px[0,h-1], px[w-1,h-1], px[w//2,0], px[0,h//2]]
    bg = max(set(samples), key=samples.count)
    out = Image.new("RGBA", img.size, (0,0,0,0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r,g,b,a = px[x,y]
            if a == 0:
                continue
            if abs(r-bg[0]) + abs(g-bg[1]) + abs(b-bg[2]) <= tolerance:
                continue
            op[x,y] = (r,g,b,255)
    return out

def to_white(img):
    px = img.load()
    w,h = img.size
    for y in range(h):
        for x in range(w):
            r,g,b,a = px[x,y]
            if a == 0:
                continue
            # keep the alpha of the glyph, force white ink
            lum = (r*299 + g*587 + b*114) // 1000
            px[x,y] = (255,255,255,a)
    return img

def square(img, size=96, pad=0.06):
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    w,h = img.size
    side = max(w,h)
    canvas = Image.new("RGBA", (side,side), (0,0,0,0))
    canvas.paste(img, ((side-w)//2, (side-h)//2), img)
    inner = int(size * (1 - 2*pad))
    canvas = canvas.resize((inner,inner), Image.LANCZOS)
    final = Image.new("RGBA", (size,size), (0,0,0,0))
    final.paste(canvas, ((size-inner)//2, (size-inner)//2), canvas)
    return final

def emit(name, path):
    img = square(to_white(trim(load(path))))
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    data = buf.getvalue()
    print(name, len(data))
    print(name + "_b64 " + base64.b64encode(data).decode())

emit("whale", sys.argv[1])
emit("gpt", sys.argv[2])
`;

const out = spawnSync(PY, ["-c", script, SRC_WHALE, SRC_GPT], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
if (out.status !== 0) {
	console.error(out.status, out.stderr);
	process.exit(1);
}
const lines = out.stdout.trim().split("\n");
const arts = {};
for (const line of lines) {
	if (line.includes("_b64 ")) {
		const [name, b64] = line.split("_b64 ");
		arts[name] = b64;
	}
}
mkdirSync(".probe", { recursive: true });
for (const [name, b64] of Object.entries(arts)) {
	writeFileSync(`.probe/${name}.png`, Buffer.from(b64, "base64"));
}
writeFileSync(".probe/avatar-art.json", JSON.stringify(arts));
console.log(lines.filter((l) => !l.includes("_b64 ")).join("\n"));
