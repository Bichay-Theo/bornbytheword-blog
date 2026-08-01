import json

path = r'C:\Users\Boaz\.gemini\antigravity-ide\brain\bd72cfff-f065-4bd6-9a9b-e70a8b3cb6b8\.system_generated\logs\transcript.jsonl'
out_path = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\user_prompts.txt'

with open(path, 'r', encoding='utf-8') as f, open(out_path, 'w', encoding='utf-8') as fout:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content', '')
                if '<USER_REQUEST>' in content:
                    req = content.split('<USER_REQUEST>')[1].split('</USER_REQUEST>')[0].strip()
                    fout.write(f"Step {data.get('step_index')}:\n{req}\n")
                    fout.write("-" * 40 + "\n")
        except Exception as e:
            pass
