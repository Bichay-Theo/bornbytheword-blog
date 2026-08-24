import os

skill_file = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\.agents\skills\theology_blog_writer\SKILL.md"

with open(skill_file, 'r', encoding='utf-8') as f:
    skill_content = f.read()

target_skill = """7. **Facebook Post Generation**: Save FB drafts in a `FB_Post` folder. Include the static URL sentence, standard bracket footnotes `[1]` (only for FB), a Call To Action (CTA), and a Hook for the next article."""

replacement_skill = """7. **Facebook Post Formatting (نسق منشور الفيسبوك)**: عند طلب إصدار "مقال الفيسبوك"، يجب إنتاج نسخة نصية كاملة من المقال وتُحفظ في مجلد `FB_Post`. التزم بالنسق التالي بدقة: (١) إضافة رابط المدونة في أعلى المنشور بين علامتي النجمة `*(لقراءة أسهل تفضل بزيارة المقال مباشرة على المدونة من هذا الرابط: [الرابط])*`، (٢) استخدام الإيموجيز (Emojis) لعناوين الأقسام (مثل 🔗، 🕊️، 🏛️) بدلاً من التنقيط المربع أو علامات الهاشتاج، (٣) تحويل أرقام الهوامش في المتن إلى صيغة الأقواس المربعة العادية `[1]`، (٤) جمع كل الهوامش في أسفل المقال تحت فاصل `***\nالهوامش والمراجع:`."""

if target_skill in skill_content:
    skill_content = skill_content.replace(target_skill, replacement_skill)
    with open(skill_file, 'w', encoding='utf-8') as f:
        f.write(skill_content)
    print("SKILL.md rule for Facebook formatting updated successfully.")
else:
    print("Error updating Facebook rule in SKILL.md")
