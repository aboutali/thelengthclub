#!/usr/bin/env python3
"""Checks the rendered PDFs: page count, exact page size, smallest text size,
smallest text-to-edge distance, and that every QR code decodes.

Setup (once):  pip install pymupdf zxing-cpp pillow
Usage:         python3 corporate/print/verify.py
"""
import glob, io, os
import pymupdf, zxingcpp
from PIL import Image

MM = 72 / 25.4
HERE = os.path.dirname(os.path.abspath(__file__))
EXPECT = {'onepager': (210, 297, 1), 'poster': (297, 420, 1), 'card': (105, 148, 2)}
URLS = {'poster': {'https://length.club/book/'}, 'card': {'https://length.club'}}

for f in sorted(glob.glob(os.path.join(HERE, 'pdf', '*.pdf'))):
    name = os.path.basename(f)
    kind = name.split('-')[0]
    w, h, pages = EXPECT[kind]
    doc = pymupdf.open(f)
    ok = len(doc) == pages
    qr = set()
    edge, minpt = 1e9, 1e9
    for p in doc:
        ok &= abs(p.rect.width / MM - w) < 0.05 and abs(p.rect.height / MM - h) < 0.05
        for x0, y0, x1, y1, *_ in p.get_text('words'):
            edge = min(edge, x0 / MM, y0 / MM, (p.rect.width - x1) / MM, (p.rect.height - y1) / MM)
        for b in p.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                for s in l['spans']:
                    if s['text'].strip():
                        minpt = min(minpt, s['size'])
        img = Image.open(io.BytesIO(p.get_pixmap(dpi=300).tobytes('png')))
        qr |= {r.text for r in zxingcpp.read_barcodes(img)}
    want = URLS.get(kind, set())
    ok &= qr == want
    print(f"{'OK  ' if ok else 'FAIL'} {name}: {len(doc)} page(s), {w}x{h} mm, "
          f"min text {minpt:.1f} pt, text-to-edge {edge:.1f} mm, QR {sorted(qr) or '-'}")
