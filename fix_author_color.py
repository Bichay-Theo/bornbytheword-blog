import os

pages_dir = r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\pages"

files_to_process = [
    "seeing-and-savoring-jesus.md",
    "god-is-the-gospel.md",
    "come-lord-jesus.md"
]

for filename in files_to_process:
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace var(--secondary) with var(--foreground) in the author line
    # The line is: <p style="font-size: 1.2em; color: var(--secondary); font-weight: bold;">
    content = content.replace('color: var(--secondary);', 'color: var(--foreground);')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Processed {filename}")
