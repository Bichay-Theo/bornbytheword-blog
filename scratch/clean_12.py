import os

file_path = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\wb_penal-substitution-12-reconciliation.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    "~الحدث~": "الحدث",
    '~(راجع "كتاب الله هو الإنجيل" https://bichay-theo.github.io/bornbytheword-blog/p/god-is-the-gospel~': '(راجع مقال: [الله هو الإنجيل](https://bichay-theo.github.io/bornbytheword-blog/p/god-is-the-gospel))',
    "~الكثير~": "الكثير",
    "~اخرى~": "أخرى",
    "لفهم ~~ هذه النقلة،": "لفهم هذه النقلة،",
    "~**دبرت منذ الأزل**~": "**دبرت منذ الأزل**",
    "~نعود للنص في ٢ كُورِنْثُوس ٥: ١٨ «وَلكِنَّ الْكُلَّ مِنَ اللهِ، الَّذِي **صَالَحَنَا لِنَفْسِهِ بِيَسُوعَ الْمَسِيحِ**»~ .": "نعود للنص في ٢ كُورِنْثُوس ٥: ١٨ «وَلكِنَّ الْكُلَّ مِنَ اللهِ، الَّذِي **صَالَحَنَا لِنَفْسِهِ بِيَسُوعَ الْمَسِيحِ**».",
    "~حاجز الآثام~": "حاجز الآثام",
    "الأبعاد القضائية ~~ لهذا التبادل": "الأبعاد القضائية لهذا التبادل",
    "البر المسكوب~Infused~)": "البر المسكوب Infused)",
    "~-للآب وللناموس-~": "-للآب وللناموس-",
    "~تناقض~": "تناقض"
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
    else:
        print(f"Warning: Could not find '{old}'")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done cleaning up Article 12.")
