import os

# 1. Clean FB Post
fb_post_file = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\FB_Post\FB_Post_Article12.txt"
with open(fb_post_file, 'r', encoding='utf-8') as f:
    fb_content = f.read()

markdown_to_remove = """***
<div class="read-also-section">

**اقرأ أيضاً في سلسلة الكفارة البدلية:**
- [الكفارة البدلية (٩): الاسترضاء (٢).. هل غضب الله أسطورة وثنية؟](/penal-substitution-9-propitiation-2)
- [الكفارة البدلية (١٠): كأس الغضب.. لماذا كل هذه الذبائح والرموز؟](/penal-substitution-10-wrath)
- [الكفارة البدلية (١١): الاسترضاء (٣).. هل ألغى العهد الجديد غضب الله؟](/penal-substitution-11-propitiation-3)

</div>"""
fb_content = fb_content.replace(markdown_to_remove, "")
with open(fb_post_file, 'w', encoding='utf-8') as f:
    f.write(fb_content)
print("FB post cleaned.")


# 2. Fix Plan File Duplication
plan_file = r"C:\Users\Boaz\Desktop\Penal_Substitution_Plan.md"
with open(plan_file, 'r', encoding='utf-8') as f:
    plan_content = f.read()

duplicated_section = """## فهرس المفاهيم والروابط (Concept Linking Index)
هذا الفهرس يُستخدم لربط المقالات الجديدة بالمقالات السابقة بشكل عضوي (٣ روابط على الأقل في كل مقال):
- **مفهوم الفداء والولي (Go'el):** `/penal-substitution-1-redemption-ot`
- **مفهوم الفدية وسوق العبيد (Lutron):** `/penal-substitution-2-redemption-nt`
- **أغورازو والملكية الإلهية:** `/penal-substitution-3-agorazo`
- **العهد (Covenant) والدم:** `/penal-substitution-4-covenant-blood`
- **لعنة الناموس (غلاطية 3: 13):** `/penal-substitution-5-curse-of-the-law`
- **الدم ومعناه الكفاري:** `/penal-substitution-6-blood`
- **حمل الله:** `/penal-substitution-7-lamb-of-god`

---
"""
if duplicated_section in plan_content:
    plan_content = plan_content.replace(duplicated_section, "")
    with open(plan_file, 'w', encoding='utf-8') as f:
        f.write(plan_content)
    print("Plan file cleaned of duplication.")
else:
    print("Duplication not found in plan file.")


# 3. Add to Glossary
glossary_file = r"C:\Users\Boaz\Documents\Theology_WB\06_Glossaries_and_References\Gemini_Master_Glossary.csv"
new_terms = [
    "Soteriology,Reconciliation,المصالحة,Katallasso,✅",
    "Soteriology,Double Imputation,الاحتساب المزدوج,Crucial Reformation Concept,✅"
]
with open(glossary_file, 'a', encoding='utf-8') as f:
    for term in new_terms:
        f.write("\n" + term)
print("Glossary updated.")
