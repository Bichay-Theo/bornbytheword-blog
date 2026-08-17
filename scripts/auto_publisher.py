import os
import sys
import json
import subprocess
import time

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    queue_file = os.path.join(script_dir, "publishing_queue.json")
    
    # 1. Run Analytics to close previous day's poll
    print("Running daily analytics to close previous polls...")
    analytics_script = os.path.join(script_dir, "telegram_analytics.py")
    subprocess.run(["python", analytics_script], env=os.environ.copy())
    
    # Give it a second
    time.sleep(2)
    
    # 2. Check Queue
    if not os.path.exists(queue_file):
        print("Queue file not found.")
        return
        
    with open(queue_file, 'r', encoding='utf-8') as f:
        try:
            queue = json.load(f)
        except:
            print("Error reading queue file.")
            return
            
    if not queue:
        print("Queue is empty. Nothing to publish.")
        return
        
    # 3. Pop the first item
    item = queue.pop(0)
    markdown_file = os.path.join(script_dir, "..", "content", "posts", item['file'])
    
    if not os.path.exists(markdown_file):
        print(f"Markdown file not found: {markdown_file}")
        return
        
    # 4. Write temporary hook and poll
    scratch_dir = os.path.join(script_dir, "..", "scratch")
    os.makedirs(scratch_dir, exist_ok=True)
    
    hook_path = os.path.join(scratch_dir, "temp_hook.txt")
    poll_path = os.path.join(scratch_dir, "temp_poll.json")
    
    with open(hook_path, 'w', encoding='utf-8') as f:
        f.write(item['hook'])
        
    with open(poll_path, 'w', encoding='utf-8') as f:
        json.dump(item['poll'], f, ensure_ascii=False)
        
    # 5. Run Publisher
    print(f"Publishing next article: {item['title']}...")
    publisher_script = os.path.join(script_dir, "telegram_publisher.py")
    
    result = subprocess.run([
        "python", publisher_script,
        markdown_file,
        "--hook", hook_path,
        "--poll", poll_path
    ], env=os.environ.copy())
    
    # 6. Save modified queue back if successful
    if result.returncode == 0:
        with open(queue_file, 'w', encoding='utf-8') as f:
            json.dump(queue, f, ensure_ascii=False, indent=2)
        print("Article published successfully and removed from queue.")
    else:
        print("Publisher failed. Item kept in queue.")

if __name__ == "__main__":
    main()
