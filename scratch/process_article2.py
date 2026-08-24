import os, json, re

base_dir = r'C:\Users\Boaz\Documents\Africa Translations\the 6 Translation_Blog'
lang_map = {'01': 'am', '02': 'sw', '03': 'mas', '04': 'tmh', '05': 'kab', '06': 'shi'}
out_dir = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\posts'

slug = 'penal-substitution-2-nt-lutron'
date = '2026-07-26T00:00:00Z'

def extract_content(text):
    lines = text.split('\n')
    title_idx = -1
    date_idx = -1
    for i, line in enumerate(lines[:30]):
        if '26' in line and ('2026' in line or 'July' in line or 'Julai' in line or 'Yulyu' in line or 'ሐምሌ' in line or 'yulyu' in line or 'Yulyuz' in line):
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
            if content_lines[i].strip().startswith('«') or content_lines[i].strip().startswith('"Amu meewuo'):
                content_lines[i] = '> ' + content_lines[i].lstrip('> ')
                break
                
        cleaned_lines = []
        in_toc = False
        toc_keywords = ['የጽሑፉ ማውጫ', 'Yaliyomo ya Makala', 'Inkiteng', 'Aratăn n-tăkarḍe', 'Ayen yellan deg umagrad', 'Igzzumn n umagrad']
        
        for line in content_lines:
            line_str = line.strip()
            if any(k in line_str for k in toc_keywords):
                in_toc = True
                continue
            if in_toc:
                if not line_str or line_str.startswith('*') or ('Lutron' in line_str and '↩' not in line_str) or 'Anti =' in line_str:
                    continue
                else:
                    in_toc = False
            
            if '↩' in line_str or ('Lutron)' in line_str and len(line_str) < 80) or ('Anti =' in line_str and len(line_str) < 80):
                if not line_str.startswith('#'):
                    cleaned_lines.append('## ' + line_str.replace('↩', '').replace('**', '').strip())
                    continue
            
            if line_str.startswith('«') and len(line_str) > 50 and ')' in line_str:
                cleaned_lines.append('> ' + line_str)
                continue
                
            cleaned_lines.append(line)
            
        final_content = '\n'.join(cleaned_lines)
        return title, final_content
    
    return 'TITLE NOT FOUND', text

for lang_dir in os.listdir(base_dir):
    if not os.path.isdir(os.path.join(base_dir, lang_dir)): continue
    lang_code = lang_map.get(lang_dir.split(' - ')[0])
    
    for f in os.listdir(os.path.join(base_dir, lang_dir)):
        if f.endswith('.txt') and '02' in f:
            path = os.path.join(base_dir, lang_dir, f)
            with open(path, 'r', encoding='utf-8') as file:
                raw_text = file.read()
                
            title, content = extract_content(raw_text)
            
            frontmatter = f'---\ntitle: "{title}"\ndate: "{date}"\nslug: "{slug}"\nlabels: ["الكفارة البدلية"]\n---\n\n![{title}](/images/posts/nt-redemption-{lang_code}.png)\n\n'
            
            out_path = os.path.join(out_dir, f'{slug}.{lang_code}.md')
            with open(out_path, 'w', encoding='utf-8') as out_file:
                out_file.write(frontmatter + content.strip() + '\n')
            print(f'Processed {lang_code}: {out_path}')
