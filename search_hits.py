import json

path = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\parsed_logs.txt'
out_path = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\hits.txt'

keywords = ['اسلوب', 'أسلوب', 'كفار', 'فدي', 'فداء', 'بدلي']

with open(path, 'r', encoding='utf-8') as f, open(out_path, 'w', encoding='utf-8') as fout:
    lines = f.readlines()
    for i, line in enumerate(lines):
        for k in keywords:
            if k in line:
                fout.write(line)
                break
