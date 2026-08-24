import os

input_file = r'C:\Users\Boaz\Documents\Africa Translations\the 6 Translation_Blog\01 - Amharic_Translation\المكفارة 01.txt'
output_file = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\posts\penal-substitution-1-ot-redemption.am.md'

with open(input_file, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')

# Find the start of the content (skip title and date)
content_start = 0
for i, line in enumerate(lines):
    if '«' in line or line.startswith('"'):
        content_start = i
        break

content_lines = lines[content_start:]

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
    # Check if line doesn't end with typical punctuation and is short
    if not line_str.startswith('>') and not line_str.startswith('##'):
        if len(line_str) < 100 and not line_str.endswith('።') and not line_str.endswith('፣'):
            # Some headings might have quotes around words, but they aren't the whole blockquote
            if 'ክፍል ሁለት' in line_str:
                cleaned_lines.append(f'[{line_str}](/penal-substitution-2-nt-lutron)')
            elif 'ማስታወሻ፡' in line_str or 'በቅጣት ምትክነት' in line_str:
                cleaned_lines.append(line_str) # Keep it normal text
            else:
                cleaned_lines.append('## ' + line_str.replace('**', ''))
            continue

    cleaned_lines.append(line_str)

final_content = '\n'.join(cleaned_lines)

frontmatter = """---
title: "የቅጣት ምትክነት ስርየት (1)፡ ቤዛነት በብሉይ ኪዳን.. ተቤዢው ማነው?"
date: "2026-07-26T00:00:00Z"
slug: "penal-substitution-1-ot-redemption"
labels: ["الكفارة البدلية"]
---

![የቤዛነት ትርጉም በብሉይ ኪዳን](/images/posts/ot-redemption-am.png)

26 ሐምሌ 2026

"""

with open(output_file, 'w', encoding='utf-8') as out_file:
    out_file.write(frontmatter + final_content.strip() + '\n')

print('Processed Amharic 1 successfully.')
