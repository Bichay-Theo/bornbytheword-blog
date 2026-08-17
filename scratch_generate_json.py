import json
import re

md_file = r'C:\Users\Boaz\Desktop\Tashelhit\Tashelhit_Reformed_Theological_Glossary_Audited.md'
json_file = r'C:\Users\Boaz\Desktop\Tashelhit\Tashelhit_Reformed_Glossary_For_Gemini.json'

glossary = {"Tashelhit_Reformed_Glossary": {}}
current_category = ""

with open(md_file, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if line.startswith('### '):
            current_category = line[4:].strip()
            # Clean category name for json key
            cat_key = re.sub(r'[^a-zA-Z0-9]+', '_', current_category.split('(')[-1].replace(')', '')).strip('_')
            if not cat_key:
                cat_key = current_category.replace(' ', '_')
            current_category = cat_key
            glossary["Tashelhit_Reformed_Glossary"][current_category] = []
        elif line.startswith('|') and not line.startswith('| المصطلح') and not line.startswith('| :---'):
            parts = [p.strip() for p in line.split('|')[1:-1]]
            if len(parts) >= 3:
                term_cell = parts[0]
                # Extract English and Arabic from term_cell
                # Format: **English**<br><small>Arabic</small>
                eng_match = re.search(r'\*\*(.*?)\*\*', term_cell)
                ar_match = re.search(r'<small>(.*?)</small>', term_cell)
                
                english = eng_match.group(1).strip() if eng_match else ""
                arabic = ar_match.group(1).strip() if ar_match else ""
                
                # Audited Tashelhit is in parts[2]
                tashelhit = parts[2].replace('**', '').replace('`', '').strip()
                
                if current_category and english:
                    glossary["Tashelhit_Reformed_Glossary"][current_category].append({
                        "english": english,
                        "arabic": arabic,
                        "tashelhit": tashelhit
                    })

with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(glossary, f, ensure_ascii=False, indent=2)

print(f"JSON generated at: {json_file}")
