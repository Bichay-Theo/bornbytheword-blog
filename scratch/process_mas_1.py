import os

input_file = r'C:\Users\Boaz\Documents\Africa Translations\the 6 Translation_Blog\03 - Masaya_Translation\الكفارة 1.txt'
output_file = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\posts\penal-substitution-1-ot-redemption.mas.md'

with open(input_file, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
title_idx = -1
date_idx = -1
for i, line in enumerate(lines[:30]):
    if '26' in line and ('2026' in line or 'July' in line or 'Julai' in line or 'Yulyu' in line or 'ሐምሌ' in line):
        date_idx = i
        for j in range(i-1, -1, -1):
            if lines[j].strip():
                title_idx = j
                break
        break

if title_idx != -1:
    title = lines[title_idx].replace('**', '').strip()
    
    content_lines = []
    if ' - ' in lines[date_idx]:
        parts = lines[date_idx].split(' - ', 1)
        verse = parts[1].strip()
        if not verse.startswith('>'):
            verse = '> ' + verse
        content_lines.append(verse)
        content_lines.append('')
        content_lines.extend(lines[date_idx+1:])
    else:
        content_lines = lines[date_idx+1:]
        
    for i in range(len(content_lines)):
        if content_lines[i].strip().startswith('«') or content_lines[i].strip().startswith('"'):
            content_lines[i] = '> ' + content_lines[i].lstrip('> ')
            
    cleaned_lines = []
    in_toc = False
    toc_keywords = ['የጽሑፉ ማውጫ', 'Yaliyomo ya Makala', 'Inkiteng', 'Aratăn n-tăkarḍe', 'Ayen yellan deg umagrad', 'Igzzumn n umagrad']
    
    for line in content_lines:
        line_str = line.strip()
        if any(k in line_str for k in toc_keywords):
            in_toc = True
            continue
        if in_toc:
            if not line_str or line_str.startswith('*') or ('Go' + "'" + 'el' in line_str and '↩' not in line_str) or ('Olasharuni' in line_str and '↩' not in line_str and len(line_str) < 80):
                continue
            else:
                in_toc = False
        
        if '↩' in line_str or ('Olasharuni' in line_str and len(line_str) < 80 and not line_str.startswith('>')) or ('Go' + "'" + 'el' in line_str and len(line_str) < 80 and not line_str.startswith('>')):
            if not line_str.startswith('#'):
                cleaned_lines.append('## ' + line_str.replace('↩', '').replace('**', '').strip())
                continue
        
        if line_str.startswith('«') and len(line_str) > 50 and ')' in line_str:
            cleaned_lines.append('> ' + line_str)
            continue
            
        cleaned_lines.append(line)
        
    final_content = '\n'.join(cleaned_lines)
    
    frontmatter = f'''---
title: "{title}"
date: "2026-07-26T00:00:00Z"
slug: "penal-substitution-1-ot-redemption"
labels: ["الكفارة البدلية"]
---

![{title}](/images/posts/ot-redemption-mas.png)

'''
    
    with open(output_file, 'w', encoding='utf-8') as out_file:
        out_file.write(frontmatter + final_content.strip() + '\n')
    print('Processed Masaya 1 successfully.')
else:
    print('Failed to find title and date.')
