import os
import shutil

base_dir = r"C:\Users\Boaz\Documents\Africa Translations"
archive_dir = os.path.join(base_dir, "Africa_Archive")
admin_dir = os.path.join(base_dir, "00_Master_Admin")
action_plans_dir = os.path.join(admin_dir, "Action_Plans")
master_glossaries_dir = os.path.join(admin_dir, "Master_Glossaries")

languages = [
    ("01_Amharic", "Amharic"),
    ("02_Swahili", "Swahili"),
    ("03_Maasai", "Masaya", "Maa", "Maasai"),
    ("04_Tamasheq", "Tamasheq"),
    ("05_Taqbaylit", "Taqbaylit", "Kabyle"),
    ("06_Tashelhit", "Tashelhit")
]

# 1. Create target directories
os.makedirs(archive_dir, exist_ok=True)
os.makedirs(action_plans_dir, exist_ok=True)
os.makedirs(master_glossaries_dir, exist_ok=True)

for lang_group in languages:
    lang_folder = os.path.join(base_dir, lang_group[0])
    os.makedirs(os.path.join(lang_folder, "Articles"), exist_ok=True)
    os.makedirs(os.path.join(lang_folder, "Infographics"), exist_ok=True)
    os.makedirs(os.path.join(lang_folder, "Glossaries"), exist_ok=True)

# 2. Function to determine where an active file goes
def process_active_file(src_path, filename, lang_group):
    folder_name, *keywords = lang_group
    lang_name = folder_name.split('_')[1]
    
    # Prepend language name if missing
    new_filename = filename
    if not any(k.lower() in filename.lower() for k in keywords):
        new_filename = f"{lang_name}_{filename}"
        
    ext = os.path.splitext(filename)[1].lower()
    if ext in ['.png', '.jpg', '.jpeg']:
        dest_folder = os.path.join(base_dir, folder_name, "Infographics")
    elif ext in ['.txt', '.md']:
        dest_folder = os.path.join(base_dir, folder_name, "Articles")
    else:
        dest_folder = os.path.join(base_dir, folder_name) # fallback
        
    dest_path = os.path.join(dest_folder, new_filename)
    try:
        shutil.move(src_path, dest_path)
    except:
        pass

# 3. Process active translation blog
blog_dir = os.path.join(base_dir, "the 6 Translation_Blog")
if os.path.exists(blog_dir):
    for root, dirs, files in os.walk(blog_dir):
        for file in files:
            src = os.path.join(root, file)
            # determine language by root path
            for lang_group in languages:
                if any(k.lower() in root.lower() for k in lang_group[1:]):
                    process_active_file(src, file, lang_group)
                    break
    
    # move leftover empty blog dir to archive just in case
    try:
        shutil.move(blog_dir, os.path.join(archive_dir, "the 6 Translation_Blog"))
    except:
        pass

# 4. Move master glossaries
for item in os.listdir(base_dir):
    if "pentalingual" in item.lower():
        src = os.path.join(base_dir, item)
        if os.path.isfile(src):
            try:
                shutil.move(src, os.path.join(master_glossaries_dir, item))
            except:
                pass

glossary_dir = os.path.join(base_dir, "Glossaries_NotbookLM_final")
if os.path.exists(glossary_dir):
    for item in os.listdir(glossary_dir):
        src = os.path.join(glossary_dir, item)
        if "pentalingual" in item.lower():
            try:
                shutil.move(src, os.path.join(master_glossaries_dir, item))
            except:
                pass
        else:
            # check which language glossary it is
            moved = False
            for lang_group in languages:
                folder_name, *keywords = lang_group
                if any(k.lower() in item.lower() for k in keywords):
                    try:
                        shutil.move(src, os.path.join(base_dir, folder_name, "Glossaries", item))
                        moved = True
                    except:
                        pass
                    break
            if not moved:
                try:
                    shutil.move(src, os.path.join(archive_dir, item))
                except:
                    pass
    try:
        shutil.move(glossary_dir, os.path.join(archive_dir, "Glossaries_NotbookLM_final"))
    except:
        pass

# 5. Move Action Plans & Roadmaps
action_plan_src = os.path.join(base_dir, "Africa_Translation_Action_Plan.md")
if os.path.exists(action_plan_src):
    try:
        shutil.move(action_plan_src, os.path.join(action_plans_dir, "Africa_Translation_Action_Plan.md"))
    except:
        pass

blueprint_src = os.path.join(base_dir, "reformed-translation-blueprint-v3.txt")
if os.path.exists(blueprint_src):
    try:
        shutil.move(blueprint_src, os.path.join(action_plans_dir, "reformed-translation-blueprint-v3.txt"))
    except:
        pass

africa_plan_src = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\scratch\africa_plan.md"
if os.path.exists(africa_plan_src):
    try:
        shutil.copy(africa_plan_src, os.path.join(action_plans_dir, "africa_plan_latest.md"))
    except:
        pass

# 6. Archive all other root folders and files that are not our new structured folders
structured_folders = ["00_Master_Admin"] + [g[0] for g in languages] + ["Africa_Archive"]
for item in os.listdir(base_dir):
    if item not in structured_folders:
        src = os.path.join(base_dir, item)
        dest = os.path.join(archive_dir, item)
        try:
            shutil.move(src, dest)
        except Exception as e:
            pass

print("Reorganization complete!")
