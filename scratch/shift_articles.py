import os
import re

drafts_dir = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution"
plan_path = r"C:\Users\Boaz\Desktop\Penal_Substitution_Plan.md"

# 1. Update the Plan file
with open(plan_path, 'r', encoding='utf-8') as f:
    plan_content = f.read()

# Change total number
plan_content = plan_content.replace("(١٩ مقال)", "(١٨ مقال)")

# Remove Article 12 (Propitiation 4) from the list
plan_content = re.sub(r"- `\[ \]` \*\*المقال الثاني عشر:\*\* الكفارة البدلية \(١٢\): الاسترضاء \(٤\).*?\n", "", plan_content)

# Shift the Arabic text numbers in the plan
def shift_plan_numbers(match):
    old_num_text = match.group(1)
    old_num_digit = match.group(2)
    mapping_text = {
        "الثالث عشر": "الثاني عشر",
        "الرابع عشر": "الثالث عشر",
        "الخامس عشر": "الرابع عشر",
        "السادس عشر": "الخامس عشر",
        "السابع عشر": "السادس عشر",
        "الثامن عشر": "السابع عشر",
        "التاسع عشر والأخير": "الثامن عشر والأخير"
    }
    mapping_digit = {
        "١٣": "١٢", "١٤": "١٣", "١٥": "١٤", "١٦": "١٥",
        "١٧": "١٦", "١٨": "١٧", "١٩": "١٨"
    }
    new_text = mapping_text.get(old_num_text, old_num_text)
    new_digit = mapping_digit.get(old_num_digit, old_num_digit)
    return f"- `[ ]` **المقال {new_text}:** الكفارة البدلية ({new_digit}):"

plan_content = re.sub(r"- `\[ \]` \*\*المقال (.*?):\*\* الكفارة البدلية \((.*?)\):", shift_plan_numbers, plan_content)

with open(plan_path, 'w', encoding='utf-8') as f:
    f.write(plan_content)


# 2. Delete the old redundant article 12
old_12 = os.path.join(drafts_dir, "wb_penal-substitution-12-propitiation-4.md")
if os.path.exists(old_12):
    os.remove(old_12)

# 3. Rename files 13 to 19 and update their content
mapping_digit = {
    "١٣": "١٢", "١٤": "١٣", "١٥": "١٤", "١٦": "١٥",
    "١٧": "١٦", "١٨": "١٧", "١٩": "١٨"
}

for i in range(13, 20):
    # Find the file that starts with wb_penal-substitution-{i}-
    for filename in os.listdir(drafts_dir):
        if filename.startswith(f"wb_penal-substitution-{i}-"):
            old_path = os.path.join(drafts_dir, filename)
            new_filename = filename.replace(f"-{i}-", f"-{i-1}-")
            new_path = os.path.join(drafts_dir, new_filename)
            
            # Read content
            with open(old_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Update title in frontmatter
            content = re.sub(r'title: "الكفارة البدلية \((.*?)\)', lambda m: f'title: "الكفارة البدلية ({mapping_digit.get(m.group(1), m.group(1))})', content)
            
            # Update slug in frontmatter
            content = re.sub(r'slug: "penal-substitution-\d+', f'slug: "penal-substitution-{i-1}', content)
            
            # Write new content to new file
            with open(new_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
            # Delete old file
            os.remove(old_path)
            break

# 4. Update the "read-also-section" in ALL markdown files to fix any shifted links
# We need to replace /penal-substitution-19 with 18, 18 with 17, etc. in descending order
for filename in os.listdir(drafts_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(drafts_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        for i in range(19, 12, -1):
            content = content.replace(f"/penal-substitution-{i}-", f"/penal-substitution-{i-1}-")
            # Also update the display text in read-also: الكفارة البدلية (١٣) -> (١٢)
            content = content.replace(f"الكفارة البدلية ({list(mapping_digit.keys())[i-13]})", f"الكفارة البدلية ({list(mapping_digit.values())[i-13]})")
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print("Shift completed successfully.")
