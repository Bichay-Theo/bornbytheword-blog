import os
import requests
from bs4 import BeautifulSoup
import time
import concurrent.futures

VERSION_ID = "3064"
VERSION_ABBR = "BIBLIAPRO"
OUTPUT_FILE = r"C:\Users\Boaz\Documents\Africa Translations\Bible translations_Africa\Maa\Maasai_Bible_Full.txt"

BOOKS = {
    "GEN": 50, "EXO": 40, "LEV": 27, "NUM": 36, "DEU": 34, "JOS": 24, "JDG": 21, "RUT": 4, 
    "1SA": 31, "2SA": 24, "1KI": 22, "2KI": 25, "1CH": 29, "2CH": 36, "EZR": 10, "NEH": 13, 
    "EST": 10, "JOB": 42, "PSA": 150, "PRO": 31, "ECC": 12, "SNG": 8, "ISA": 66, "JER": 52, 
    "LAM": 5, "EZK": 48, "DAN": 12, "HOS": 14, "JOL": 3, "AMO": 9, "OBA": 1, "JON": 4, 
    "MIC": 7, "NAM": 3, "HAB": 3, "ZEP": 3, "HAG": 2, "ZEC": 14, "MAL": 4,
    "MAT": 28, "MRK": 16, "LUK": 24, "JHN": 21, "ACT": 28, "ROM": 16, "1CO": 16, "2CO": 13, 
    "GAL": 6, "EPH": 6, "PHP": 4, "COL": 4, "1TH": 5, "2TH": 3, "1TI": 6, "2TI": 4, "TIT": 3, 
    "PHM": 1, "HEB": 13, "JAS": 5, "1PE": 5, "2PE": 3, "1JN": 5, "2JN": 1, "3JN": 1, "JUD": 1, "REV": 22
}

def fetch_chapter(book, chapter, session):
    url = f"https://www.bible.com/bible/{VERSION_ID}/{book}.{chapter}.{VERSION_ABBR}"
    for _ in range(3): # retries
        try:
            r = session.get(url, timeout=10)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                verse_elements = soup.find_all('span', class_=lambda c: c and 'verse' in c.lower() and 'ChapterContent' in c)
                
                chapter_text = []
                current_verse_num = ""
                
                for element in verse_elements:
                    # check if this is just a label wrapper
                    labels = element.find_all('span', class_=lambda c: c and 'label' in c.lower())
                    if labels:
                        current_verse_num = labels[0].text.strip()
                    
                    contents = element.find_all('span', class_=lambda c: c and 'content' in c.lower())
                    text = " ".join([c.text.strip() for c in contents if c.text.strip()])
                    
                    if text:
                        if current_verse_num:
                            chapter_text.append(f"[{current_verse_num}] {text}")
                            current_verse_num = ""
                        else:
                            chapter_text.append(text)
                
                return book, chapter, chapter_text
        except Exception:
            time.sleep(1)
    return book, chapter, None

def scrape_bible():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(f"Maasai Bible (Version {VERSION_ID} - {VERSION_ABBR})\n")
        f.write("=====================================================\n\n")
        
    session = requests.Session()
    session.headers.update({'User-Agent': 'Mozilla/5.0'})
    
    tasks = []
    for book, num_chapters in BOOKS.items():
        for chapter in range(1, num_chapters + 1):
            tasks.append((book, chapter))
            
    print(f"Total chapters to fetch: {len(tasks)}")
    
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_chapter, b, c, session): (b, c) for b, c in tasks}
        count = 0
        for future in concurrent.futures.as_completed(futures):
            b, c = futures[future]
            try:
                res = future.result()
                results.append(res)
                count += 1
                if count % 100 == 0:
                    print(f"Progress: {count}/{len(tasks)}")
            except Exception as e:
                print(f"Error on {b} {c}: {e}")
                
    # Sort results by original order
    results_dict = {(b, c): text for b, c, text in results}
    
    with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
        for b, c in tasks:
            text_lines = results_dict.get((b, c))
            if text_lines:
                f.write(f"--- {b} {c} ---\n")
                f.write("\n".join(text_lines))
                f.write("\n\n")
            else:
                f.write(f"[ERROR: Failed to retrieve {b} {c}]\n\n")
                
    print("Done!")

if __name__ == "__main__":
    scrape_bible()
