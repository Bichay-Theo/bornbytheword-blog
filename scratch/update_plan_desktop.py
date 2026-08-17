import os

file_path = r"C:\Users\Boaz\Desktop\Penal_Substitution_Plan.md"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """- `[ ]` **المقال الثالث عشر:** الكفارة البدلية (١٣): المصالحة (٢).. الاتحاد بالمسيح، السلام الموضوعي، والخليقة الجديدة
  - *التفاصيل:* تطبيق المصالحة يتم حصرياً عبر "الاتحاد السري بالمسيح" (كالفن). المصالحة كـ "سلام موضوعي قانوني" في محكمة السماء وليس مجرد شعور (سبرول). استيفاء طاعة المسيح الإيجابية والسلبية للعدل الإلهي للتعامل مع "الذنب اللامحدود" بترضية لا متناهية (جوناثان إدواردز). تناول كل هذا في إطار استرداد حضور الله وتأسيس الخليقة الجديدة (G.K. Beale)."""

replacement1 = """- `[x]` **المقال الثالث عشر:** الكفارة البدلية (١٣): المصالحة (٢).. الاتحاد بالمسيح، السلام الموضوعي، والخليقة الجديدة
  - *التفاصيل:* تم التحديث بناءً على إرشاداتك. تم إبراز أن الاتحاد هو الحقيقة المركزية للخلاص، واستخدام اقتباس إيريناوس بدلاً من أثناسيوس لتجنب الحلولية، ورفض الاتحاد الأسراري. تم التأكيد على السلام الموضوعي (سبرول) واسترداد هيكل عدن (بيل)."""

target2 = """### State Checkpointing (Article 12: Reconciliation 1)
- **Theological State Summary:** 
  - **Conclusions:** Established that Reconciliation (Katallasso) is initiated unilaterally by God, breaking the pagan concept of humans appeasing a reluctant deity. Clarified Double Imputation: Christ absorbed our legal standing as enemies, while we received His perfect righteousness (Active & Passive obedience) entirely forensically, giving us full access to the throne of grace.
  - **Key Verses Analysed:** 2 Cor 5:18-21 (The Great Exchange), Colossians 1:19-22 (Double Enmity and its removal).
  - **Terms Solidified:** Katallasso (المصالحة كتدخل من الله), Double Imputation (الاحتساب المزدوج)."""

replacement2 = """### State Checkpointing (Article 13: Reconciliation 2)
- **Theological State Summary:** 
  - **Conclusions:** Article 12 established Double Imputation; Article 13 answered *how* we receive it: through the "Mystical Union" (Unio Mystica). This union is organic and Spirit-wrought, strictly preserving the Creator-creature distinction (anti-Absorptive Mysticism) and avoiding mere ritualism (anti-Sacramental Union). The result is "Objective Peace" (legal end to cosmic war, independent of feelings) and the ultimate eschatological goal: becoming a "New Creation" to serve as God's restored Edenic temple.
  - **Key Verses Analysed:** 2 Cor 5:17-18 (New Creation), Rom 5:1 (Objective Peace), Eph 1:4.
  - **Terms Solidified:** Unio Mystica (الاتحاد السري بالمسيح), Objective Peace (السلام الموضوعي)."""

target3 = """- **المصالحة والتبادل العظيم (الاحتساب المزدوج):** `/penal-substitution-12-reconciliation-1`"""

replacement3 = """- **المصالحة والتبادل العظيم (الاحتساب المزدوج):** `/penal-substitution-12-reconciliation-1`
- **الاتحاد بالمسيح، السلام الموضوعي، والخليقة الجديدة:** `/penal-substitution-13-reconciliation-2`"""

target4 = """| **أجرة الخطية** | غير مذكور في النص | الموت هو استحقاق الخطية، والذبائح كانت مدرسة لتعليم بشاعة الخطية واستحالة تهاون القداسة الإلهية معها. | 6 |"""

replacement4 = """| **أجرة الخطية** | غير مذكور في النص | الموت هو استحقاق الخطية، والذبائح كانت مدرسة لتعليم بشاعة الخطية واستحالة تهاون القداسة الإلهية معها. | 6 |
| **الاتحاد السري** | Unio Mystica (لاتيني) | الحقيقة المركزية للخلاص؛ اتحادنا العضوي بالمسيح بواسطة الروح القدس بحيث نشترك في بره وآلامه دون أن نذوب في الجوهر الإلهي. | 13 |
| **السلام الموضوعي** | Eirene (يوناني) | حالة صلح قانونية في محكمة السماء تعلن انتهاء حرب الله الكونية ضد المتمردين، ولا تعتمد على تقلبات المشاعر البشرية. | 13 |
| **الخليقة الجديدة** | - | استرداد القصد الأصلي لعدن؛ حيث يصبح المؤمنون مسكناً (هيكلاً) لروح الله في انتظار التمجيد الكامل. | 13 |"""

if target1 in content and target2 in content and target3 in content and target4 in content:
    content = content.replace(target1, replacement1)
    content = content.replace(target2, replacement2)
    content = content.replace(target3, replacement3)
    content = content.replace(target4, replacement4)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Plan file successfully updated.")
else:
    print("Error: Target strings not found in plan file.")
    if target1 not in content: print("Target 1 missing")
    if target2 not in content: print("Target 2 missing")
    if target3 not in content: print("Target 3 missing")
    if target4 not in content: print("Target 4 missing")
