import os
import shutil
import subprocess

# Paths
blog_repo = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog"
draft_path = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\wb_penal-substitution-12-reconciliation.md"
image_path = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\رحلة_المصالحة__من_الدينونة_للنعمة.png"
fb_post_dir = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\FB_Post"
fb_post_file = os.path.join(fb_post_dir, "FB_Post_Article12.txt")
blog_posts_dir = os.path.join(blog_repo, "content", "posts")
blog_images_dir = os.path.join(blog_repo, "public", "images")

# 1. Read the Markdown
with open(draft_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# Separate frontmatter and body
parts = md_content.split('---')
if len(parts) >= 3:
    frontmatter = parts[1]
    body = '---'.join(parts[2:]).strip()
else:
    body = md_content

# 2. Generate FB Post
# Extract Title and Slug (roughly)
title = 'الكفارة البدلية (١٢): المصالحة (١).. من ساحة الدينونة إلى عرش النعمة والتبادل العظيم'
slug = 'penal-substitution-12-reconciliation-1'
url = f"https://bichay-theo.github.io/bornbytheword-blog/p/{slug}/"

# Convert footnotes
import re
fb_body = re.sub(r'\[\^(\d+)\]', r'[\1]', body)

# Add Facebook wrapper
fb_content = f"""{title}
*(لقراءة أسهل تفضل بزيارة المقال مباشرة على المدونة من هذا الرابط: {url})*

{fb_body}

هذا المقال هو جزء من سلسلة لاهوتية متكاملة، تأكد من متابعة الصفحة (Follow) لتصلك الأجزاء القادمة، وشارك المنشور (Share) لتعم الفائدة.

كيف ترتبط مصالحتنا بقصة طرد آدم من الجنة واسترداد حضور الله المفقود؟ وكيف أعلنت المصالحة عن ولادة "خليقة جديدة"؟ انتظروا المقال القادم (الجزء الثاني من المصالحة) لاكتشاف هذه الأبعاد الكونية المبهرة!
"""

os.makedirs(fb_post_dir, exist_ok=True)
with open(fb_post_file, "w", encoding="utf-8") as f:
    f.write(fb_content)

print("Facebook post generated successfully.")

# 3. Add Image to Blog
if os.path.exists(image_path):
    shutil.copy2(image_path, blog_images_dir)
    print(f"Image copied to {blog_images_dir}")
    
    # Optionally embed the image at the top of the article body, but usually it's a cover image. 
    # The user says "قم بالنشر وعمل بوست". I will just move the files as is.
else:
    print(f"Warning: Image not found at {image_path}")

# 4. Copy Article to Blog
shutil.copy2(draft_path, os.path.join(blog_posts_dir, os.path.basename(draft_path)))
print(f"Article copied to {blog_posts_dir}")

# 5. Git Push
def run_git(cmd):
    result = subprocess.run(cmd, cwd=blog_repo, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Git error: {result.stderr}")
    else:
        print(result.stdout)

run_git("git add content/posts/wb_penal-substitution-12-reconciliation.md")
run_git("git add public/images/رحلة_المصالحة__من_الدينونة_للنعمة.png")
run_git('git commit -m "Publish Article 12: Reconciliation 1"')
run_git("git push")
print("Published to GitHub.")
