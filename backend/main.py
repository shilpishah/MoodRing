TEST_MODE = True
# VID_MODE = True - will use this to hard-code cases for my video

import random, math, requests, os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, HTMLResponse
from urllib.parse import urlencode
from pydantic import BaseModel
from mistralai import Mistral
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(".env").resolve())  # get all my globals

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
SPOTIFY_SCOPES = "user-read-private user-read-email user-top-read"

print("=== ENV DEBUG START ===")
print("SPOTIFY_CLIENT_ID:", SPOTIFY_CLIENT_ID)
print("SPOTIFY_CLIENT_SECRET:", SPOTIFY_CLIENT_SECRET)
print("SPOTIFY_REDIRECT_URI:", SPOTIFY_REDIRECT_URI)
print("=== ENV DEBUG END ===")

model = "mistral-large-latest"
client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/login")
def login_to_spotify():
    auth_url = "https://accounts.spotify.com/authorize"
    query_params = urlencode({
        "client_id": SPOTIFY_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "scope": SPOTIFY_SCOPES
    })
    return RedirectResponse(f"{auth_url}?{query_params}")

@app.get("/callback")
def spotify_callback(code: str):
    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    res = requests.post(token_url, data=payload, headers=headers)
    token_data = res.json()

    access_token = token_data.get("access_token")
    app.state.spotify_token = access_token
    print("STORED SPOTIFY TOKEN:", access_token)

    return HTMLResponse(
        content="<h2>You have successfully connected to Spotify! You can close this tab now.</h2>",
        status_code=200
    )

HARDCODED_SONGS = {
    "happy": [
        {"title": "Good as Hell", "artist": "Lizzo", "url": "https://open.spotify.com/track/0ONxHHmZ6KtAd7w2p8NlCz"},
        {"title": "Walking on Sunshine", "artist": "Katrina & The Waves", "url": "https://open.spotify.com/track/6GG73zctY4uKY8IErBFPvf"},
        {"title": "Electric Feel", "artist": "MGMT", "url": "https://open.spotify.com/track/2vwlzO0Qp8kfEtzTsCXfyE"}
    ],
    "sad": [
        {"title": "Liability", "artist": "Lorde", "url": "https://open.spotify.com/track/0lx2cLdOt3piJbcaXIV74f"},
        {"title": "Jealous", "artist": "Labrinth", "url": "https://open.spotify.com/track/6z9eQ0eC4CrbB4O3qI1pVb"},
        {"title": "All I Want", "artist": "Kodaline", "url": "https://open.spotify.com/track/0xjNfFw4GzfyoOKzLnS4U3"}
    ],
    "calm": [
        {"title": "Sunset Lover", "artist": "Petit Biscuit", "url": "https://open.spotify.com/track/6gBFPUFcJLzWGx4lenP6h2"},
        {"title": "Weightless", "artist": "Marconi Union", "url": "https://open.spotify.com/track/6uc5jkL7CfpqDNo7n1NxDM"},
        {"title": "Experience", "artist": "Ludovico Einaudi", "url": "https://open.spotify.com/track/7e6j28kDU3fv4ApYky4c1v"}
    ],
    "anger": [
        {"title": "DNA.", "artist": "Kendrick Lamar", "url": "https://open.spotify.com/track/6HZILIRieu8S0iqY8kIKhj"},
        {"title": "Bury a Friend", "artist": "Billie Eilish", "url": "https://open.spotify.com/track/4cG7HUWYHBV6R6tHn1gxrl"},
        {"title": "Ignorance", "artist": "Paramore", "url": "https://open.spotify.com/track/7MDVWN3u6NnJ6r42zZ8LOE"}
    ],
    "overstimulated": [
        {"title": "Intro", "artist": "The xx", "url": "https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY"},
        {"title": "Motion Picture Soundtrack", "artist": "Radiohead", "url": "https://open.spotify.com/track/4MlA6mdRE7pFRxyoL1nbKa"},
        {"title": "Holocene", "artist": "Bon Iver", "url": "https://open.spotify.com/track/1xpGyKyV26uPstk1Elgp9Q"}
    ]
}

