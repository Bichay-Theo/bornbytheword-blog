import re
import os

file_path = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\pages\come-lord-jesus.md"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove `# ` that appears right after the chapter number and dot in the TOC links
# Example: >٢. # مَحَبَّةُ -> >٢. مَحَبَّةُ

def replace_hash(match):
    return match.group(1) + match.group(2)

# This regex matches the > number . [optional space] # [optional space]
new_content = re.sub(r'(>[٠-٩]+. )# (.*?</a>)', replace_hash, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Fixed hashes")
