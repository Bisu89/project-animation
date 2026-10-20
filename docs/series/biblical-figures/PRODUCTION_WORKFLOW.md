# Biblical Figures — Production Workflow

This series uses the same video approach as `100-days-zombie-survival`: AI-generated historical images, smooth camera zoom/pan, English narration, subtitles, and restrained environmental motion. It does not use full stickman animation. The supplied 15-episode notes are the story map; the production steps below follow this repository's picture pipeline.

## For each new episode

1. **Check sources and continuity.** Read the episode entry in `EPISODE_OUTLINE.md`. Separate biblical text, external historical evidence, later tradition, and unresolved claims. Verify historical claims and retain a source list alongside the script.
2. **Draft the English narration.** Use the episode hook, distinguish source categories in the wording, and label illustrative reconstructions. Keep the script focused on its subject and target about 8–13 minutes, adjusted to actual narration timing.
3. **Owner review.** Send the script and source notes for review. As with the zombie series, do not start video production until the story is approved.
4. **Generate voice and timeline.** Use `scripts/gen_voice.py` to create English narration, subtitles, and timed cues under `demo-project/public/bf-epNN/` and `demo-project/src/bf-epNN/`.
5. **Plan scenes.** Write `content/bf-epNN/prompts.txt`, one line per scene in `fx | image description` format, then run `scripts/build_scenes.py --slug bf-epNN --target 15 --style-file content/bf-style.txt` to create the scene table and TypeScript scene data. Use the approved survival-series 2D illustrated look while keeping historical clothing, settings, and props appropriate to the episode; avoid readable AI-generated text in images.
6. **Create the images.** Make placeholders with `scripts/make_placeholders.py --slug bf-epNN`, generate the images, and save them under `demo-project/public/bf-epNN/images/sceneNN.png`. Reuse images only when they fit the episode's character, setting, and composition.
7. **Assemble the Remotion composition.** Scaffold the episode, adapt the picture-based composition used by `zs-ep01`, add gentle Ken Burns camera moves and restrained effects, and keep narration and subtitles enabled.
8. **Review and render.** Inspect image sheets and representative frames, check narration pronunciation and SFX balance, render a preview, then render the approved full episode. Keep the English captions and on-screen text aligned with the approved script.
9. **Record the result.** Update the episode status and source references. Follow the repository rule that generated media and MP4s are not pushed to Git.

## Current repository status

- Planning documents: this directory.
- Production approach: same AI-image and Remotion workflow as the zombie series, with separate `bf-epNN` episode paths and a distinct historical image style.
- Episode scripts, images, and compositions for this series: not created yet.
- Next step: draft and review the script for the first episode to produce, then build its scene plan and video.