def recommend_song(emotion: str):
    return random.choice(HARDCODED_SONGS.get(emotion, HARDCODED_SONGS["calm"]))

class EmotionResponse(BaseModel):
    heart_rate: int
    respiratory_rate: int
    emotion: str
    probabilities: dict

def simulate_apple_health_data():
    if TEST_MODE:
        hr = random.randint(55, 120)
        rr = random.randint(8, 35)
    else:
        hour = datetime.now().hour
        hr = 70 + 10 * math.sin((math.pi / 12) * hour - math.pi / 2) + random.uniform(-3, 3)
        rr = 14 + 2 * math.sin((math.pi / 12) * hour - math.pi / 2) + random.uniform(-1, 1)
    return {
        "heart_rate": int(hr),
        "respiratory_rate": int(rr)
    }

def classify_emotion_probabilistic(hr: int, rr: int) -> tuple[str, dict]:
    scores = {
        "calm": 0,
        "sad": 0,
        "happy": 0,
        "fear": 0,
        "anger": 0,
        "surprise": 0,
        "disgust": 0,
        "stress": 0,
        "overstimulated": 0
    }

    if hr <= 68:
        scores["calm"] += 2
        scores["sad"] += 1
    elif 69 <= hr <= 75:
        scores["happy"] += 1
        scores["disgust"] += 1
    elif 76 <= hr <= 85:
        scores["happy"] += 2
        scores["stress"] += 1
    elif 86 <= hr <= 95:
        scores["stress"] += 2
        scores["overstimulated"] += 1
    elif hr > 95:
        scores["fear"] += 2
        scores["anger"] += 1

    if rr <= 10:
        scores["calm"] += 2
        scores["overstimulated"] += 1
    elif 11 <= rr <= 14:
        scores["sad"] += 1
        scores["disgust"] += 1
    elif 15 <= rr <= 18:
        scores["happy"] += 2
        scores["stress"] += 1
    elif 19 <= rr <= 25:
        scores["stress"] += 2
        scores["fear"] += 1
    elif rr > 25:
        scores["fear"] += 2
        scores["anger"] += 2

    total_score = sum(scores.values())
    probabilities = {
        emotion: round(score / total_score, 3)
        for emotion, score in scores.items()
        if score > 0
    }

    detected = max(probabilities.items(), key=lambda x: x[1])[0]
    return detected, probabilities

@app.get("/api/emotion", response_model=EmotionResponse)
def detect_emotion():
    data = simulate_apple_health_data()
    emotion, probabilities = classify_emotion_probabilistic(
        data["heart_rate"], data["respiratory_rate"]
    )
    return {
        "heart_rate": data["heart_rate"],
        "respiratory_rate": data["respiratory_rate"],
        "emotion": emotion,
        "probabilities": probabilities
    }

class PhraseRequest(BaseModel):
    emotion: str
    age_group: str
    time_of_day: str

@app.post("/api/phrase")
async def get_phrase(req: PhraseRequest):
    prompt = (
        f"Generate a supportive phrase for someone feeling {req.emotion}. "
        f"Make it sound like something a close friend would text. "
        f"Include natural punctuation like apostrophes and exclamation marks."
        f"Keep it under 7 words. Avoid quotes and clichés. No capital letters."
    )

    try:
        res = client.chat.complete(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=30,
            temperature=0.9
        )

        content = None
        if res and hasattr(res, "choices") and res.choices and hasattr(res.choices[0], "message") and hasattr(res.choices[0].message, "content"):
            content_chunks = res.choices[0].message.content
            content = "".join(str(chunk) for chunk in content_chunks) if isinstance(content_chunks, list) else content_chunks

        song_data = recommend_song(req.emotion)

        return {
            "phrase": content.replace("\n", " ") if content else "you're doing your best!",
            "song": song_data
        }

    except Exception as e:
        print("OpenRouter or song fetch error:", e)
        return {
            "phrase": "you're doing your best!",
            "song": None
        }
