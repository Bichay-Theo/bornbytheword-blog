import re
import os

files = [
    r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\pages\seeing-and-savoring-jesus.md",
    r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\pages\god-is-the-gospel.md",
    r"c:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\content\pages\come-lord-jesus.md"
]

def arabic_num(n):
    return str(n).translate(str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩'))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract TOC list
    toc_match = re.search(r'(<div id="toc".*?>.*?<ul.*?>)(.*?)(</ul>\s*</div>)', content, re.DOTALL)
    if not toc_match:
        print(f"TOC not found in {os.path.basename(file)}")
        continue
        
    ul_start = toc_match.group(1)
    li_content = toc_match.group(2)
    ul_end = toc_match.group(3)
    
    # Remove grid formatting
    ul_start = re.sub(r'display:\s*grid;\s*grid-template-columns:\s*1fr 1fr;', '', ul_start)
    
    new_lis = []
    
    # Find all list items and corresponding chapters
    lis = re.findall(r'<li.*?>.*?<a href="#(.*?)".*?>(.*?)</a>.*?</li>', li_content, re.DOTALL)
    
    ch_num = 1
    for id_val, original_text in lis:
        if "ch" in id_val and id_val != "intro" and id_val != "conc" and id_val != "dg":
            # Extract chapter title based on file
            if "come-lord" in file:
                # Look for <div id="ch1"> ... ## title
                chapter_block_match = re.search(f'<div id="{id_val}".*?>(.*?)(?:<div id="ch|<div class="chapter-divider"|$)', content, re.DOTALL)
                title = "الفصل"
                if chapter_block_match:
                    title_match = re.search(r'##\s*(.*?)\s*\n', chapter_block_match.group(1))
                    if title_match:
                        title = title_match.group(1).strip()
                        # Clean up formatting like bold
                        title = re.sub(r'\*\*(.*?)\*\*', r'\1', title)
                        # The numbering is provided by us
                        new_text = f"{arabic_num(ch_num)}. {title}"
                        ch_num += 1
                    else:
                        new_text = original_text # fallback
                else:
                    new_text = original_text
            else:
                # Look for <div id="ch1"> ... <h3>title</h3>
                chapter_block_match = re.search(f'<div id="{id_val}".*?>(.*?)(?:<div id="ch|<div class="chapter-divider"|$)', content, re.DOTALL)
                title = "الفصل"
                if chapter_block_match:
                    title_match = re.search(r'<h3>(.*?)</h3>', chapter_block_match.group(1))
                    if title_match:
                        title = title_match.group(1).strip()
                        title = re.sub(r'<sup.*?>.*?</sup>', '', title).strip() # clean footnotes
                        new_text = f"{arabic_num(ch_num)}. {title}"
                        ch_num += 1
                    else:
                        new_text = original_text # fallback
                else:
                    new_text = original_text
        elif id_val == "intro":
            # get intro title
            chapter_block_match = re.search(f'<div id="{id_val}".*?>(.*?)(?:<div id="ch|<div class="chapter-divider"|$)', content, re.DOTALL)
            if chapter_block_match:
                title_match = re.search(r'<h2.*?>(.*?)</h2>', chapter_block_match.group(1))
                if title_match:
                    title = title_match.group(1).strip()
                    title = re.sub(r':.*', '', title) # Take part before colon
                    new_text = title
                else:
                    new_text = original_text
            else:
                new_text = original_text
        else:
            new_text = original_text
            
        new_li = f'  <li style="margin-bottom: 0.8rem;"><a href="#{id_val}" style="font-weight: bold; font-size: 1.1rem; text-decoration: none; color: var(--text-color);">{new_text}</a></li>'
        new_lis.append(new_li)
        
    new_li_content = "\n".join(new_lis)
    new_toc = ul_start + "\n" + new_li_content + "\n" + ul_end
    
    new_content = content[:toc_match.start()] + new_toc + content[toc_match.end():]
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Successfully updated {os.path.basename(file)}")

