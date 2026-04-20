"""One-shot script that generates the two UK ETA reference PDFs used as
'tickets' in the London 2026 app. Re-run only if the data changes."""

from pathlib import Path
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas


OUT_DIR = Path(__file__).resolve().parent.parent / "tickets"

VISAS = [
    {
        "filename": "visa-david.pdf",
        "name": "DAVID RYAN HENSLEY",
        "reference": "2020-0000-3057-2740",
        "passport_tail": "2400",
        "valid_until": "16 August 2027",
        "approved": "16 August 2025",
    },
    {
        "filename": "visa-paula.pdf",
        "name": "PAULA ELIZABETH HENSLEY",
        "reference": "2020-0000-3066-7871",
        "passport_tail": "5840",
        "valid_until": "17 August 2027",
        "approved": "17 August 2025",
    },
]

INK = HexColor("#1f2430")
DIM = HexColor("#5c6370")
ACCENT = HexColor("#2d4f8e")
HAIRLINE = HexColor("#d8d4c9")


def draw(visa):
    out_path = OUT_DIR / visa["filename"]
    c = canvas.Canvas(str(out_path), pagesize=LETTER)
    width, height = LETTER

    # Header band
    c.setFillColor(ACCENT)
    c.rect(0, height - 0.9 * inch, width, 0.9 * inch, stroke=0, fill=1)
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(0.75 * inch, height - 0.55 * inch, "UK Electronic Travel Authorisation")
    c.setFont("Helvetica", 10)
    c.drawString(0.75 * inch, height - 0.78 * inch, "GOV.UK - Home Office - UK Visas and Immigration")

    # APPROVED badge
    c.setFillColor(HexColor("#1f7a3a"))
    c.roundRect(width - 1.95 * inch, height - 1.5 * inch, 1.25 * inch, 0.35 * inch, 6, stroke=0, fill=1)
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(width - 1.33 * inch, height - 1.28 * inch, "APPROVED")

    # Name
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(0.75 * inch, height - 1.7 * inch, visa["name"])

    # Fields table
    y = height - 2.3 * inch
    row_h = 0.45 * inch

    def row(label, value, y):
        c.setFillColor(DIM)
        c.setFont("Helvetica", 8.5)
        c.drawString(0.75 * inch, y, label.upper())
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(0.75 * inch, y - 0.18 * inch, value)
        c.setStrokeColor(HAIRLINE)
        c.setLineWidth(0.6)
        c.line(0.75 * inch, y - 0.3 * inch, width - 0.75 * inch, y - 0.3 * inch)

    row("ETA reference number", visa["reference"], y)
    row("Passport number ends in", visa["passport_tail"], y - row_h)
    row("Valid until", visa["valid_until"], y - 2 * row_h)
    row("Application approved", visa["approved"], y - 3 * row_h)

    # Key guidance block
    box_y = y - 4 * row_h - 0.25 * inch
    c.setFillColor(HexColor("#f5f1e8"))
    c.roundRect(0.75 * inch, box_y - 1.55 * inch, width - 1.5 * inch, 1.55 * inch, 8, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(0.95 * inch, box_y - 0.3 * inch, "At the UK border")
    c.setFont("Helvetica", 10)
    lines = [
        "- You only need your passport (the one ending in " + visa["passport_tail"] + ").",
        "- You do NOT need to print or show this document - ETAs are digital.",
        "- ETA is linked to this passport; a new passport requires a new ETA.",
        "- Allows tourism, visiting, business, or short-term study up to 6 months per trip.",
    ]
    ty = box_y - 0.55 * inch
    for line in lines:
        c.drawString(0.95 * inch, ty, line)
        ty -= 0.22 * inch

    # Footer
    c.setFillColor(DIM)
    c.setFont("Helvetica", 8)
    c.drawString(0.75 * inch, 0.6 * inch,
                 "Generated from GOV.UK approval email for offline reference. See https://www.gov.uk/standard-visitor for policy details.")
    c.drawString(0.75 * inch, 0.45 * inch,
                 "London 2026 trip app - not an official government document.")

    c.showPage()
    c.save()
    print(f"Wrote {out_path}")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for v in VISAS:
        draw(v)


if __name__ == "__main__":
    main()
