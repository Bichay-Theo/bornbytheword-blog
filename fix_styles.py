import os
import re

pages_dir = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\pages"
globals_css = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\src\app\globals.css"

# 1. Fix globals.css chapter-divider margin
with open(globals_css, 'r', encoding='utf-8') as f:
    css_content = f.read()
css_content = css_content.replace('margin: 5rem 0;', 'margin: 2rem 0;')
with open(globals_css, 'w', encoding='utf-8') as f:
    f.write(css_content)
print("Updated globals.css")

# 2. Fix pages
toc_old = '<div id="toc" style="background: var(--card-bg); padding: 2rem; border-radius: 8px; border: 1px solid var(--secondary); margin-bottom: 3rem;">'
toc_new = '<div id="toc" style="margin-bottom: 3rem;">'

for filename in os.listdir(pages_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(pages_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix colors
        content = content.replace('--primary-color', '--primary')
        content = content.replace('--secondary-color', '--secondary')
        
        # Fix TOC rectangle
        content = content.replace(toc_old, toc_new)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
