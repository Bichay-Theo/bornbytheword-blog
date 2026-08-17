import os
import sys
import yaml
import markdown
import requests
import argparse
import json
from dotenv import load_dotenv
from telegraph import Telegraph

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
        
    parser = argparse.ArgumentParser(description="Publish a markdown post to Telegraph and Telegram.")
    parser.add_argument("filepath", help="Path to the markdown file")
    parser.add_argument("--hook", help="Path to a text file containing the Telegram hook message. Use {url} as placeholder for the Telegraph link.")
    parser.add_argument("--poll", help="Path to a JSON file containing the poll data (keys: question, options, is_anonymous)")
    parser.add_argument("--lang", default="ar", help="The language code (ar, am, sw, shi, kab, tmh, mas). Defaults to ar.")
    args = parser.parse_args()

    filepath = args.filepath
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    # Load Env from local scripts/.env
    script_dir = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(script_dir, ".env")
    bot_token = None
    chat_id = None
    # Determine the target chat ID variable based on language
    lang_code = args.lang.upper()
    chat_id_var = "TELEGRAM_CHAT_ID" if lang_code == "AR" else f"TELEGRAM_CHAT_ID_{lang_code}"
    
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8-sig') as f:
            for line in f:
                if line.startswith("TELEGRAM_BOT_TOKEN="):
                    bot_token = line.strip().split('=', 1)[1]
                elif line.startswith(f"{chat_id_var}="):
                    chat_id = line.strip().split('=', 1)[1]
    
    if not bot_token or not chat_id:
        print(f"Missing TELEGRAM_BOT_TOKEN or {chat_id_var} in .env")
        return

    # Read Markdown
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    title = "Born by the Word Article"
    author_name = "Born by the Word"
    body_md = content
    
    # Parse YAML frontmatter if exists
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1])
                title = frontmatter.get('title', title)
                body_md = parts[2].strip()
            except Exception as e:
                print(f"Error parsing frontmatter: {e}")

    # Fix Relative Links and Images
    import re
    base_url = "https://bichay-theo.github.io/bornbytheword-blog"
    def make_absolute(match):
        url = match.group(1)
        if url.startswith('http://') or url.startswith('https://') or url.startswith('mailto:'):
            return f"]({url})"
        if url.startswith('/'):
            return f"]({base_url}{url})"
        else:
            return f"]({base_url}/{url})"
            
    body_md = re.sub(r'\]\((.*?)\)', make_absolute, body_md)

    # Convert Markdown to HTML
    html_content = markdown.markdown(body_md, extensions=['extra', 'nl2br'])
    
    # Telegraph only allows h3 and h4 tags
    html_content = html_content.replace('<h1>', '<h3>').replace('</h1>', '</h3>')
    html_content = html_content.replace('<h2>', '<h3>').replace('</h2>', '</h3>')
    html_content = html_content.replace('<h5>', '<h4>').replace('</h5>', '</h4>')
    html_content = html_content.replace('<h6>', '<h4>').replace('</h6>', '</h4>')
    
    # Initialize Telegraph
    telegraph = Telegraph()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    telegraph_token_file = os.path.join(script_dir, "telegraph_token.txt")
    
    if os.path.exists(telegraph_token_file):
        with open(telegraph_token_file, 'r') as f:
            t_token = f.read().strip()
            telegraph = Telegraph(access_token=t_token)
    else:
        response = telegraph.create_account(short_name="bornbytheword", author_name=author_name)
        with open(telegraph_token_file, 'w') as f:
            f.write(response['access_token'])
        telegraph = Telegraph(access_token=response['access_token'])

    print(f"Publishing '{title}' to Telegraph...")
    
    try:
        response = telegraph.create_page(
            title,
            html_content=html_content,
            author_name=author_name,
            author_url="https://bichay-theo.github.io/bornbytheword-blog/"
        )
        telegraph_url = response['url']
        print(f"Telegraph URL created: {telegraph_url}")
    except Exception as e:
        print(f"Error creating Telegraph page: {e}")
        return

    # Localization for Telegram posts
    LOCALIZATION = {
        "ar": {
            "new_article": "مقال جديد:",
            "read_article": "لقراءة المقال:",
            "poll_question": "كيف تقيم هذا المقال؟",
            "poll_options": ["ممتاز", "مفيد جداً", "قرأته للنهاية"]
        },
        "sw": {
            "new_article": "Makala Mpya:",
            "read_article": "Kusoma makala haya:",
            "poll_question": "Unawezaje kutathmini makala haya?",
            "poll_options": ["Bora sana", "Yanafaa sana", "Nimeyasoma hadi mwisho"]
        },
        "am": {
            "new_article": "አዲስ ጽሑፍ:",
            "read_article": "ጽሑፉን ለማንበብ:",
            "poll_question": "ይህን ጽሑፍ እንዴት ይገመግሙታል?",
            "poll_options": ["በጣም ጥሩ", "በጣም ጠቃሚ", "እስከ መጨረሻው አነበብኩት"]
        },
        "kab": {
            "new_article": "Amagrad amaynut:",
            "read_article": "Iwakken ad teɣreḍ amagrad:",
            "poll_question": "Amek ara tqeyymeḍ amagrad-a?",
            "poll_options": ["Igerrez nezzeh", "Yenfɛa aṭas", "Ɣriɣ-t ar tagara"]
        },
        "shi": {
            "new_article": "Amgrad amaynu:",
            "read_article": "Afad ad taɣrt amgrad:",
            "poll_question": "Manik s tqymt amgrad ad?",
            "poll_options": ["Ifulki bahra", "Isfaw bahra", "Ɣriɣ-t ar tagari"]
        },
        "tmh": {
            "new_article": "Amagrad amaynu:",
            "read_article": "Făl ad taɣrăd amagrad:",
            "poll_question": "Măk tăqăyyămăd amagrad wa?",
            "poll_options": ["Igarraz", "Yănfa aṭṭas", "Ɣrăɣ-t ar tăgara"]
        },
        "mas": {
            "new_article": "Oros ng'ejuk:",
            "read_article": "Peisoma ena oros:",
            "poll_question": "Kaji nipirta ena oros?",
            "poll_options": ["Sidai naleng", "Enyor naleng", "Aisoma amu edukuya"]
        },
        "default": {
            "new_article": "New Article:",
            "read_article": "Read the article:",
            "poll_question": "How do you rate this article?",
            "poll_options": ["Excellent", "Very useful", "I read it to the end"]
        }
    }
    
    loc = LOCALIZATION.get(args.lang.lower(), LOCALIZATION["default"])

    # Prepare Hook
    hook_text = f"{loc['new_article']}\n\n<b>{title}</b>\n\n{loc['read_article']}\n{telegraph_url}"
    if args.hook and os.path.exists(args.hook):
        with open(args.hook, 'r', encoding='utf-8') as f:
            hook_text = f.read().replace("{url}", telegraph_url)

    # Extract first image
    img_match = re.search(r'!\[.*?\]\((.*?)\)', body_md)
    photo_path = None
    if img_match:
        img_url = img_match.group(1)
        if img_url.startswith(base_url):
            local_rel = img_url[len(base_url):]
            if local_rel.startswith("/"):
                local_rel = local_rel[1:]
            potential_path = os.path.join(os.path.dirname(script_dir), "public", local_rel.replace('/', os.sep))
            if os.path.exists(potential_path):
                photo_path = potential_path

    # Send Message
    print("\nSending to Telegram channel...")
    if photo_path:
        print(f"Uploading image: {photo_path}")
        send_url = f"https://api.telegram.org/bot{bot_token}/sendPhoto"
        payload = {
            "chat_id": chat_id,
            "caption": hook_text,
            "parse_mode": "HTML"
        }
        with open(photo_path, 'rb') as photo_file:
            r = requests.post(send_url, data=payload, files={"photo": photo_file})
    else:
        send_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": hook_text,
            "parse_mode": "HTML"
        }
        r = requests.post(send_url, json=payload)

    if r.status_code == 200:
        print("Message sent successfully!")
    else:
        print(f"Error sending message: {r.text}")

    # Prepare and Send Poll
    poll_data = {
        "question": loc["poll_question"],
        "options": loc["poll_options"],
        "is_anonymous": True
    }
    if args.poll and os.path.exists(args.poll):
        with open(args.poll, 'r', encoding='utf-8') as f:
            poll_data = json.load(f)
            
    print("\nSending Poll...")
    send_poll_url = f"https://api.telegram.org/bot{bot_token}/sendPoll"
    poll_payload = {
        "chat_id": chat_id,
        "question": poll_data["question"],
        "options": poll_data["options"],
        "is_anonymous": poll_data.get("is_anonymous", True)
    }
    r = requests.post(send_poll_url, json=poll_payload)
    if r.status_code == 200:
        print("Poll sent successfully!")
        res = r.json()
        if 'result' in res and 'message_id' in res['result']:
            poll_message_id = res['result']['message_id']
            polls_log_file = os.path.join(script_dir, "active_polls.json")
            logs = []
            if os.path.exists(polls_log_file):
                with open(polls_log_file, 'r', encoding='utf-8') as pf:
                    try:
                        logs = json.load(pf)
                    except:
                        pass
            logs.append({"chat_id": chat_id, "message_id": poll_message_id, "title": title})
            with open(polls_log_file, 'w', encoding='utf-8') as pf:
                json.dump(logs, pf, ensure_ascii=False, indent=2)
    else:
        print(f"Error sending poll: {r.text}")

if __name__ == '__main__':
    main()
