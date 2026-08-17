import os

file_path = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\wb_penal-substitution-12-reconciliation.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = "~يا له من تنازلٍ من إله المجد في نعمته ومحبته أن يرسل سفراء الإنجيل ليدعوا العصاة للمصالحة.~"
replacement = "يا له من تنازلٍ من إله المجد في نعمته ومحبته أن يرسل سفراء الإنجيل ليدعوا العصاة للمصالحة."

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed sentence.")
else:
    print("Target not found.")
