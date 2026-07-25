import os
import shutil
import sys

base_dir = r"C:\Users\Boaz\Documents"
sources_dir = os.path.join(base_dir, "Sources")
logos_dir = os.path.join(base_dir, "Logos_Files Download")
target_dir = os.path.join(base_dir, "Theology_WB")

def safe_move(src, dst):
    if not os.path.exists(src):
        print(f"[SKIP] Source not found: {src}")
        return
        
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    
    if os.path.exists(dst):
        if os.path.isdir(src):
            # Merge directory contents
            for item in os.listdir(src):
                s = os.path.join(src, item)
                d = os.path.join(dst, item)
                safe_move(s, d)
            # Remove empty source dir after merging
            try:
                os.rmdir(src)
                print(f"[CLEANUP] Removed merged dir: {src}")
            except OSError:
                pass
        else:
            # File exists. Delete the source (duplicate)
            print(f"[DEDUPLICATE] Target exists ({dst}). Deleting duplicate source ({src}).")
            try:
                os.remove(src)
            except Exception as e:
                print(f"[ERROR] Failed to delete duplicate: {e}")
    else:
        try:
            shutil.move(src, dst)
            print(f"[MOVE] {src} -> {dst}")
        except Exception as e:
            print(f"[ERROR] Move failed: {e}")

moves = [
    # 01_Theologians_and_Sermons
    (os.path.join(sources_dir, "Carson"), os.path.join(target_dir, "01_Theologians_and_Sermons", "D_A_Carson")),
    (os.path.join(sources_dir, "Piper"), os.path.join(target_dir, "01_Theologians_and_Sermons", "John_Piper")),
    (os.path.join(sources_dir, "G K Beal"), os.path.join(target_dir, "01_Theologians_and_Sermons", "G_K_Beale")),
    
    # 02_Biblical_Exegesis
    (os.path.join(sources_dir, "Romans"), os.path.join(target_dir, "02_Biblical_Exegesis", "Romans")),
    
    # 03_Bible_Translations_and_Data
    (os.path.join(logos_dir, "Ketab_El_Hayat_NAV"), os.path.join(target_dir, "03_Bible_Translations", "Ketab_El_Hayat_NAV")),
    (os.path.join(logos_dir, "SVD"), os.path.join(target_dir, "03_Bible_Translations", "Smith_Van_Dyck_SVD", "Scripts_and_Text")),
    (os.path.join(logos_dir, "SVD_PDFs"), os.path.join(target_dir, "03_Bible_Translations", "Smith_Van_Dyck_SVD", "PDFs")),
    (os.path.join(logos_dir, "SVD_PDFs_Corrected"), os.path.join(target_dir, "03_Bible_Translations", "Smith_Van_Dyck_SVD", "PDFs_Corrected")),
    (os.path.join(logos_dir, "LUKE_Arabic Bible (Smith & Van Dyke).txt"), os.path.join(target_dir, "03_Bible_Translations", "Smith_Van_Dyck_SVD", "Luke_Text", "LUKE_Arabic_Bible_SVD.txt")),
    
    # 04_Theology_and_Books
    (os.path.join(sources_dir, "Apostolic_Preaching_Morris"), os.path.join(target_dir, "04_Theology_and_Books", "Apostolic_Preaching_Morris")),
    (os.path.join(sources_dir, "Christianity In Crisis PDF.pdf"), os.path.join(target_dir, "04_Theology_and_Books", "Christianity_In_Crisis.pdf")),
    (os.path.join(logos_dir, "Ante-Nicene Fathers 3_ Latin Christianity_ Its Founder, Tertullian_The Apology.html"), os.path.join(target_dir, "04_Theology_and_Books", "Tertullian_The_Apology", "The_Apology.html")),
    (os.path.join(logos_dir, "Ante-Nicene Fathers 3_ Latin Christianity_ Its Founder, Tertullian_The Apology_cleaned.txt"), os.path.join(target_dir, "04_Theology_and_Books", "Tertullian_The_Apology", "The_Apology_cleaned.txt")),
    (os.path.join(logos_dir, "Ante-Nicene Fathers 3_ Latin Christianity_ Its Founder, Tertullian_Yje Apology.txt"), os.path.join(target_dir, "04_Theology_and_Books", "Tertullian_The_Apology", "The_Apology_raw.txt")),
    
    # 05_Preaching_and_Illustrations
    (os.path.join(sources_dir, "300 Illustrations for Preachers"), os.path.join(target_dir, "05_Preaching_and_Illustrations", "300_Illustrations")),
    
    # 06_Glossaries_and_References
    (os.path.join(sources_dir, "Gemini Master Glossary - Terminology (Theological Glossary).csv"), os.path.join(target_dir, "06_Glossaries_and_References", "Gemini_Master_Glossary.csv")),
    (os.path.join(sources_dir, "الفهرس _ غسان خلف.pdf"), os.path.join(target_dir, "06_Glossaries_and_References", "Ghassan_Khalaf_Index.pdf")),
    
    # 07_Personal_Research
    (os.path.join(sources_dir, "Researchs"), os.path.join(target_dir, "07_Personal_Research")),
    
    # 08_Archive
    (os.path.join(sources_dir, ".zip"), os.path.join(target_dir, "08_Archive", "sources_archive.zip")),
    (os.path.join(logos_dir, "convert_logos_html.py"), os.path.join(target_dir, "08_Archive", "convert_logos_html.py"))
]

for src, dst in moves:
    safe_move(src, dst)

print("Migration complete.")
