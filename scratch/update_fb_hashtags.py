import os

fb_file = r"C:\Users\Boaz\Desktop\WB_Blog_Drafts\penal-substitution\FB_Post\Article_13_FB.txt"

hashtags = """
***
#مولودون_بالكلمة #BornByTheWord
#الكفارة_البدلية #PenalSubstitution
#الاتحاد_بالمسيح #UnionWithChrist #المصالحة #Reconciliation
"""

with open(fb_file, 'a', encoding='utf-8') as f:
    f.write(hashtags)
print("Hashtags appended to Article_13_FB.txt")

skill_file = r"C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\.agents\skills\theology_blog_writer\SKILL.md"

with open(skill_file, 'r', encoding='utf-8') as f:
    skill_content = f.read()

target_skill = """(٤) جمع كل الهوامش في أسفل المقال تحت فاصل `***\nالهوامش والمراجع:`."""
replacement_skill = """(٤) جمع كل الهوامش في أسفل المقال تحت فاصل `***\nالهوامش والمراجع:`، (٥) تذييل المنشور بمجموعة من الهاشتاجات (عربي وإنجليزي): هاشتاج ثابت للمدونة `#مولودون_بالكلمة #BornByTheWord`، وهاشتاج ثابت للسلسلة `#الكفارة_البدلية #PenalSubstitution`، وهاشتاج أو اثنين لموضوع المقال (مثل `#المصالحة #Reconciliation`)."""

if target_skill in skill_content:
    skill_content = skill_content.replace(target_skill, replacement_skill)
    with open(skill_file, 'w', encoding='utf-8') as f:
        f.write(skill_content)
    print("SKILL.md updated with Facebook hashtag rules.")
else:
    print("Error updating SKILL.md")
