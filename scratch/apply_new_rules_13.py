import os

file_path = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\wb_penal-substitution-13-reconciliation-2.md"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target1 = "ولكن كيف ينتقل هذا البر إلينا؟ كيف نصبح نحن حقاً طرفاً في هذه المصالحة المجيدة؟"
replacement1 = "ولكن كيف يُحسب هذا البر لنا؟ وكيف نُجعل نحن حقاً شركاء في هذه المصالحة المجيدة؟"

target2 = "لقد مثّلنا المسيح قانونياً على الصليب كآدم الأخير حاملاً لعنتنا في الماضي، ولكن لكي ننال نحن بره ونتمتع بثمار هذه المصالحة في الزمن الحاضر، لا يقف المسيح بعيداً عنا ليعطينا صك المصالحة، بل يوحدنا الروح القدس به حين نؤمن"
replacement2 = "لقد مثّلنا المسيح قانونياً على الصليب كآدم الأخير حاملاً لعنتنا في الماضي، ولكن لكي يُحسب بره لنا ونُوهب التمتع بثمار هذه المصالحة في الزمن الحاضر، لا يقف المسيح بعيداً عنا ليعطينا صك المصالحة، بل نُتحد به بواسطة الروح القدس حين نُوهب الإيمان"

target3 = "الله أعلن تصالحه السيادي، ورفع للإنسان راية السلام المخضبة بدم صليب ابنه."
replacement3 = "الله أعلن تصالحه السيادي، وأسس سلاماً حقيقياً مبنياً على دم صليب ابنه."

target4 = "هذه هي عظمة المصالحة؛ لقد دفعت بنا من قاع عداوتنا اللامحدودة، لترفعنا إلى قمة الاتحاد والشركة التي لا تنفصم في هيكل محبته."
replacement4 = "هذه هي عظمة المصالحة؛ لقد انتشلتنا من حالة العداوة المطلقة، لتضعنا في حالة الاتحاد والشركة الدائمة في محضر الله."

if target1 in content and target2 in content and target3 in content and target4 in content:
    content = content.replace(target1, replacement1)
    content = content.replace(target2, replacement2)
    content = content.replace(target3, replacement3)
    content = content.replace(target4, replacement4)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Article 13 successfully updated with Theological Passive and Translation-Ready Arabic.")
else:
    print("Error: Could not find one or more targets in Article 13.")
    if target1 not in content: print("Missing target 1")
    if target2 not in content: print("Missing target 2")
    if target3 not in content: print("Missing target 3")
    if target4 not in content: print("Missing target 4")
