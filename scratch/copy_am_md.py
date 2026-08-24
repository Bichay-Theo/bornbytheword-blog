input_file = r'C:\Users\Boaz\Documents\Africa Translations\the 6 Translation_Blog\01 - Amharic_Translation\المكفارة 01.txt'
output_file = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\posts\penal-substitution-1-ot-redemption.am.md'

with open(input_file, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.strip().split('\n')

# Find the start of the content (skip title and date)
# We know the content actually starts at the first blockquote `> ` or `ይህ ጽሑፍ`
start = 0
for i, l in enumerate(lines):
    if l.startswith('>'):
        start = i
        break

text = '\n'.join(lines[start:])

frontmatter = """---
title: "የቅጣት ምትክነት ስርየት (1)፡ ቤዛነት በብሉይ ኪዳን.. ተቤዢው ማነው?"
date: "2026-07-26T00:00:00Z"
slug: "penal-substitution-1-ot-redemption"
labels: ["الكفارة البدلية"]
---

![የቤዛነት ትርጉም በብሉይ ኪዳን](/images/posts/ot-redemption-am.png)

26 ሐምሌ 2026

"""

with open(output_file, 'w', encoding='utf-8') as out:
    out.write(frontmatter + text.strip() + '\n')
