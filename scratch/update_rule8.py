import os

skill_file = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\.agents\skills\theology_blog_writer\SKILL.md"

with open(skill_file, 'r', encoding='utf-8') as f:
    skill_content = f.read()

target_skill = """8. **Translation-Ready Arabic (لغة إرسالية قابلة للترجمة)**: صُغ الجمل بطريقة مباشرة وخالية من المحسنات البديعية المعقدة والمجازات الثقافية لتسهيل نقلها بدقة لاحقاً للغات الإفريقية. التركيز هنا على وضوح الفكرة اللاهوتية لتكون جاهزة للترجمة، مع ترك التشكيل وتنسيق الأرقام لعملية المراجعة النهائية."""

replacement_skill = """8. **The Dual-Output Pipeline (مسار الإنتاج المزدوج للترجمة)**: يجب إصدار كل مقال جديد عبر مسارين منفصلين لحل التضارب بين البلاغة العربية المصلحة وسهولة الترجمة الإفريقية:
   - **النسخة المرجعية للمدونة (مثال: `article.md`):** تُكتب بأسلوب عربي مصلح حار وبليغ (أسلوب بايبر)، مع استخدام الاستعارات اللاهوتية واللغة العميقة دون قيود.
   - **نسخة الترجمة الإرسالية (مثال: `article-i18n.md`):** يتم استنساخ المقال الأصلي وتجريده تماماً من البلاغة العربية (مجردات، مبني للمجهول، استعارات معقدة)، واستخدام جمل قصيرة ومباشرة. **شرط صارم:** يجب الاعتماد على القاموس اللاهوتي المعتمد (114 كلمة) الموجود في مجلد `glossaries/`، واستخدام جذوره العربية حصرياً في هذا النص كـ (مفاتيح ترجمة ثابتة) لضمان دقة النقل للغات الإفريقية السبع."""

if target_skill in skill_content:
    skill_content = skill_content.replace(target_skill, replacement_skill)
    with open(skill_file, 'w', encoding='utf-8') as f:
        f.write(skill_content)
    print("SKILL.md rule 8 updated successfully with Dual-Output Pipeline.")
else:
    print("Error updating SKILL.md rule 8")
