# stickman-video

A [Claude Code](https://claude.com/claude-code) skill that turns a **prompt, a script, subtitles
(.srt) or a YouTube video** into an animated stick-figure explainer rendered with
[Remotion](https://www.remotion.dev): snappy cartoon action, titles that slam and fall, impact
effects, chapter cards, original synthesized sound effects and music, and **voiceover sync**.

*Italiano più sotto.*

## What it does

1. **Finds Remotion** on your machine, or installs it in the folder you choose (or asks where it is).
2. **Builds a timeline** of narration lines from your prompt/script/SRT, with a speaking-rate check.
3. **Storyboards and animates** the video with a bundled engine: posable stick figures with
   keyframes, smears, run/walk cycles; physical text; bursts, dust, camera shake; props.
4. **Generates sound**: ~28 effects and chapter-aware background music, synthesized from
   scratch (no samples, no licensing issues), placed on the exact frames of the action.
5. **Renders and checks** the result (duration, audio levels, hits).
6. **Syncs to your recorded voice**: a recorded narration never matches the planned timing.
   The skill transcribes your recording with word timestamps, aligns it to the script and
   re-times every scene to your actual pace; the music ducks under your voice.

## Install

```bash
# personal skill (all projects)
git clone https://github.com/<you>/stickman-video ~/.claude/skills/stickman-video
# or project skill
git clone https://github.com/<you>/stickman-video .claude/skills/stickman-video
```

Requirements: Node.js LTS (for Remotion), Python 3 with `numpy scipy` (audio), optionally
`pillow` (contact sheets), `faster-whisper` (voice sync), `youtube-transcript-api` (YouTube input),
and ffmpeg (MP3 encoding; WAV is used if missing).

```bash
pip install -r requirements.txt
```

## Use

Just ask Claude, for example:

- "Make a 2-minute animated explainer about how compound interest works, stickman style."
- "Turn this script into an animated video, I'll record the voiceover later: script.md"
- "Here are the subtitles of my narration, animate them: narration.srt"
- "Make a stickman action animation based on this video: https://youtu.be/…"
- "I recorded the voice (voice.wav): sync the video to it."

## Layout

```
SKILL.md                 workflow Claude follows
references/              engine API, animation style + scene recipes, pitfalls
assets/engine/           animation engine (copied into the project as src/stickman/)
assets/template/         per-video template (Video.tsx, timeline anchoring, SFX cues, example scene)
assets/stickman-sheet.mjs contact sheets (render a few frames to check layout)
scripts/
  find_remotion.py       locate Remotion projects
  setup_project.py       scaffold/prepare a project, copy the engine
  new_video.py           create a video folder and register the composition
  parse_input.py         SRT/script/text -> timeline.ts + voiceover.srt
  fetch_transcript.py    YouTube subtitles -> SRT (source material)
  gen_audio.py           synthesized SFX + music
  check_render.py        verify a rendered video
  transcribe_voice.py    recorded voice -> SRT
  align_voice.py         re-time the timeline to a recorded voice
```

---

## Italiano

Skill per Claude Code che crea video animati con omini stilizzati, partendo da un **prompt**, un
**copione**, dei **sottotitoli (.srt)** o un **video YouTube**, usando Remotion. Il video ha:
- azione cartoon scattante, titoli che cadono e sbattono, impatti, cartelli dei capitoli;
- effetti sonori e musica originali, generati per sintesi;
- **sincronizzazione con il voiceover**.

Il flusso:
- cerca Remotion sul computer, oppure lo installa nella cartella che scegli (o ti chiede dove si trova);
- prepara il copione e i sottotitoli da registrare (`voiceover.srt`) con un ritmo di lettura naturale;
- anima, aggiunge suoni e musica, renderizza e controlla il risultato.

Quando registri la voce, i tempi non coincidono mai con quelli pianificati, perché ognuno legge alla
propria velocità. La skill trascrive la registrazione parola per parola, la allinea al copione e
riadatta ogni scena al tuo ritmo reale; la musica si abbassa da sola mentre parli.

Installazione: clona la repo in `~/.claude/skills/stickman-video` e installa le dipendenze Python
con `pip install -r requirements.txt` (serve anche Node.js per Remotion).

## License

MIT (see LICENSE). Remotion has its own license: free for individuals and small companies,
a company license is required for larger organisations. See https://www.remotion.dev/license.
