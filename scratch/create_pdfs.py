import os
from fpdf import FPDF
import re

FILES = [
    "content/posts/penal-substitution-1-ot-redemption.md",
    "content/posts/penal-substitution-2-nt-lutron.md",
    "content/posts/penal-substitution-3-agorazo.md",
    "content/posts/penal-substitution-4-covenant.md",
    "content/posts/penal-substitution-5-curse-wrath.md"
]

OUTPUT_DIR = "scratch/Scribd_PDFs"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

for file in FILES:
    if os.path.exists(file):
        with open(file, "r", encoding="utf-8") as f:
            text = f.read()
            
        # Clean up some basic markdown
        text = re.sub(r'#+\s*', '', text)
        text = re.sub(r'\*\*|\*', '', text)
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        # Split text into lines to avoid overflow
        for line in text.split('\n'):
            # Replace unsupported characters for default Arial font
            safe_line = line.encode('latin-1', 'replace').decode('latin-1')
            pdf.multi_cell(0, 10, txt=safe_line)
            
        out_name = os.path.join(OUTPUT_DIR, os.path.basename(file).replace(".md", ".pdf"))
        pdf.output(out_name)
        print(f"Created: {out_name}")
    else:
        print(f"File not found: {file}")
