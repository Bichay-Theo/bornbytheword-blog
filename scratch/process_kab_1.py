import os

input_file = r'C:\Users\Boaz\Documents\Africa Translations\the 6 Translation_Blog\05 - Taqbaylit_Translation\01 الكفارة.md'
output_file = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\posts\penal-substitution-1-ot-redemption.kab.md'

with open(input_file, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.strip().split('\n')

# Find where content starts
start = 0
for i, l in enumerate(lines):
    if l.startswith('«') or l.startswith('> «') or 'Amagrad-agi' in l:
        start = i
        break

content_lines = lines[start:]
cleaned_lines = []

for line in content_lines:
    line_str = line.strip()
    
    if not line_str:
        cleaned_lines.append('')
        continue

    # Quotes
    if line_str.startswith('«') or (line_str.startswith('"') and line_str.endswith('"') and len(line_str) > 60):
        if not line_str.startswith('>'):
            cleaned_lines.append('> ' + line_str)
        else:
            cleaned_lines.append(line_str)
        continue
    
    # Headings
    if not line_str.startswith('>') and not line_str.startswith('##'):
        # In Taqbaylit, let's just pass things through if they are normal lines
        if 'Lɛahd Aqdim akk-d yimeslayen' in line_str or 'Bab n ufdu" (Go\'el)' in line_str or '"Lfedya" (Padhah)' in line_str or 'Imezura n teglizt' in line_str or 'Ulac leslak mbla lexlaṣ' in line_str:
             cleaned_lines.append('## ' + line_str.replace('**', ''))
             continue
             
        if 'Aɣer daɣen di tezrawt' in line_str:
             cleaned_lines.append(line_str)
             continue
        if 'Aḥric wis sin' in line_str:
             cleaned_lines.append(f'[{line_str}](/penal-substitution-2-nt-lutron)')
             continue

    cleaned_lines.append(line_str)

final_content = '\n'.join(cleaned_lines)

frontmatter = """---
title: "Asebbel deg wemkan-nneɣ (1): Ufdu di Lɛahd Aqdim.. Anwa i d Bab n ufdu?"
date: "2026-07-26T00:00:00Z"
slug: "penal-substitution-1-ot-redemption"
labels: ["الكفارة البدلية"]
---

![Bab n ufdu: Lmeɛna n usebbel di Lɛahd Aqdim](/images/posts/ot-redemption-kab.png)

26 Yulyu 2026

"""

with open(output_file, 'w', encoding='utf-8') as out_file:
    out_file.write(frontmatter + final_content.strip() + '\n')

print('Processed Taqbaylit 1 successfully.')
