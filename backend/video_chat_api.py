import requests
import json

headers = {
    "Authorization": "<API_KEY>",
    "Content-Type": "application/json",
    "Accept": "text/event-stream"
}

payload = {
    "video_nos": ["video_001", "video_002"],  # List of video IDs to chat about
    "prompt": "Summarize the emotional moments in these videos",  # User query
    "session_id": "<session_id>"  # Chat session ID
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
                print(line)
                if line.strip().lower() == 'data:"done"':
                    print("\n")
                    break
                if line.startswith("data:"):
                    print(line.replace("data:", "").strip(), end="", flush=True)
    except Exception as e:
        print(str(e))