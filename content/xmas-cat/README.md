# Xmas cat reels (Facebook -> YouTube funnel)
Reference: Facebook reel 'Rainy nights' (10s, 9:16, one still + slow push-in + rain + lantern flicker + lightning). Ours: sleeping cat, fireplace, snow.
Plan: 1) create master from assets_master.csv, save as content/xmas-cat/master.png  2) Remotion: slow zoom, Snowfall, Fire at hearth, light flicker on the cat, breathing, SFX  3) 10s reel, then a long loop for YouTube.
Do NOT copy the reference artwork (it has another channel's watermark).

## Status 2026-10-26
- master.png (941x1672) approved. Variants made from crops (crops.json holds the boxes): fire_plate (flames removed), cat_face_eyes_half, cat_face_ear_turn, cat_tail_lift. All aligned (0px shift measured).
- Composition: demo-project/src/xmas-cat (own entry index.ts; Root.tsx not used because anc-ep04 import breaks the bundle). Render: cd demo-project && npx remotion render src/xmas-cat/index.ts XmasCat ../renders/xmas-cat-v2.mp4 --port=3493
- Procedural flame (teardrop tongues + scrolling-noise displacement) replaces the painted one. Audio: scripts/gen_xmas_sfx.py (fire+wind) + jazz10 at low volume.
- Known: tail crop box cuts the tail tip ~30px short on the left (tip at master x~420, box starts 450); if the tail lift shows a seam, regenerate with box (330,1100,780,1400).
