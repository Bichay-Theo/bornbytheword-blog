import os
import re

posts_dir = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\posts"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    infographics = []
    
    for line in lines:
        if re.match(r'^\s*!\[.*?\]\(.*?\)\s*$', line):
            infographics.append(line)
        else:
            new_lines.append(line)
            
    if not infographics:
        return False
        
    # Find insertion point
    insert_idx = -1
    for i, line in enumerate(new_lines):
        if line.strip() == '***' or line.strip().startswith('[^1]:'):
            insert_idx = i
            if i > 0 and new_lines[i-1].strip() == '':
                insert_idx -= 1
            break
            
    if insert_idx == -1:
        for i, line in enumerate(new_lines):
            if '<div class="read-also-section">' in line:
                insert_idx = i
                if i > 0 and new_lines[i-1].strip() == '':
                    insert_idx -= 1
                break
                
    if insert_idx == -1:
        insert_idx = len(new_lines)
        
    # Clean up multiple empty lines around the insertion point
    while insert_idx > 0 and new_lines[insert_idx-1].strip() == '' and insert_idx > 1 and new_lines[insert_idx-2].strip() == '':
        del new_lines[insert_idx-1]
        insert_idx -= 1
        
    to_insert = ['\n'] + infographics + ['\n']
    final_lines = new_lines[:insert_idx] + to_insert + new_lines[insert_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)
        
    print(f"Moved {len(infographics)} infographics in {os.path.basename(filepath)}")
    return True

for filename in os.listdir(posts_dir):
    if filename.endswith(".md"):
        process_file(os.path.join(posts_dir, filename))
