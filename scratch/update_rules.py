import os

skill_file = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\.agents\skills\theology_blog_writer\SKILL.md"
plan_file = r"C:\Users\Boaz\Desktop\Penal_Substitution_Plan.md"

# Update SKILL.md
with open(skill_file, 'r', encoding='utf-8') as f:
    skill_content = f.read()

target_skill = """## Section 5: References & Sources (المراجع المعتمدة)
Search these paths when theological research is required:"""

replacement_skill = """## Section 5: References & Sources (المراجع المعتمدة)
**Methodology Rules for Referencing:**
1. **Primary Source Priority (أولوية المصدر الأولي):** Always quote the primary source directly instead of quoting a contemporary theologian who cited them (e.g., if Piper quotes Josef Tson, find and cite Tson directly). Contemporary theologians are just indexes/guides to primary treasures.
2. **Footnote Discipline (منع حشو الهوامش):** Do NOT pad footnotes with general Reformed doctrines or universally accepted theological concepts (like Calvin affirming the Holy Spirit connects us to Christ). Integrate these truths organically into the main text as established biblical facts. Reserve footnotes EXCLUSIVELY for highly specific, unique reference material or distinct quotes that no one else has articulated.

Search these paths when theological research is required:"""

if target_skill in skill_content:
    skill_content = skill_content.replace(target_skill, replacement_skill)
    with open(skill_file, 'w', encoding='utf-8') as f:
        f.write(skill_content)
    print("SKILL.md updated successfully.")
else:
    print("Error updating SKILL.md")


# Update Penal_Substitution_Plan.md
with open(plan_file, 'r', encoding='utf-8') as f:
    plan_content = f.read()

target_plan = """11. **الانضباط التقني في الصياغة (Markdown Discipline):** الالتزام الصارم بصيغة الهوامش الماركدوان `[^1]` في مسودات المدونة حتى تقرأها محررات النصوص كـ (Obsidian) بشكل صحيح. واستخدام علامات الشطب `~~النص~~` كوسيلة حصرية للتعديل التفاعلي المتبادل (Creative Diffing) في المسودات، مع الالتزام التام بتنظيف ومسح هذه العلامات كلياً قبل النشر النهائي لضمان نقاء المقال الحي.

## أسلوب الصياغة المعتمد للسلسلة (Writing Style Specifics)"""

replacement_plan = """11. **الانضباط التقني في الصياغة (Markdown Discipline):** الالتزام الصارم بصيغة الهوامش الماركدوان `[^1]` في مسودات المدونة حتى تقرأها محررات النصوص كـ (Obsidian) بشكل صحيح. واستخدام علامات الشطب `~~النص~~` كوسيلة حصرية للتعديل التفاعلي المتبادل (Creative Diffing) في المسودات، مع الالتزام التام بتنظيف ومسح هذه العلامات كلياً قبل النشر النهائي لضمان نقاء المقال الحي.
12. **أولوية المصدر الأولي (Primary Source Priority):** الاعتماد المباشر على المصدر الأولي (مثل اقتباس چوزيف تسون مباشرة) بدلاً من الاستشهاد بلاهوتي معاصر (مثل بايبر) كمرجع للفكرة، فالمعاصرون هم مجرد فهارس ترشدنا للكنوز الأصلية.
13. **منع حشو الهوامش (Footnote Discipline):** لا تستخدم الهوامش لنسب حقائق لاهوتية عامة وراسخة لشخصيات معينة. الحقائق العامة تُدمج بقوة في المتن دون إقحام أسماء تضعف الحجة. تُستخدم الهوامش حصرياً للأفكار المرجعية الفريدة التي تفرد بها صاحبها.

## أسلوب الصياغة المعتمد للسلسلة (Writing Style Specifics)"""

if target_plan in plan_content:
    plan_content = plan_content.replace(target_plan, replacement_plan)
    with open(plan_file, 'w', encoding='utf-8') as f:
        f.write(plan_content)
    print("Penal_Substitution_Plan.md updated successfully.")
else:
    print("Error updating Penal_Substitution_Plan.md")
