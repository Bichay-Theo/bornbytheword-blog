import os
import glob
import re

content_dir = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content"
public_dir = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\public"

all_md_files = glob.glob(os.path.join(content_dir, '**', '*.md'), recursive=True)

valid_slugs = set()
arabic_posts = set()
translations = []

# Gather valid slugs
for f in all_md_files:
    basename = os.path.basename(f)
    if basename.endswith('.draft'): continue
    
    # Check if translation
    m = re.match(r'(.*)\.([a-z]{2,3})\.md$', basename)
    if m:
        slug, lang = m.groups()
        translations.append((f, slug, lang))
        valid_slugs.add(slug)
    else:
        # Arabic or base file
        slug = basename.replace('.md', '')
        arabic_posts.add(slug)
        valid_slugs.add(slug)

errors = []

# Check translations have base Arabic post
for f, slug, lang in translations:
    if slug not in arabic_posts:
        errors.append(f"[Translation Error] Translation {os.path.basename(f)} has no base Arabic post for slug '{slug}'")

# Check links and images in all files
img_pattern = re.compile(r'!\[.*?\]\((/images/[^\)]+)\)')
link_pattern = re.compile(r'\[.*?\]\((/[a-zA-Z0-9\-_]+)\)')

for f in all_md_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check images
    for img_path in img_pattern.findall(content):
        # img_path might have URL params or anchors, strip them
        clean_path = img_path.split('?')[0].split('#')[0]
        # Remove leading slash to join with public_dir
        local_path = os.path.join(public_dir, clean_path.lstrip('/'))
        if not os.path.exists(local_path):
            errors.append(f"[Image Error] Missing image '{img_path}' in {os.path.basename(f)}")
            
    # Check internal links
    for link_path in link_pattern.findall(content):
        slug = link_path.lstrip('/')
        # Exclude known root/lang links or external
        if slug in ['am', 'sw', 'shi', 'kab', 'tmh', 'mas', '']: continue
        if slug not in valid_slugs:
            errors.append(f"[Link Error] Broken internal link '{link_path}' in {os.path.basename(f)}")

if not errors:
    print("All checks passed! No broken links or missing images found.")
else:
    print("Found errors:")
    for e in errors:
        print(e)
