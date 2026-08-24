import os

skill_file = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\.agents\skills\theology_blog_writer\SKILL.md"

with open(skill_file, 'r', encoding='utf-8') as f:
    skill_content = f.read()

target_skill = """9. **No AI Filler**: Avoid a preachy tone. Focus on academic exegesis. Do not use AI-style filler phrases like "الإجابة القاطعة هي" أو "المفاجأة الخطيرة"."""

replacement_skill = """9. **No AI Journalistic Clichés (منع الحشو الصحفي المبتذل)**: حافظ على النبرة الرعوية الحارة والإلحاح العبادي (بأسلوب بايبر)، ولكن يُمنع تماماً استخدام العبارات الانتقالية المبتذلة أو حشوات الذكاء الاصطناعي الصحفية الرخيصة لافتعال الإثارة (مثل: "والمفاجأة الخطيرة هنا"، "الإجابة القاطعة هي"، "في الختام نستنتج"). لا تستبدل العمق اللاهوتي بالعاطفة المفتعلة، بل دع الرهبة والعاطفة تنبعان عضوياً من ثقل وعظمة العقيدة نفسها."""

if target_skill in skill_content:
    skill_content = skill_content.replace(target_skill, replacement_skill)
    with open(skill_file, 'w', encoding='utf-8') as f:
        f.write(skill_content)
    print("SKILL.md rule 9 updated successfully.")
else:
    print("Error updating SKILL.md rule 9")
