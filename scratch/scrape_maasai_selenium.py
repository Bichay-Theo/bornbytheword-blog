import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Settings
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

def setup_driver():
    chrome_options = Options()
    # We will NOT use headless mode to reduce chances of getting blocked
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-notifications")
    
    # Optional: If you want it completely hidden, uncomment the line below:
    # chrome_options.add_argument("--headless")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def scrape_bible():
    # Create directory if not exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    driver = setup_driver()
    
    with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
        f.write(f"Maasai Bible (Version {VERSION_ID} - {VERSION_ABBR})\n")
        f.write("=====================================================\n\n")
    
    for book, num_chapters in BOOKS.items():
        for chapter in range(1, num_chapters + 1):
            url = f"https://www.bible.com/bible/{VERSION_ID}/{book}.{chapter}.{VERSION_ABBR}"
            print(f"Scraping: {book} {chapter}...")
            
            try:
                driver.get(url)
                # Wait for the verses to load
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, 'span[class*="ChapterContent_verse__"], span[data-usfm]'))
                )
                
                # Fetch all verse wrappers
                verse_elements = driver.find_elements(By.CSS_SELECTOR, 'span[class*="ChapterContent_verse__"], span[data-usfm]')
                
                chapter_text = []
                current_verse_num = ""
                
                for element in verse_elements:
                    # Get verse number
                    labels = element.find_elements(By.CSS_SELECTOR, 'span[class*="ChapterContent_label__"], span[class*="label_"]')
                    if labels:
                        current_verse_num = labels[0].text.strip()
                    
                    # Get verse content
                    contents = element.find_elements(By.CSS_SELECTOR, 'span[class*="ChapterContent_content__"], span[class*="content_"]')
                    text = " ".join([c.text.strip() for c in contents if c.text.strip()])
                    
                    if text:
                        if current_verse_num:
                            chapter_text.append(f"[{current_verse_num}] {text}")
                            current_verse_num = "" # Reset after printing
                        else:
                            chapter_text.append(text)
                
                # Save chapter to file
                if chapter_text:
                    with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
                        f.write(f"--- {book} {chapter} ---\n")
                        f.write("\n".join(chapter_text))
                        f.write("\n\n")
                
                # Sleep to mimic human behavior and avoid blocking
                time.sleep(2.5)
                
            except Exception as e:
                print(f"Failed on {book} {chapter}: {e}")
                with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
                    f.write(f"\n[ERROR: Failed to retrieve {book} {chapter}]\n\n")
                time.sleep(5) # Longer sleep on error
                
    driver.quit()
    print("\n--- Scraping Complete! ---")

if __name__ == "__main__":
    scrape_bible()
