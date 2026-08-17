import os

file_path = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\.agents\skills\theology_blog_writer\SKILL.md"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """4. **آباء الكنيسة:** إدراج اقتباسات للآباء الشرقيين (أثناسيوس، ذهبي الفم، كيرلس السكندري) في صلب الموضوع لبيان أصالة الفكر. **الحد الأقصى زمنياً هو كيرلس السكندري. يُحظر تماماً الاستشهاد بأغسطينوس.**"""

replacement1 = """4. **آباء الكنيسة (Forensic Fencing):** إدراج اقتباسات للآباء الشرقيين (أثناسيوس، ذهبي الفم، كيرلس السكندري) في صلب الموضوع لبيان أصالة الفكر. **الحد الأقصى زمنياً هو كيرلس السكندري. يُحظر تماماً الاستشهاد بأغسطينوس.** عند الاقتباس بخصوص "الاتحاد" أو "التبني"، يُلزم وضع "تسوير لاهوتي قضائي" فوري (Forensic Fencing) لمنع القارئ من الانزلاق لهرطقة "التأله/الامتزاج الكياني" (Theosis/Ontological Blending) التي طبعت بيئة هؤلاء الآباء."""

target2 = """8. **The Text is the Argument (النص هو الحجة)**: لا تلقِ بأسماء اللاهوتيين المعاصرين في المتن وكأنها السلطة المعصومة. ضعها في الهوامش كمراجع، ودع كلمة الله (وحدها) تكون هي صاحبة الكلمة الفصل."""

replacement2 = """8. **The Text is the Argument (النص هو الحجة وقواعد النقد النصي):** لا تلقِ بأسماء اللاهوتيين المعاصرين في المتن وكأنها السلطة المعصومة. ضعها في الهوامش كمراجع، ودع كلمة الله (وحدها) تكون هي صاحبة الكلمة الفصل. اعتمد دائماً على النقد النصي (NA28/UBS5) كحارس للاهوت؛ فالتدقيق في الصيغ النحوية (مثل صيغة الخبر مقابل الأمر في رومية ٥: ١) هو السلاح لنسف محاولات تحويل الحقائق الموضوعية المُنجزة إلى مجرد مطالبات أخلاقية."""

target3 = """9. **Methodology and Cognitive Purity**: Analyze the text faithfully, stripping away pragmatic or utilitarian impurities. Present pure truths that build up the reader. Do not dilute theology to prioritize human comfort over God's glory."""

replacement3 = """9. **Methodology and Cognitive Purity**: Analyze the text faithfully, stripping away pragmatic or utilitarian impurities. Present pure truths that build up the reader. Do not dilute theology to prioritize human comfort over God's glory.
10. **Ordo Salutis & Transitional Glue (التدفق العضوي وأطوار الخلاص):** التمييز القاطع بين "الاتحاد العهدي" (ما تم موضوعياً على الصليب في الماضي) و"الاتحاد الحيوي/السري" (ما يتم تطبيقياً بالروح القدس في الحاضر) هو صمام الأمان للكفارة. لا تخلط بينهما أبداً. كما يجب استخدام "اللحام اللاهوتي" (Transitional Glue) لربط الأقسام عضوياً؛ لا تنتقل من حقيقة موضوعية قضائية (كالمصالحة) إلى نتيجة إسخاتولوجية أو ذاتية (كالخليقة الجديدة) دون إظهار أن الأولى هي "المصفوفة" (Matrix) التي تُفرز الثانية حتمياً، وذلك لمنع تسلل الأنثروبومركزية."""

if target1 in content and target2 in content and target3 in content:
    content = content.replace(target1, replacement1)
    content = content.replace(target2, replacement2)
    content = content.replace(target3, replacement3)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SKILL.md updated successfully with the new theological guards.")
else:
    print("Error: Could not find all targets in SKILL.md.")
    if target1 not in content: print("Missing target 1")
    if target2 not in content: print("Missing target 2")
    if target3 not in content: print("Missing target 3")
