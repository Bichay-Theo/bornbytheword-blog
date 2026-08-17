import os
import glob
import shutil

base_dir = r'C:\Users\Boaz\Documents\Africa Translations'

langs = {
    '01 Amharic': {
        'translation_folder': r'the 6 Translation_Blog\01 - Amharic_Translation',
        'bible_file': r'Bible translations_Africa\Amharic\Amharic_Bible_Full.md',
        'glossary_files': [r'Glossaries_NotbookLM_final\amharic-reformed-glossary-v3.json', r'Glossaries_NotbookLM_final\amharic-reformed-glossary-v3.md'],
        'mindmap_file': r'MindMaps\amharic_glossary_mindmap.html'
    },
    '02 Swahili': {
        'translation_folder': r'the 6 Translation_Blog\02 - Swahili_Translation',
        'bible_file': r'Bible translations_Africa\Swahili\Swahili_Bible_Full.md',
        'glossary_files': [r'Glossaries_NotbookLM_final\swahili-reformed-glossary-v5.json', r'Glossaries_NotbookLM_final\swahili-reformed-glossary-v5.md'],
        'mindmap_file': r'MindMaps\swahili_glossary_mindmap.html'
    },
    '03 Maasai': {
        'translation_folder': r'the 6 Translation_Blog\03 - Masaya_Translation',
        'bible_file': r'Bible translations_Africa\Maa\Maasai_Bible_Full.md',
        'glossary_files': [r'Glossaries_NotbookLM_final\reformed-maa-theology-dictionary-v4.json', r'Glossaries_NotbookLM_final\reformed-maa-theology-dictionary-v4.md'],
        'mindmap_file': r'MindMaps\maa_glossary_mindmap.html'
    },
    '04 Tamasheq': {
        'translation_folder': r'the 6 Translation_Blog\04 - Tamasheq_Translation',
        'bible_file': r'Bible translations_Africa\Tamasheq\Tamasheq_New_Testament_Full.md', # Or Tamasheq_Bible_Full.md
        'glossary_files': [r'Glossaries_NotbookLM_final\tamasheq-reformed-glossary-v3.json', r'Glossaries_NotbookLM_final\tamasheq-reformed-glossary-v3.md'],
        'mindmap_file': r'MindMaps\tamasheq_glossary_mindmap.html'
    },
    '05 Taqbaylit': {
        'translation_folder': r'the 6 Translation_Blog\05 - Taqbaylit_Translation',
        'bible_file': r'Bible translations_Africa\Taqbaylit\Taqbaylit_New_Testament_Full.md',
        'glossary_files': [r'Glossaries_NotbookLM_final\kabyle-reformed-theology-glossary-v7.json', r'Glossaries_NotbookLM_final\kabyle-reformed-theology-glossary-v7.md'],
        'mindmap_file': r'MindMaps\taqbaylit_glossary_mindmap.html'
    },
    '06 Tashelhit': {
        'translation_folder': r'the 6 Translation_Blog\06 - Tashelhit_Translation',
        'bible_file': r'Bible translations_Africa\Tashelhit\Tashelhit_Bible_Full.md',
        'glossary_files': [r'Glossaries_NotbookLM_final\Tashelhit_Reformed_Theological_Glossary_v3.json', r'Glossaries_NotbookLM_final\Tashelhit_Reformed_Theological_Glossary_v3.xlsx'],
        'mindmap_file': r'MindMaps\tashelhit_glossary_mindmap.html'
    }
}

for lang_prefix, mapping in langs.items():
    lang_dir = os.path.join(base_dir, lang_prefix)
    os.makedirs(lang_dir, exist_ok=True)
    
    # 1. Move translations and infographics
    trans_dir = os.path.join(base_dir, mapping['translation_folder'])
    if os.path.exists(trans_dir):
        for file in os.listdir(trans_dir):
            src_file = os.path.join(trans_dir, file)
            if not os.path.isfile(src_file): continue
            
            ext = os.path.splitext(file)[1].lower()
            if ext == '.txt':
                dst_file = os.path.join(lang_dir, f"{lang_prefix} - Translation 1{ext}")
            elif ext in ['.jpg', '.jpeg', '.png', '.webp', '.pdf']:
                dst_file = os.path.join(lang_dir, f"{lang_prefix} - Infographic 1{ext}")
            else:
                dst_file = os.path.join(lang_dir, f"{lang_prefix} - {file}")
                
            shutil.copy2(src_file, dst_file)
            
    # 2. Move Bible
    bible_src = os.path.join(base_dir, mapping['bible_file'])
    if not os.path.exists(bible_src) and 'Tamasheq_New_Testament' in bible_src:
        bible_src = bible_src.replace('Tamasheq_New_Testament_Full', 'Tamasheq_Bible_Full')
        
    if os.path.exists(bible_src):
        dst_file = os.path.join(lang_dir, f"{lang_prefix} - Bible_Full.md")
        shutil.copy2(bible_src, dst_file)
        
    # 3. Move Glossary
    for glos in mapping['glossary_files']:
        glos_src = os.path.join(base_dir, glos)
        if os.path.exists(glos_src):
            ext = os.path.splitext(glos)[1].lower()
            dst_file = os.path.join(lang_dir, f"{lang_prefix} - Glossary{ext}")
            shutil.copy2(glos_src, dst_file)
            
    # 4. Move MindMap
    mm_src = os.path.join(base_dir, mapping['mindmap_file'])
    if os.path.exists(mm_src):
        dst_file = os.path.join(lang_dir, f"{lang_prefix} - MindMap.html")
        shutil.copy2(mm_src, dst_file)
        
print("Organization complete!")
