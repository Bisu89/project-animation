"""Thu giọng cho đoạn thử 75 s: lời kể Titan (multilingual_v2) chia đoạn + bản ghi loa Emma."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "..", "scripts"))
import vibi_tts

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio")
os.makedirs(D, exist_ok=True)
TITAN = "dtSEyYGNJqjrtBArPCVZ"
EMMA = "YEENOUza6MPsbkc1De9E"

N = {
    "n1": "The first one reached the doors. The sensor picked it up. The doors slid open.",
    "n2": "Its head snapped toward the speaker. And across the street, one by one... the others turned too. "
          "The store did exactly what it was built to do. It invited them in.",
    "n3": "It got tangled in the carts outside, clear of the door. I ran for the control box behind the service desk. "
          "First switch. The lights flickered.",
    "n4": "Second switch. The checkout rebooted.",
    "n5": "Third switch.",
    "n6": "The motor cut out. The emergency closer pulled the doors shut. I locked it by hand. "
          "Its face pressed against the glass. Four \"Welcomes.\" That's how long it took me to find the right switch.",
}
for k, text in N.items():
    out = os.path.join(D, k + ".mp3")
    if not os.path.exists(out):
        vibi_tts.tts(TITAN, text, out, model="eleven_multilingual_v2", stability=0.35, style=0.4)
out = os.path.join(D, "speaker.mp3")
if not os.path.exists(out):
    vibi_tts.tts(EMMA, "Welcome to Corner Fresh!", out, model="eleven_multilingual_v2", stability=0.6, style=0.3)
print("ok")
