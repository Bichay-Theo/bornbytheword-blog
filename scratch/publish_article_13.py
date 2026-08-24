import os
import shutil
import json
import subprocess

# Paths
blog_repo = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog"
src_md = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\wb_penal-substitution-13-reconciliation-2.md"
src_img = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\المصالحة_مع_الله_والخليقة_الجديدة.png"

dest_md = os.path.join(blog_repo, "content", "posts", "wb_penal-substitution-13-reconciliation-2.md")
dest_img = os.path.join(blog_repo, "public", "images", "المصالحة_مع_الله_والخليقة_الجديدة.png")
queue_file = os.path.join(blog_repo, "scripts", "publishing_queue.json")

# 1. Copy files
shutil.copy2(src_md, dest_md)
shutil.copy2(src_img, dest_img)
print("Files copied successfully.")

# 2. Update JSON
with open(queue_file, 'r', encoding='utf-8') as f:
    queue = json.load(f)

new_entry = {
    "file": "wb_penal-substitution-13-reconciliation-2.md",
    "title": "الكفارة البدلية (١٣): المصالحة (٢).. الاتحاد بالمسيح، السلام الموضوعي، والخليقة الجديدة",
    "hook": "مقال جديد: \n\n<b>الكفارة البدلية (١٣): الاتحاد والسلام الموضوعي</b>\n\nكيف نصير نحن حقاً طرفاً في هذه المصالحة المجيدة؟ الإجابة تكمن في أعظم أسرار الإنجيل: الاتحاد بالمسيح.\n\nلقراءة المقال:\n{url}",
    "poll": {
        "question": "هل تعلم أن المصالحة في المسيحية ليست مجرد سلام نفسي بل هي إعلان قانوني بانتهاء القطيعة؟",
        "options": [
            "نعم، هذا هو السلام الموضوعي",
            "لا، كنت أظنها سلاماً داخلياً فقط"
        ],
        "is_anonymous": True
    }
}

queue.append(new_entry)

with open(queue_file, 'w', encoding='utf-8') as f:
    json.dump(queue, f, ensure_ascii=False, indent=2)
print("Publishing queue updated.")

# 3. Git Operations
subprocess.run(["git", "add", dest_md, dest_img, queue_file], cwd=blog_repo, check=True)
subprocess.run(["git", "commit", "-m", "Publish Article 13: Reconciliation 2"], cwd=blog_repo, check=True)
# Not running git push yet just in case there's no remote set up, but let's try it.
try:
    subprocess.run(["git", "push"], cwd=blog_repo, check=True)
    print("Git push successful.")
except Exception as e:
    print("Git push failed or no remote configured:", e)

print("Publishing workflow completed.")
