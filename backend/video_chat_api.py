import requests
import json
import os
import dotenv

dotenv.load_dotenv()

headers = {
    "Authorization": os.getenv("MEMORIES_AI_API_KEY"),
    "Content-Type": "application/json",
    "Accept": "text/event-stream"
}

payload = {
    "video_nos": ["VI606854666187100160"],  # List of video IDs to chat about
    "prompt": "Summarize the emotional moments in these videos",  # User query
    "session_id": "1234567890"  # Chat session ID
}

response = requests.post(
    "https://api.memories.ai/serve/api/video/chat",
    headers=headers,
    data=json.dumps(payload),
    stream=True
)

if response.status_code != 200:
    print(response.status_code)
    print(response.text)
else:
    try:
        for line in response.iter_lines(decode_unicode=True):
            if line:
                if line.strip().lower() == 'data:"done"':
                    break
                if line.startswith("data:"):
                    data = line.replace("data:", "").strip()
                    try:
                        json_data = json.loads(data)
                        if "content" in json_data:
                            print(json_data["content"], end="", flush=True)
                    except json.JSONDecodeError:
                        continue
    except Exception as e:
        print(str(e))