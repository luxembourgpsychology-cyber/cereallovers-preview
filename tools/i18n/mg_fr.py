"""Builds the French Migra words for the site (mg/cafe.svg, visite.svg, colombie.svg, ethiopie.svg)
from the glyph outlines already cut from the toolbox. Each <path> in those files is one letter.
Run: python3 website-2026/i18n/mg_fr.py"""
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
MG = os.path.join(HERE, '..', '..', 'cereallovers-preview', 'mg')

def glyphs(name):
    s = open(os.path.join(MG, name + '.svg')).read()
    return re.findall(r'<path d="([^"]+)"/>', s)

def bbox(d):
    toks = re.findall(r'[A-Za-z]|-?\d+(?:\.\d+)?', d)
    assert not any(t.isalpha() and t.islower() for t in toks), 'relative path command'
    xs, ys, cmd, nums, x, y = [], [], None, [], 0, 0
    def flush():
        nonlocal x, y
        if cmd in 'MLQCT':
            for i in range(0, len(nums), 2): x, y = nums[i], nums[i+1]; xs.append(x); ys.append(y)
        elif cmd == 'H':
            for v in nums: x = v; xs.append(x); ys.append(y)
        elif cmd == 'V':
            for v in nums: y = v; xs.append(x); ys.append(y)
    for t in toks:
        if t.isalpha():
            if cmd: flush()
            cmd, nums = t, []
        else: nums.append(float(t))
    if cmd: flush()
    return min(xs), min(ys), max(xs), max(ys)

def gap(word, i):          # space between letter i and i+1 in a source word
    g = glyphs(word); return bbox(g[i+1])[0] - bbox(g[i])[2]

def acute(cx, base, top):  # a tapered wedge, leaning right like the italic
    h = top - base
    return ('M%.1f %.1f L%.1f %.1f L%.1f %.1f Q%.1f %.1f %.1f %.1f Z' %
            (cx - 34, base, cx + 4, base, cx + 120, base + h, cx + 100, base + h - 30, cx + 62, base + h - 14))

def build(out, parts):
    """parts: list of (path_d, gap_before) ; extra: list of raw paths already positioned"""
    paths, x_right, boxes = [], None, []
    for d, g, extra in parts:
        b = bbox(d)
        dx = 0 if x_right is None else (x_right + g) - b[0]
        paths.append((d, dx)); boxes.append((b[0]+dx, b[1], b[2]+dx, b[3]))
        x_right = b[2] + dx
        for e in extra(b, dx) if extra else []:
            paths.append((e, 0)); eb = bbox(e); boxes.append(eb)
    x0 = min(b[0] for b in boxes); y0 = min(b[1] for b in boxes)
    x1 = max(b[2] for b in boxes); y1 = max(b[3] for b in boxes)
    W, H = x1 - x0, y1 - y0
    body = ''.join('<path d="%s"/>' % d if not dx else '<path transform="translate(%.1f 0)" d="%s"/>' % (dx, d) for d, dx in paths)
    open(os.path.join(MG, out), 'w').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%.1f %.1f %.1f %.1f" width="%.1f" height="%.1f"><g fill="currentColor">%s</g></svg>' % (x0, y0, W, H, W, H, body))
    print(out, '--r:%.3f' % (W / H))

V, C, CO, ET, GR = glyphs('visit'), glyphs('coffee'), glyphs('colombia'), glyphs('ethiopia'), glyphs('granola')
E = C[4]
avg = lambda w: sum(gap(w, i) for i in range(len(glyphs(w)) - 1)) / (len(glyphs(w)) - 1)

def small_acute(b, dx):     # on a lowercase e
    cx = (b[0] + b[2]) / 2 + dx + 30
    return [acute(cx, b[1] - 40, b[1] - 230)]
def cap_acute(b, dx):       # on the capital E
    cx = b[0] + (b[2] - b[0]) * .62 + dx
    return [acute(cx, b[1] - 26, b[1] - 170)]

build('visite.svg', [(d, gap('visit', i-1) if i else 0, None) for i, d in enumerate(V)] + [(E, avg('visit'), None)])
build('cafe.svg', [(C[0], 0, None), (GR[2], gap('coffee', 0), None), (C[2], gap('coffee', 1), None), (E, gap('coffee', 3), small_acute)])
build('colombie.svg', [(d, gap('colombia', i-1) if i else 0, None) for i, d in enumerate(CO[:7])] + [(E, gap('colombia', 6), None)])
build('ethiopie.svg', [(ET[0], 0, cap_acute)] + [(d, gap('ethiopia', i), None) for i, d in enumerate(ET[1:7])] + [(E, gap('ethiopia', 6), None)])
