import os
import re

pages_dir = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\pages"

files_to_process = [
    "seeing-and-savoring-jesus.md",
    "god-is-the-gospel.md",
    "come-lord-jesus.md"
]

intro_replacements = {
    "seeing-and-savoring-jesus.md": (
        '<div id="title-page"><div class="title-page"><h1 class="book-title">رؤية يسوع المسيح والتمتع به</h1>\n<div class="chapter-divider"><span>✥</span></div>\n<div class="author-name">بقلم</div><div class="author-name" style="font-weight: bold;">القس جون بايبر<br><span style="font-size: 0.8em; font-weight: normal;">Pastor John Piper</span></div>\n\n<div class="chapter-divider"><span>✥</span></div>\n</div></div>',
        '<div id="intro"><div style="text-align: center; margin: 4rem 0;"><h1 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 2.5em;">رؤية يسوع المسيح والتمتع به</h1><p style="font-size: 1.2em; color: var(--secondary-color); font-weight: bold;">بقلم القس جون بايبر <span style="font-size: 0.8em; font-family: monospace;">Pastor John Piper</span></p></div></div>'
    ),
    "god-is-the-gospel.md": (
        '<div id="title-page"><div class="title-page"><h1 class="book-title">اللهُ هُوَ الْإِنْجِيلُ</h1>\n<div class="chapter-divider"><span>✥</span></div>\n<div class="author-name">بقلم</div><div class="author-name" style="font-weight: bold;">القس جون بايبر<br><span style="font-size: 0.8em; font-weight: normal;">Pastor John Piper</span></div>\n<div class="chapter-divider"><span>✥</span></div>\n</div></div>',
        '<div id="intro"><div style="text-align: center; margin: 4rem 0;"><h1 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 2.5em;">اللهُ هُوَ الْإِنْجِيلُ</h1><p style="font-size: 1.2em; color: var(--secondary-color); font-weight: bold;">بقلم القس جون بايبر <span style="font-size: 0.8em; font-family: monospace;">Pastor John Piper</span></p></div></div>'
    ),
    "come-lord-jesus.md": (
        '<div id="intro"><div style="text-align: center; margin: 4rem 0;"><h1 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 2.5em;">تعال أيها الرب يسوع</h1><p style="font-size: 1.2em; color: var(--secondary-color); font-weight: bold;">بقلم<br><span style="font-size: 1.5em; color: white;">القس جون بايبر</span><br><span style="font-size: 0.8em; font-family: monospace;">Pastor John Piper</span></p></div></div>',
        '<div id="intro"><div style="text-align: center; margin: 4rem 0;"><h1 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 2.5em;">تعال أيها الرب يسوع</h1><p style="font-size: 1.2em; color: var(--secondary-color); font-weight: bold;">بقلم القس جون بايبر <span style="font-size: 0.8em; font-family: monospace;">Pastor John Piper</span></p></div></div>'
    )
}

toc_old = '<ul style="list-style: none; padding: 0;">'
toc_new = '<ul style="list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">'

back_to_toc = '<p style="text-align: center; margin-bottom: 2rem; font-weight: bold;"><a href="#toc" style="text-decoration: none; color: var(--primary-color);">عودة إلى الفهرس ⬆️</a></p>\n'
back_to_toc_no_newline = '<p style="text-align: center; margin-bottom: 2rem; font-weight: bold;"><a href="#toc" style="text-decoration: none; color: var(--primary-color);">عودة إلى الفهرس ⬆️</a></p>'

for filename in files_to_process:
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply intro replacement
    old_intro, new_intro = intro_replacements[filename]
    content = content.replace(old_intro, new_intro)

    # Apply TOC replacement
    content = content.replace(toc_old, toc_new)

    # Remove all "عودة إلى الفهرس ⬆️" blocks
    content = content.replace(back_to_toc, "")
    content = content.replace(back_to_toc_no_newline, "")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Processed {filename}")
