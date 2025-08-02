import os
import request
import dotenv

dotenv.load_dotenv()

headers = {"Authorization": os.getenv("MEMORIES_AI_API_KEY")}  # API key  
file_path = os.getenv("VIDEO_FILE_PATH")
# Video file details  
files = {  
    "file": (os.path.basename(file_path), open(file_path, 'rb'), "video/mp4")  
}  

# Optional callback URL for task status notifications  
data = {"callback": "<YOUR_CALLBACK_URI>"} # Optional

response = requests.post(  
    "https://api.memories.ai/serve/api/video/upload",  
    files=files,  
    data=data,  
    headers=headers  
)  

print(response.json())  
 