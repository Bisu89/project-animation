"""Sound effects and ambience beds for the ancient-battles series, synthesised from scratch (no samples).

usage: python scripts/gen_anc_sfx.py            -> demo-project/public/anc-sfx/sfx/<name>.wav
One shared folder for every episode (Soundtrack.tsx loads `anc-sfx/sfx/<name>.wav`). Re-running rewrites the same files.
Reuses the building blocks of gen_audio.py and gen_zs_sfx.py (noise, filters, envelopes, steps, murmur, reverb).
"""
import argparse
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_audio as ga  # noqa: E402
import gen_zs_sfx as gz  # noqa: E402
from gen_audio import SR, filt, noise, rng, t_  # noqa: E402
from gen_zs_sfx import loopable, murmur, place, reverb, slow_noise  # noqa: E402


# ------------------------------------------------------------------ one-shots
def sword_clash():
    d = 1.1
    tt = t_(d)
    out = np.zeros(int(d * SR))
    for f0, g, at in ((1900, 1.0, 0.0), (2650, 0.7, 0.015), (1250, 0.5, 0.03)):
        x = sum(a * np.sin(2 * np.pi * f0 * m * tt) * np.exp(-tt * k) for m, a, k in ((1, 1, 7), (2.4, 0.6, 11), (3.9, 0.4, 16), (5.6, 0.2, 24)))
        place(out, x, at, g)
    place(out, filt(noise(0.25), "bp", (1500, 7000)) * np.exp(-t_(0.25) * 40), 0.0, 0.8)
    return reverb(out, 0.6, 0.25)


def shield_hit(g=1.0):
    tt = t_(0.4)
    body = np.sin(2 * np.pi * (95 * np.exp(-tt * 5)) * tt) * np.exp(-tt * 14)
    knock = filt(noise(0.4), "bp", (250, 1100)) * np.exp(-tt * 35) * 0.8
    rim = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) * a for f, a, k in ((620, 0.15, 18), (1010, 0.1, 25)))
    return (body + knock + rim) * g


def shield_wall():
    out = np.zeros(int(1.8 * SR))
    for at in (0.0, 0.18, 0.37, 0.6, 0.74, 1.0, 1.22):
        place(out, shield_hit(rng.uniform(0.6, 1.0)), at + rng.uniform(-0.02, 0.02))
    return out


def spear_thrust():
    out = np.zeros(int(0.9 * SR))
    place(out, ga.swish(), 0.0, 0.6)
    place(out, shield_hit(0.9), 0.17)
    return out


def arrow_volley(d=2.4):
    out = np.zeros(int(d * SR))
    for _ in range(26):
        place(out, ga.whoosh(rng.uniform(0.3, 0.5), 3200, 900, 0.3), rng.uniform(0.0, 0.5), rng.uniform(0.2, 0.5))
    for _ in range(18):
        tt = t_(0.18)
        thunk = (np.sin(2 * np.pi * 170 * tt) * np.exp(-tt * 40) + filt(noise(0.18), "bp", (500, 2500)) * np.exp(-tt * 70) * 0.6)
        place(out, thunk, rng.uniform(1.0, 1.9), rng.uniform(0.15, 0.4))
    return out


def brass(f, d, vib=5.0, atk=0.25, rel=0.4, bright=1.0):
    t = t_(d)
    fr = f * (1 + 0.006 * np.sin(2 * np.pi * vib * t))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = sum(np.sin(h * ph) / h ** 0.9 for h in range(1, 9))
    x = ga.sweep_filter(x, 280, 1500 * bright, "lp", 32)
    a = np.minimum(1, t / atk)
    r = np.minimum(1, (d - t) / rel)
    return x * a * r


def war_horn():
    return reverb(brass(98.0, 2.8), 1.6, 0.35)


def fanfare():
    out = np.zeros(int(4.2 * SR))
    for f, at, d in ((98.0, 0.0, 0.9), (146.8, 0.9, 0.9), (196.0, 1.8, 2.2)):
        place(out, brass(f, d, 5.5, 0.12, 0.25, 1.4), at)
        place(out, brass(f * 1.5, d, 5.5, 0.12, 0.25, 1.2), at, 0.5)
    return reverb(out, 1.8, 0.4)


def hoof(g=1.0):
    tt = t_(0.18)
    thud = np.sin(2 * np.pi * (140 * np.exp(-tt * 8)) * tt) * np.exp(-tt * 26)
    click = filt(noise(0.18), "bp", (1200, 3500)) * np.exp(-tt * 70) * 0.5
    return (thud + click) * g


