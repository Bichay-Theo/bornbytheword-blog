import os

path1 = r"C:\Users\Boaz\Downloads\New African\reformed-theology-translation-roadmap-v4.md"
path2 = r"C:\Users\Boaz\Documents\Africa Translations\00_Master_Admin\Action_Plans\reformed-theology-translation-roadmap-v4.md"

def strip_personal_dialogue(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    # We want to remove the title and the note.
    # Lines 0 to 6 contain the title and the > [!NOTE] block and the --- separator.
    # We will start the file from the line that contains '## 🤖 مقدمة الإصدار الرابع (عصر الميكنة)'
    
    start_idx = 0
    for i, line in enumerate(lines):
        if line.startswith("## 🤖 مقدمة الإصدار الرابع"):
            start_idx = i
            break
            
    if start_idx > 0:
        new_lines = lines[start_idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Successfully updated: {filepath}")
    else:
        print(f"Start index not found in: {filepath}")

strip_personal_dialogue(path1)
strip_personal_dialogue(path2)
