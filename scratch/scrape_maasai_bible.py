import requests
from bs4 import BeautifulSoup
import time
import os

# YouVersion Version ID for Maasai (BIBLIAPRO - Biblia Sinyati 2018)
VERSION_ID = "3064" 
VERSION_ABBR = "BIBLIAPRO"

# List of Bible Books
BOOKS = [
    ("GEN", "Genesis", 50), ("EXO", "Exodus", 40), ("LEV", "Leviticus", 27), ("NUM", "Numbers", 36),
    ("DEU", "Deuteronomy", 34), ("JOS", "Joshua", 24), ("JDG", "Judges", 21), ("RUT", "Ruth", 4),
    ("1SA", "1 Samuel", 31), ("2SA", "2 Samuel", 24), ("1KI", "1 Kings", 22), ("2KI", "2 Kings", 25),
    ("1CH", "1 Chronicles", 29), ("2CH", "2 Chronicles", 36), ("EZR", "Ezra", 10), ("NEH", "Nehemiah", 13),
    ("EST", "Esther", 10), ("JOB", "Job", 42), ("PSA", "Psalms", 150), ("PRO", "Proverbs", 31),
    ("ECC", "Ecclesiastes", 12), ("SNG", "Song of Solomon", 8), ("ISA", "Isaiah", 66), ("JER", "Jeremiah", 52),
    ("LAM", "Lamentations", 5), ("EZK", "Ezekiel", 48), ("DAN", "Daniel", 12), ("HOS", "Hosea", 14),
    ("JOL", "Joel", 3), ("AMO", "Amos", 9), ("OBA", "Obadiah", 1), ("JON", "Jonah", 4),
    ("MIC", "Micah", 7), ("NAM", "Nahum", 3), ("HAB", "Habakkuk", 3), ("ZEP", "Zephaniah", 3),
    ("HAG", "Haggai", 2), ("ZEC", "Zechariah", 14), ("MAL", "Malachi", 4),
    ("MAT", "Matthew", 28), ("MRK", "Mark", 16), ("LUK", "Luke", 24), ("JHN", "John", 21),
    ("ACT", "Acts", 28), ("ROM", "Romans", 16), ("1CO", "1 Corinthians", 16), ("2CO", "2 Corinthians", 13),
    ("GAL", "Galatians", 6), ("EPH", "Ephesians", 6), ("PHP", "Philippians", 4), ("COL", "Colossians", 4),
    ("1TH", "1 Thessalonians", 5), ("2TH", "2 Thessalonians", 3), ("1TI", "1 Timothy", 6), ("2TI", "2 Timothy", 4),
    ("TIT", "Titus", 3), ("PHM", "Philemon", 1), ("HEB", "Hebrews", 13), ("JAS", "James", 5),
    ("1PE", "1 Peter", 5), ("2PE", "2 Peter", 3), ("1JN", "1 John", 5), ("2JN", "2 John", 1),
    ("3JN", "3 John", 1), ("JUD", "Jude", 1), ("REV", "Revelation", 22)
]

# Write to the Documents folder if running directly on your machine
OUTPUT_FILE = r"C:\Users\Boaz\Documents\Africa Translation\Maa\Maasai_Bible_Full.txt"

def scrape_chapter(book_abbr, chapter):
    url = f"https://www.bible.com/bible/{VERSION_ID}/{book_abbr}.{chapter}.{VERSION_ABBR}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return None
        
        soup = BeautifulSoup(response.content, 'html.parser')
        verses_data = []
        
        # YouVersion places verse text in elements with class matching 'usfm' or 'verse'
        spans = soup.find_all('span', class_=lambda c: c and ('label' in c.lower() or 'content' in c.lower()))
        
        current_v = ""
        current_text = ""
        for span in spans:
            cls = span.get('class', [])
            cls_str = " ".join(cls).lower()
            
            if 'label' in cls_str:
                if current_v and current_text:
                    verses_data.append(f"[{current_v}] {current_text.strip()}")
                current_v = span.get_text(strip=True)
                current_text = ""
            elif 'content' in cls_str:
                current_text += span.get_text(strip=True) + " "
                
        if current_v and current_text:
            verses_data.append(f"[{current_v}] {current_text.strip()}")
            
        return verses_data
    except Exception as e:
        print(f"Error scraping {book_abbr} {chapter}: {e}")
        return None

def main():
    print(f"Starting Maasai Bible Scraper. Output will be saved to: {OUTPUT_FILE}")
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("========================================================================\n")
        f.write("KĂTAB ŠĂDDIJĂN - MAASAI BIBLE (BIBLIA SINYATI - 2018 REVISED EDITION)\n")
        f.write("========================================================================\n\n\n")

        for book_index, (book_abbr, book_name, total_chapters) in enumerate(BOOKS, start=1):
            print(f"Processing {book_name} ({book_abbr})...")
            
            f.write("########################################################################\n")
            f.write(f"### BOOK: {book_index:02d}_{book_abbr}_{book_name}.txt\n")
            f.write("########################################################################\n\n")
            f.write(f"{book_name} ({book_abbr})\n")
            f.write("========================================\n\n")

            for chapter in range(1, total_chapters + 1):
                f.write("========================================\n")
                f.write(f"Chapter {chapter}\n")
                f.write("========================================\n\n\n")
                
                verses = scrape_chapter(book_abbr, chapter)
                if verses is None:
                    f.write(f"[Error: Could not retrieve text for Chapter {chapter}]\n\n")
                else:
                    for v in verses:
                        f.write(f"{v}\n")
                
                f.write("\n")
                time.sleep(1) # Sleep to avoid rate limiting

    print("Finished successfully!")

if __name__ == "__main__":
    main()
