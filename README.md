# stickman-video

**Animated stick-figure explainer videos from a prompt, a script, subtitles or a YouTube video.**
A [Claude Code](https://claude.com/claude-code) skill built on [Remotion](https://www.remotion.dev).

Repository: https://github.com/nispa/stickman-video · License: MIT · © 2026 nispa

*[Versione italiana più sotto](#italiano)*

---

## Features

- **Any input**: a topic ("explain compound interest"), a script, an `.srt` file, or a YouTube link
  (the transcript is downloaded and condensed into a script of the length you want).
- **Cartoon action engine**: posable stick figures with keyframes, smear trails, run/walk cycles and
  accessories; titles that fall, slam and get punched; impact bursts, dust, camera shake; props
  (money, gold, barrels, shields, banks, flags…); chapter cards, numbered cards, stamps, speech bubbles.
- **Original audio**: about 30 sound effects and chapter-aware background music, synthesized from
  scratch (no samples, no licensing issues), placed on the exact frames of the action.
- **Voiceover workflow**: it writes the narration to record (`voiceover.srt`) at a natural pace, then
  **re-times the whole animation to your recording**. Your pace never matches the plan exactly, so the
  skill transcribes the recording word by word, aligns it to the script and moves every scene to match.
  The music ducks under your voice.
- **Remotion setup handled**: it finds an existing Remotion project on your machine, or installs one
  in the folder you choose (it asks first).
- **Checks before you watch**: contact sheets to catch layout problems, and an automatic check of the
  render (duration vs timeline, audio peaks, clipping, hits).
- 16:9 and 9:16 formats, optional burned-in captions.

## Requirements

- [Claude Code](https://claude.com/claude-code)
- [Node.js](https://nodejs.org) LTS (Remotion runs on it)
- Python 3.9+ with `numpy`, `scipy`, `pillow`
- Optional: `faster-whisper` (voiceover sync), `youtube-transcript-api` (YouTube input),
  [ffmpeg](https://ffmpeg.org) (MP3 music; WAV is used without it)

## Installation

Install it as a personal skill (available in every project):

```bash
git clone https://github.com/nispa/stickman-video ~/.claude/skills/stickman-video
pip install -r ~/.claude/skills/stickman-video/requirements.txt
```

or as a project skill (only in one repository):

```bash
git clone https://github.com/nispa/stickman-video .claude/skills/stickman-video
pip install -r .claude/skills/stickman-video/requirements.txt
```

On Windows `~` is your user folder (`C:\Users\<you>`). Restart Claude Code after installing.

## Usage

Just ask Claude Code. Examples:

- *"Make a 2-minute animated explainer about how compound interest works, with stick figures."*
- *"Turn this script into an animated video, I'll record the voiceover later: script.md"*
- *"Here are the subtitles of my narration, animate them: narration.srt"*
- *"Make a stickman animation that summarises this video in 3 minutes: https://youtu.be/…"*
- *"I recorded the voice (voice.wav): sync the video to it."*

### What happens

1. **Brief**: Claude asks only what it can't infer (voiceover or not, format, length).
2. **Remotion**: it finds your install or sets one up where you say.
3. **Timeline**: the script/SRT becomes a frame-accurate timeline, plus `voiceover.srt` to record.
4. **Storyboard**: one row per scene: visual metaphor, characters, on-screen text, beats, sounds.
5. **Animation**: scenes are written with the bundled engine, anchored to the narration lines.
6. **Visual check**: contact sheets of each scene, fixes for overlaps and layout.
7. **Audio**: synthesized sound effects and music.
8. **Render**: `out/<video>.mp4`, with an automatic check of duration and audio.
9. **Voiceover sync** (when you've recorded it): alignment, re-timing, re-render with your voice.

### Recording the voiceover

Record from `src/<video>/voiceover.srt`: it has the lines and an indicative timing. Read at your own
pace, and pause briefly where a chapter starts. Put the file in `public/<video>/voice.wav` and ask
Claude to sync it. Volumes (music, effects), voice and captions are composition properties you can
also change in Remotion Studio (`npm run dev`).

## Repository layout

```
SKILL.md                    the workflow Claude follows
references/
  engine-api.md             the animation engine on one page
  animation-style.md        principles, visual metaphors, scene recipes, sound design
  pitfalls.md               known problems and how to avoid them
assets/
  engine/                   animation engine (copied into the project as src/stickman/)
  template/                 per-video template: composition, cue anchoring, SFX cues, example scene
  stickman-sheet.mjs        contact sheets (render a few frames to check the layout)
scripts/
  find_remotion.py          locate Remotion projects on the machine
  setup_project.py          scaffold or prepare a Remotion project, copy the engine
  new_video.py              create a video folder and register its composition
  parse_input.py            SRT / script / text -> timeline.ts + voiceover.srt
  fetch_transcript.py       YouTube subtitles -> SRT (source material)
  gen_audio.py              synthesized sound effects and music
  check_render.py           verify a rendered video
  transcribe_voice.py       recorded voice -> SRT
  align_voice.py            re-time the timeline to a recorded voice
```

The scripts also work on their own; run any of them with `--help`.

## Notes

- **Remotion license**: Remotion is free for individuals and small companies; larger organisations
  need a company license. See https://www.remotion.dev/license.
- **Content**: when a video summarises someone else's work, credit the source (the skill adds it to
  the end titles). Real people are shown only as labelled generic figures, and violence stays cartoonish.
- **Audio**: everything the skill generates is original. If you add your own music, make sure you
  have the rights.

## Contributing

Issues and pull requests are welcome at https://github.com/nispa/stickman-video.
New props, poses, scene recipes and music styles are especially useful.

---

## Italiano

**Video animati con omini stilizzati a partire da un prompt, un copione, dei sottotitoli o un video
YouTube.** Una skill per [Claude Code](https://claude.com/claude-code) basata su
[Remotion](https://www.remotion.dev).

### Cosa fa

- **Qualsiasi input**: un argomento, un copione, un file `.srt` o un link YouTube. Dal link scarica la
  trascrizione e la riassume nella durata che vuoi.
- **Animazione cartoon**: omini in posa con keyframe, scie di movimento, corsa e camminata; titoli che
  cadono, sbattono e vengono presi a pugni; esplosioni, polvere, scosse di camera; oggetti di scena,
  cartelli dei capitoli, schede numerate, timbri, fumetti.
- **Audio originale**: circa 30 effetti sonori e una musica che cambia con i capitoli, generati per
  sintesi (niente campioni, niente problemi di diritti) e sincronizzati con le azioni.
- **Voiceover**: scrive il testo da registrare (`voiceover.srt`) con un ritmo di lettura naturale. Quando
  registri, i tempi non coincidono mai con quelli pianificati: la skill trascrive la registrazione
  parola per parola, la allinea al copione e sposta ogni scena sul tuo ritmo reale. La musica si
  abbassa da sola mentre parli.
- **Remotion**: lo trova sul computer, oppure lo installa nella cartella che scegli (prima chiede).
- **Controlli**: fogli di fotogrammi per scovare sovrapposizioni prima del render, e verifica
  automatica del video finito (durata, livelli audio, distorsione).
- Formati 16:9 e 9:16, sottotitoli a schermo opzionali.

### Requisiti

Claude Code, Node.js LTS, Python 3.9+ con `numpy`, `scipy`, `pillow`.
Facoltativi: `faster-whisper` (sincronizzazione della voce), `youtube-transcript-api` (input da YouTube),
ffmpeg (musica in MP3).

### Installazione

```bash
git clone https://github.com/nispa/stickman-video ~/.claude/skills/stickman-video
pip install -r ~/.claude/skills/stickman-video/requirements.txt
```

Su Windows `~` è la tua cartella utente (`C:\Users\<nome>`). Riavvia Claude Code dopo l'installazione.

### Esempi di richieste

- *"Fammi un video animato di 2 minuti con gli omini che spiega l'interesse composto."*
- *"Trasforma questo copione in un'animazione, il voiceover lo registro dopo: copione.md"*
- *"Ecco i sottotitoli della mia narrazione, animali: narrazione.srt"*
- *"Crea un'animazione con gli omini che riassume questo video in 3 minuti: https://youtu.be/…"*
- *"Ho registrato la voce (voce.wav): sincronizza il video."*

### Registrare il voiceover

Leggi da `src/<video>/voiceover.srt`, che contiene le battute e una tempistica indicativa. Vai al tuo
ritmo e fai una breve pausa all'inizio di ogni capitolo. Metti il file in `public/<video>/voice.wav` e
chiedi a Claude di sincronizzarlo.

### Licenza

MIT © 2026 nispa. Remotion ha una licenza propria: gratuita per privati e piccole aziende, a
pagamento per le organizzazioni più grandi (https://www.remotion.dev/license).
