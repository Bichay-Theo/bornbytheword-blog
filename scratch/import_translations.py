import os
import glob

base_dir = r'C:\Users\Boaz\Documents\Africa Translations\the 6 Translation_Blog'
out_dir = r'c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\posts'

mapping = {
    '01 - Amharic_Translation': 'am',
    '02 - Swahili_Translation': 'sw',
    '03 - Masaya_Translation': 'mas',
    '04 - Tamasheq_Translation': 'tmh',
    '05 - Taqbaylit_Translation': 'kab',
    '06 - Tashelhit_Translation': 'shi'
}

slug = 'penal-substitution-1-ot-redemption'
labels = '["الكفارة البدلية"]'

for folder, locale in mapping.items():
    folder_path = os.path.join(base_dir, folder)
    txt_files = glob.glob(os.path.join(folder_path, '*.txt'))
    if not txt_files:
        print(f'No txt file found in {folder}')
        continue
    
    file_path = txt_files[0]
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    if not lines: continue
    
    # Extract title and date
    title = lines[0].strip()
    
    # Check if second line is date
    body_start = 1
    if len(lines) > 1 and ('2026' in lines[1] or '202' in lines[1]):
        body_start = 2
        
    body_lines = lines[body_start:]
    # Strip leading empty lines from body
    while body_lines and not body_lines[0].strip():
        body_lines.pop(0)
        
    # Build frontmatter
    frontmatter = f"""---
title: "{title}"
date: "2026-07-26T00:00:00Z"
slug: "{slug}"
labels: {labels}
---

"""
    
    out_file = os.path.join(out_dir, f'{slug}.{locale}.md')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
        f.write(''.join(body_lines))
        
    print(f'Created {out_file}')
