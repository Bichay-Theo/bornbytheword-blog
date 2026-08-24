input_file = r'C:\Users\Boaz\Documents\Africa Translations\the 6 Translation_Blog\06 - Tashelhit_Translation\الكفارة 01.md'
output_file = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\posts\penal-substitution-1-ot-redemption.shi.md'

with open(input_file, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.strip().split('\n')

start = 0
for i, l in enumerate(lines):
    if l.startswith('>'):
        start = i
        break

text = '\n'.join(lines[start:])

frontmatter = """---
title: "Asfel n Ufdu ɣ wemkan-nneɣ (1): Afdu ɣ Urkawal Aqdim.. Ma igan Awali?"
date: "2026-07-26T00:00:00Z"
slug: "penal-substitution-1-ot-redemption"
labels: ["الكفارة البدلية"]
---

![Awali: Lmeɛna n Usfel n Ufdu](/images/posts/ot-redemption-shi.png)

26 yulyu 2026

"""

with open(output_file, 'w', encoding='utf-8') as out:
    out.write(frontmatter + text.strip() + '\n')
