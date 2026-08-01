import json

path = r'C:\Users\Boaz\.gemini\antigravity-ide\brain\bd72cfff-f065-4bd6-9a9b-e70a8b3cb6b8\.system_generated\logs\transcript.jsonl'
out_path = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\parsed_logs.txt'
with open(path, 'r', encoding='utf-8') as f, open(out_path, 'w', encoding='utf-8') as fout:
    for line in f:
        try:
            data = json.loads(line)
            t = data.get('type')
            if t == 'USER_INPUT':
                content = data.get('content', '')
                if '<USER_REQUEST>' in content:
                    req = content.split('<USER_REQUEST>')[1].split('</USER_REQUEST>')[0].strip()
                    fout.write(f"[USER] Step {data.get('step_index')}: {req}\n")
            elif t == 'PLANNER_RESPONSE':
                content = data.get('content', '')
                if content:
                    fout.write(f"[MODEL] Step {data.get('step_index')}: {content[:500]}...\n")
        except Exception as e:
            fout.write(str(e) + '\n')
