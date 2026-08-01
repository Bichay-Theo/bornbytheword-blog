import json
transcript_path = r'C:\Users\Boaz\.gemini\antigravity-ide\brain\bd72cfff-f065-4bd6-9a9b-e70a8b3cb6b8\.system_generated\logs\transcript.jsonl'
output_path = r'C:\Users\Boaz\Desktop\search_results.txt'

results = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        content = data.get('content', '')
        
        # Check in content
        if content and ('المقال العاشر' in content or '10 مقالات' in content or 'عشر مقالات' in content or '١٠ مقالات' in content):
            results.append(content)
            
        # Check in tool_calls args
        for tc in data.get('tool_calls', []):
            args = tc.get('args', {})
            for key, val in args.items():
                if isinstance(val, str) and ('المقال العاشر' in val or '10 مقالات' in val or 'عشر مقالات' in val or '١٠ مقالات' in val):
                    results.append(f"IN TOOL CALL {tc.get('name')}: {val}")

with open(output_path, 'w', encoding='utf-8') as out:
    for res in results:
        out.write(res + '\n\n' + '='*80 + '\n\n')
