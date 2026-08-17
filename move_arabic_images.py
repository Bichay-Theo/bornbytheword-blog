import os
import glob
import re

directory = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\posts"
files = glob.glob(os.path.join(directory, "penal-substitution-*.md")) + glob.glob(os.path.join(directory, "wb_penal-substitution-*.md"))

# Filter to ONLY Arabic files (which end with exactly '.md', not '.am.md' etc, and not draft)
arabic_files = [f for f in files if re.search(r'\.md$', f) and not re.search(r'\.[a-z]{2,3}\.md$', f) and not f.endswith('.draft')]

for file_path in arabic_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parts = content.split('---\n', 2)
    if len(parts) < 3:
        continue
    
    body = parts[2]
    
    if re.match(r'^\s*!\[', body):
        print(f"Skipping (already at top): {os.path.basename(file_path)}")
        continue
        
    img_match = re.search(r'^\s*!\[.*?\]\(.*?\)\s*\n', body, re.MULTILINE)
    
    if img_match:
        img_text = img_match.group(0).strip()
        new_body = body.replace(img_match.group(0), '\n')
        new_body = f"\n{img_text}\n\n" + new_body.lstrip()
        new_content = f"{parts[0]}---\n{parts[1]}---\n{new_body}"
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"Moved image in: {os.path.basename(file_path)}")
    else:
        print(f"No image found in: {os.path.basename(file_path)}")