def gallop(d, rate=0.6, g=1.0, phase=0.0):
    out = np.zeros(int(d * SR))
    k = 0
    while True:
        base = phase + k * rate
        if base > d:
            break
        for off, gg in ((0.0, 1.0), (rate * 0.22, 0.8), (rate * 0.42, 0.9)):
            place(out, hoof(g * gg * rng.uniform(0.8, 1.0)), base + off)
        k += 1
    return out


def horse_gallop():
    return gallop(3.2, 0.58, 1.0)


def cavalry_charge(d=4.0):
    out = np.zeros(int(d * SR))
    for _ in range(14):
        out += gallop(d, rng.uniform(0.52, 0.68), rng.uniform(0.25, 0.5), rng.uniform(0.0, 0.5))
    out += filt(noise(d), "lp", 220) * np.sin(np.pi * t_(d) / d) * 0.5
    return out


def shout(d, f0, bright=1.0, rise=0.3):
    t = t_(d)
    f = f0 * (1 + rise * np.minimum(1, t / (d * 0.5))) * (1 + 0.01 * np.sin(2 * np.pi * 5.5 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(h * ph) / h for h in range(1, 12)) + 0.3 * noise(d)
    x = filt(x, "bp", (500 * bright, 1200 * bright)) + 0.7 * filt(x, "bp", (1500 * bright, 2800 * bright))
    shape = np.minimum(1, t / 0.12) * np.exp(-((t - 0.45 * d) / (0.35 * d)) ** 2)
    return x * shape


def battle_cry():
    out = np.zeros(int(2.6 * SR))
    for _ in range(9):
        place(out, shout(rng.uniform(1.2, 1.9), rng.uniform(105, 190), 1.0), rng.uniform(0, 0.5), rng.uniform(0.25, 0.5))
    return reverb(out, 1.3, 0.4)


def crowd_roar(d=5.0):
    out = murmur(d, 2.2, 3.0) * 0.8
    for _ in range(int(d * 2.5)):
        place(out, shout(rng.uniform(0.9, 1.6), rng.uniform(110, 200), 1.0), rng.uniform(0, d - 1.7), rng.uniform(0.15, 0.35))
    out *= 0.4 + 0.6 * np.sin(np.pi * t_(d) / d)
    return reverb(out, 1.4, 0.35)


def crowd_cheer(d=3.5):
    out = murmur(d, 1.2, 1.5) * 0.4
    for _ in range(int(d * 5)):
        place(out, shout(rng.uniform(0.6, 1.1), rng.uniform(190, 300), 1.3, 0.5), rng.uniform(0, d - 1.2), rng.uniform(0.1, 0.25))
    out *= 0.3 + 0.7 * np.sin(np.pi * t_(d) / d)
    return reverb(out, 1.2, 0.35)


def war_drum():
    tt = t_(1.4)
    body = np.sin(2 * np.pi * (110 * np.exp(-tt * 3.2) + 52) * tt) * np.exp(-tt * 5.0)
    skin = filt(noise(1.4), "lp", 700) * np.exp(-tt * 22) * 0.6
    return reverb(body + skin, 1.2, 0.35)


def drum_roll(d=2.6):
    out = np.zeros(int(d * SR))
    at = 0.0
    while at < d - 0.4:
        place(out, war_drum()[: int(0.5 * SR)], at, 0.3 + 0.7 * at / d)
        at += 0.085
    return out


def wood_creak(d=1.4):
    t = t_(d)
    f = (120 + 80 * slow_noise(d, 3.0)) * (1 + 0.05 * np.sin(2 * np.pi * 7 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(h * ph) / h for h in range(1, 7)) * (0.5 + 0.5 * slow_noise(d, 9.0))
    x = filt(x, "bp", (200, 1400)) * np.sin(np.pi * t / d) ** 0.7
    return x


def thunder(d=3.6):
    t = t_(d)
    rumble = filt(noise(d), "lp", 180) * (np.exp(-t * 0.9) * (0.4 + 0.6 * slow_noise(d, 4.0)))
    crack = filt(noise(0.3), "bp", (800, 6000)) * np.exp(-t_(0.3) * 14)
    out = rumble
    out[: len(crack)] += crack * 0.9
    return out


def gong():
    return ga.bell(130.0, 4.5)


# --------------------------------------------------------------------- beds
def amb_march(d=16.0):
    out = np.zeros(int(d * SR))
    rate = 1.9
    k = 0
    while k / rate < d - 0.5:
        for _ in range(9):
            place(out, gz.step(rng.uniform(0.35, 0.6)), k / rate + rng.uniform(-0.05, 0.05))
        place(out, filt(noise(0.25), "bp", (2500, 7000)) * np.exp(-t_(0.25) * 22) * 0.18, k / rate + rng.uniform(0.0, 0.1))
        k += 1
    out += filt(noise(d), "lp", 140) * 0.18
    return loopable(out)


def amb_dig(d=12.0):
    out = np.zeros(int(d * SR))
    at = 0.2
    while at < d - 1.0:
        place(out, filt(noise(0.3), "bp", (600, 2600)) * np.exp(-t_(0.3) * 9) * 0.45, at)
        place(out, gz.step(rng.uniform(0.5, 0.9)), at + 0.32)
        if rng.random() < 0.3:
            place(out, ga.clink() * 0.25, at + rng.uniform(0.1, 0.6))
        at += rng.uniform(0.55, 1.0)
    return loopable(out)


def _fire(d):
    out = filt(noise(d), "lp", 150) * (0.35 + 0.5 * slow_noise(d, 0.4)) * 1.2
    for _ in range(int(d * 9)):
        place(out, filt(noise(0.05), "bp", (1800, 6500)) * np.exp(-t_(0.05) * 90) * rng.uniform(0.1, 0.5), rng.uniform(0, d - 0.1))
    return out


def amb_fire(d=16.0):
    return loopable(_fire(d))


def amb_wind(d=20.0):
    low = filt(noise(d), "bp", (180, 800)) * (0.2 + 0.8 * slow_noise(d, 0.2))
    whistle = filt(noise(d), "bp", (420, 700)) * (0.05 + 0.7 * slow_noise(d, 0.15) ** 3) * 0.5
    return loopable(low + whistle)


def amb_sea(d=20.0):
    t = t_(d)
    swell = (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t + 1.0 * slow_noise(d, 0.2))) ** 2
    low = filt(noise(d), "lp", 900) * swell
    hiss = filt(noise(d), "bp", (2200, 7000)) * swell * 0.25
    return loopable(low + hiss)


def amb_rain(d=16.0):
    hiss = filt(noise(d), "bp", (1800, 9000)) * 0.35
    rumble = filt(noise(d), "lp", 160) * 0.15
    return loopable(hiss + rumble)


def amb_camp(d=20.0):
    out = murmur(d, 0.6, 0.6) * 0.8 + _fire(d) * 0.35
    for _ in range(int(d / 4)):
        place(out, ga.clink() * 0.2, rng.uniform(0, d - 1.5))
    return loopable(out)


def amb_battle(d=20.0):
    out = murmur(d, 1.8, 2.2) * 0.8
    for _ in range(14):
        place(out, sword_clash() * 0.22, rng.uniform(0, d - 1.5))
    for _ in range(9):
        place(out, shout(rng.uniform(0.9, 1.5), rng.uniform(110, 200)), rng.uniform(0, d - 1.8), rng.uniform(0.12, 0.3))
    for _ in range(6):
        place(out, shield_hit(0.35), rng.uniform(0, d - 0.6))
    return loopable(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join("demo-project", "public", "anc-sfx"))
    a = ap.parse_args()
    ga.ROOT = a.out
    shots = {
        "sword_clash": sword_clash(), "shield_hit": shield_hit(), "shield_wall": shield_wall(), "spear_thrust": spear_thrust(),
        "arrow_volley": arrow_volley(), "war_horn": war_horn(), "fanfare": fanfare(), "horse_gallop": horse_gallop(),
        "cavalry_charge": cavalry_charge(), "battle_cry": battle_cry(), "crowd_roar": crowd_roar(), "crowd_cheer": crowd_cheer(),
        "war_drum": war_drum(), "drum_roll": drum_roll(), "wood_creak": wood_creak(), "thunder": thunder(), "gong": gong(),
        "footsteps": gz.footsteps(6, 0.55), "run_steps": gz.run_steps(), "clang": gz.clang(), "impact": ga.impact(),
        "thud": ga.thud(), "whoosh": ga.whoosh(), "swish": ga.swish(), "quill": ga.scribble(1.8), "page": ga.page(0.7),
        "chains": ga.chain_rattle(1.6), "latch": gz.latch(), "scrape": gz.scrape(),
        "amb_march": amb_march(), "amb_dig": amb_dig(), "amb_fire": amb_fire(), "amb_wind": amb_wind(), "amb_sea": amb_sea(),
        "amb_rain": amb_rain(), "amb_camp": amb_camp(), "amb_battle": amb_battle(), "amb_night": gz.amb_night(),
        "amb_crowd": gz.amb_crowd(),
    }
    for k, v in shots.items():
        ga.save(k, v, 0.9)
    print("anc sfx:", len(shots), "->", os.path.join(a.out, "sfx"))


if __name__ == "__main__":
    main()
