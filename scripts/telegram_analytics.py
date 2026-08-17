import os
import sys
import json
import requests
from dotenv import load_dotenv

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
        
    script_dir = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(script_dir, ".env")
    bot_token = None
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8-sig') as f:
            for line in f:
                if line.startswith("TELEGRAM_BOT_TOKEN="):
                    bot_token = line.strip().split('=', 1)[1]
    
    if not bot_token:
        print("Missing TELEGRAM_BOT_TOKEN")
        return

    polls_log_file = os.path.join(script_dir, "active_polls.json")
    if not os.path.exists(polls_log_file):
        print("No active polls found.")
        return

    with open(polls_log_file, 'r', encoding='utf-8') as f:
        try:
            polls = json.load(f)
        except:
            print("Error reading active_polls.json")
            return

    if not polls:
        print("No active polls to close.")
        return

    report = "# تقرير الاستطلاعات اليومي (Daily Poll Analytics)\n\n"
    report += "تم إغلاق الاستطلاعات التالية وسحب نتائجها النهائية:\n\n"

    for p in polls:
        chat_id = p['chat_id']
        message_id = p['message_id']
        title = p.get('title', 'Unknown Article')

        url = f"https://api.telegram.org/bot{bot_token}/stopPoll"
        r = requests.post(url, json={"chat_id": chat_id, "message_id": message_id})
        if r.status_code == 200:
            poll_data = r.json()['result']
            question = poll_data['question']
            total = poll_data['total_voter_count']
            
            report += f"## مقال: {title}\n"
            report += f"**السؤال:** {question}\n"
            report += f"**إجمالي المصوتين:** {total}\n\n"
            
            for opt in poll_data['options']:
                opt_text = opt['text']
                voter_count = opt['voter_count']
                percentage = 0 if total == 0 else (voter_count / total) * 100
                report += f"- {opt_text}: {voter_count} أصوات ({percentage:.1f}%)\n"
            report += "\n---\n"
        else:
            print(f"Failed to stop poll {message_id}: {r.text}")
            report += f"## مقال: {title}\n فشل في سحب النتائج أو أن الاستطلاع مغلق بالفعل.\n\n---\n"

    # Write report
    report_path = os.path.join(script_dir, "..", "scratch", "daily_poll_report.md")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"Report saved to {report_path}")

    # Clear active polls
    with open(polls_log_file, 'w', encoding='utf-8') as f:
        json.dump([], f)

if __name__ == '__main__':
    main()
