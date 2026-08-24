import os
import shutil

skill_dir = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\.agents\skills\theology_blog_writer"
skill_file = os.path.join(skill_dir, "SKILL.md")
backup_file = os.path.join(skill_dir, "SKILL.md.bak")

# 1. Create Backup
shutil.copy2(skill_file, backup_file)
print(f"Backup created at: {backup_file}")

# 2. Prepare the new manifesto section
manifesto = """
## Section 6: The Anti-Algorithmic Manifesto (المانيفستو المضاد للخوارزميات والقوالب)
لتحرير الأسلوب من التناسخ الآلي وجعله انعكاساً حياً للحق المُعلن، يُمنع الوقوع في فخ "الكتابة الخوارزمية"، ويجب الالتزام بهذه المنهجية العضوية:
1. **إسقاط "المدخل النفعي" (Utilitarian Hook):** يُمنع التودد للقارئ عبر ملامسة احتياجاته اليومية أو النفسية. ابدأ بإعلان مجد الله، سيادته، أو طبيعته كما يعلنها النص. الحقيقة المطلقة لا تحتاج إلى تسويق بشري ليصبح مهماً.
2. **الاعتماد على "جهالة الكرازة" (The Foolishness of Preaching):** ادخل مباشرة في التصريح بالحق الكتابي بوضوح وصدمة أحياناً. لا تخفف وطأة الحقائق العميقة بقوالب لغوية ناعمة. الإقناع يتم بقوة جوهر النص، لا ببراعة الديباجات المنطقية.
3. **الهيكل العضوي المنبثق من النص (Organic Structure):** يُمنع استخدام قالب جاهز أو هيكل ثابت (كثلاث نقاط وخاتمة) لكل المقالات. دع البناء الداخلي يتشكل بحسب تضاريس النص (صدام جذري، تصاعد، إلخ). الهيكل المعماري يخدم لاهوت النص، لا العكس.
4. **بتر "حشوات الربط" الجاهزة (Amputate Filler Words):** يُمنع تماماً استخدام عبارات الربط الفارغة التي لا تضيف معنى (مثل: ومما لا شك فيه، ومن الجدير بالذكر، وفي نهاية المطاف). استخدم لغة إنجيلية رصينة وكثيفة؛ كل جملة يجب أن تحمل ثقلاً لاهوتياً. إذا أمكن حذف الكلمة دون تأثر المعنى اللاهوتي، احذفها فوراً.
السر: "التمثيل الغذائي" للنص.. اهضم الأفكار وتشرّبها، لتتدفق الصياغة بشكل أصيل يعكس الحقائق الصافية دون استعارة هياكل مستنسخة.
"""

# 3. Append to SKILL.md
with open(skill_file, 'a', encoding='utf-8') as f:
    f.write(manifesto)

print("SKILL.md updated with The Anti-Algorithmic Manifesto.")
