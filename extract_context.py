import json

path = r'C:\Users\Boaz\.gemini\antigravity-ide\brain\bd72cfff-f065-4bd6-9a9b-e70a8b3cb6b8\.system_generated\logs\transcript.jsonl'
out_path = r'C:\Users\Boaz\.gemini\antigravity\scratch\bornbytheword-blog\context_extract.txt'

target_steps = set(range(1509, 1572)) | set(range(2153, 2180)) | set(range(2264, 2270)) | set(range(2406, 2410))

with open(path, 'r', encoding='utf-8') as f, open(out_path, 'w', encoding='utf-8') as fout:
    for line in f:
        try:
            data = json.loads(line)
            step = data.get('step_index')
            if step in target_steps:
                if data.get('type') in ('USER_INPUT', 'PLANNER_RESPONSE'):
                    fout.write(f"[{data.get('source')}] Step {step}:\n")
                    fout.write(data.get('content', '') + "\n")
                    fout.write("="*50 + "\n")
        except Exception:
            pass
