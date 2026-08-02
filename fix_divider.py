import os

# 1. Remove the first chapter divider from come-lord-jesus.md
come_lord_jesus = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\pages\come-lord-jesus.md"
with open(come_lord_jesus, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# The divider is on line 9 (index 8), let's check
if '<div class="chapter-divider"><span>✥</span></div>\n' in lines[:15]:
    lines.remove('<div class="chapter-divider"><span>✥</span></div>\n')
    with open(come_lord_jesus, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Removed first chapter-divider from come-lord-jesus.md")

# 2. Update globals.css
globals_css = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\src\app\globals.css"
with open(globals_css, 'r', encoding='utf-8') as f:
    css_content = f.read()

old_css = """.chapter-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  opacity: 0.8;
}
.chapter-divider::before,
.chapter-divider::after {
  content: '';
  flex-grow: 1;
  max-width: 200px;
  height: 2px;
  background-color: var(--secondary);
}
.chapter-divider::before {
  margin-left: 1.5rem;
}
.chapter-divider::after {
  margin-right: 1.5rem;
}
.chapter-divider span {
  font-size: 2rem;
  color: var(--accent-color);
}"""

new_css = """.chapter-divider {
  height: 1px;
  background-color: var(--secondary);
  border: none;
  margin: 3rem auto;
  max-width: 400px;
  opacity: 0.8;
}
.chapter-divider::before,
.chapter-divider::after,
.chapter-divider span {
  display: none;
}"""

if old_css in css_content:
    css_content = css_content.replace(old_css, new_css)
    with open(globals_css, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print("Updated globals.css")
else:
    print("Could not find the exact old_css in globals.css")
