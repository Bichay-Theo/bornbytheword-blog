import os

skill_path = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\.agents\skills\theology_blog_writer\SKILL.md"
with open(skill_path, "r", encoding="utf-8") as f:
    content = f.read()

old_text = """## 21. الشبكة اللاهوتية المترابطة (Internal Thematic Linking)
بما أن المدونة بأكملها تدور حول مركزية يسوع المسيح وإنجيل النعمة، يجب على الكاتب دائماً البحث عن فرص لربط المقال الجديد بأي مقال سابق نُشر في المدونة (حتى لو كان من سلسلة مختلفة).
عند كتابة أو مراجعة أي مقال جديد:
1. قم بمسح ذهني وبحثي للمواضيع المشابهة التي تم تناولها سابقاً (مثل: التبرير، الفدية، نعمة الله، الخطية).
2. قم بصياغة روابط داخلية (Internal Links) بسلاسة تامة داخل المتن للإحالة إلى المقالات القديمة.
3. الهدف هو خلق "شبكة لاهوتية مترابطة" تجعل القارئ يتنقل بين مواضيع المدونة بسلاسة، مما يثري فهمه الشامل لشخص وعمل المسيح، ويقوي أرشفة المدونة (SEO)."""

new_text = """## 21. الشبكة اللاهوتية المترابطة ونظام الاستدعاء المتقاطع (Internal Thematic Linking)
بما أن المدونة بأكملها تدور حول مركزية يسوع المسيح وإنجيل النعمة، يجب على الكاتب بناء "شبكة لاهوتية مترابطة" بطريقة منهجية لا تعتمد على الذاكرة العشوائية:
1. في مرحلة إعداد الهيكل (Outline) لأي مقال جديد، يُلزم الوكيل بالنظر في "فهرس المفاهيم والروابط" الموجود في أسفل ملف الخطة.
2. يجب استخراج ٣ مفاهيم تتقاطع مع موضوع المقال الجديد وتحديد روابطها (Slugs).
3. يجب على الوكيل أن يوضح للمستخدم في هيكل المقال أين سيقوم بدمج هذه الروابط الثلاثة بشكل عضوي في المتن.
4. الهدف هو إدراج معدل معقول (٣ روابط تقريباً) في كل مقال للإحالة إلى المقالات القديمة بسلاسة تامة، لكي يتنقل القارئ بين مواضيع المدونة."""

content = content.replace(old_text, new_text)

with open(skill_path, "w", encoding="utf-8") as f:
    f.write(content)

plan_path = r"C:\Users\Boaz\Desktop\Penal_Substitution_Plan.md"
index_text = """
---
## فهرس المفاهيم والروابط (Concept Linking Index)
هذا الفهرس يُستخدم لربط المقالات الجديدة بالمقالات السابقة بشكل عضوي (٣ روابط على الأقل في كل مقال):
- **مفهوم الفداء والولي (Go'el):** `/penal-substitution-1-redemption-ot`
- **مفهوم الفدية وسوق العبيد (Lutron):** `/penal-substitution-2-redemption-nt`
- **أغورازو والملكية الإلهية:** `/penal-substitution-3-agorazo`
- **العهد (Covenant) والدم:** `/penal-substitution-4-covenant-blood`
- **لعنة الناموس (غلاطية 3: 13):** `/penal-substitution-5-curse-of-the-law`
- **الدم ومعناه الكفاري:** `/penal-substitution-6-blood`
- **حمل الله:** `/penal-substitution-7-lamb-of-god`
- **حتمية غضب الله:** `/penal-substitution-8-propitiation-1`
- **الهيلاستيريون ونقض نظرية التغطية (دود):** `/penal-substitution-9-propitiation-2`
- **كأس الغضب وجثسيماني:** `/penal-substitution-10-wrath`
- **الاسترضاء، محبة الله، وإلغاء الغضب:** `/penal-substitution-11-propitiation-3`
- **المصالحة والتبادل العظيم (الاحتساب المزدوج):** `/penal-substitution-12-reconciliation-1`
"""

with open(plan_path, "a", encoding="utf-8") as f:
    f.write(index_text)
