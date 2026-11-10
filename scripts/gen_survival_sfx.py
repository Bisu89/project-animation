"""Âm thanh tổng hợp cho Survival Logs (không dùng mẫu, không vướng bản quyền).

    python scripts/gen_survival_sfx.py --out demo-project/public/survival-logs
Ghi OUT/sfx/<tên>.wav: drone, groan, groan_far, door_slide, switch, flicker, sco_beep, lock, glass_thump, crowd.
"""
import argparse
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_audio as A
from gen_audio import SR, t_, noise, filt, env, mix, pad_to

rng = np.random.default_rng(11)


def drone(d=40.0):
    t = t_(d)
    base = sum(np.sin(2 * np.pi * f * t + p) * g for f, g, p in ((41.2, 1, 0), (61.7, 0.5, 1), (82.4, 0.35, 2), (123.5, 0.12, 0.5)))
    wob = 1 + 0.25 * np.sin(2 * np.pi * 0.07 * t)
    air = filt(noise(d), "bp", (180, 900)) * 0.18 * (1 + 0.5 * np.sin(2 * np.pi * 0.05 * t + 1))
    x = base * wob * 0.6 + air
    fade = int(2 * SR)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    return x


def groan(d=1.8, f0=95):
    t = t_(d)
    pitch = f0 * (1 + 0.08 * np.sin(2 * np.pi * 3.1 * t) + 0.05 * rng.standard_normal(len(t)).cumsum() / np.sqrt(len(t)))
    ph = 2 * np.pi * np.cumsum(pitch) / SR
    src = np.sign(np.sin(ph)) * 0.5 + noise(d) * 0.6
    voc = filt(src, "bp", (300, 900)) + filt(src, "bp", (1100, 1700)) * 0.4
    shape = np.sin(np.pi * np.linspace(0, 1, len(t))) ** 0.8
    return voc * shape


def door_slide(d=1.6):
    t = t_(d)
    motor = np.sin(2 * np.pi * 110 * t) * 0.25 + np.sin(2 * np.pi * 220 * t) * 0.1
    rumble = filt(noise(d), "bp", (200, 1800)) * 0.5
    shape = np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.3)
    end = pad_to(np.zeros(int((d - 0.12) * SR)), d - 0.12)
    clunk = np.concatenate([end, A.thud(0.12, 160, 60)])[: len(t)]
    return (motor + rumble) * shape + pad_to(clunk, d) * 0.8


def switch():
    click = filt(noise(0.012), "hp", 2000) * env(int(0.012 * SR), 0.0005, 0.004)
    body = A.thud(0.06, 400, 150) * 0.5
    return mix(click, body)


def flicker(d=1.2):
    t = t_(d)
    hum = np.sin(2 * np.pi * 120 * t) * 0.4 + filt(noise(d), "hp", 3000) * 0.3
    gate = (rng.random(int(d * 20)) > 0.45).astype(float)
    gate = np.repeat(gate, len(t) // len(gate) + 1)[: len(t)]
    return hum * filt(gate, "lp", 200)


def sco_beep():
    d = 0.16
    return np.sin(2 * np.pi * 1760 * t_(d)) * env(int(d * SR), 0.004, 0.16, 2)


def lock():
    return mix(A.thud(0.15, 220, 90), np.pad(switch() * 0.8, (int(0.05 * SR), 0)))


def glass_thump():
    low = A.thud(0.35, 90, 45)
    ring = filt(noise(0.4), "bp", (2500, 6000)) * env(int(0.4 * SR), 0.001, 0.4, 6) * 0.25
    return mix(low, ring)


def crowd(d=12.0):
    out = np.zeros(int(d * SR))
    for _ in range(14):
        g = groan(rng.uniform(1.2, 2.6), rng.uniform(70, 130)) * rng.uniform(0.3, 0.8)
        at = int(rng.uniform(0, d - 2.7) * SR)
        out[at : at + len(g)] += g
    return filt(out, "lp", 2500)


def at(buf_len, parts):
    """parts: list of (seconds, array) -> mixed buffer"""
    out = np.zeros(int(buf_len * SR))
    for s, x in parts:
        i = int(s * SR)
        n = min(len(x), len(out) - i)
        if n > 0:
            out[i : i + n] += x[:n]
    return out


def rain(d=30.0):
    x = filt(noise(d), "bp", (800, 7000)) * 0.6 + filt(noise(d), "lp", 400) * 0.3
    drops = np.zeros(int(d * SR))
    for _ in range(int(d * 25)):
        i = rng.integers(0, len(drops) - 400)
        drops[i : i + 300] += filt(noise(300 / SR), "hp", 3000) * env(300, 0.0005, 0.004) * rng.uniform(0.1, 0.4)
    y = x + drops
    f = int(1.5 * SR)
    y[:f] *= np.linspace(0, 1, f)
    y[-f:] *= np.linspace(1, 0, f)
    return y


def store_hum(d=20.0):
    t = t_(d)
    y = np.sin(2 * np.pi * 60 * t) * 0.3 + np.sin(2 * np.pi * 120 * t) * 0.2 + filt(noise(d), "bp", (2000, 5000)) * 0.05
    f = int(1.0 * SR)
    y[:f] *= np.linspace(0, 1, f)
    y[-f:] *= np.linspace(1, 0, f)
    return y


def hum_down(d=3.0):
    t = t_(d)
    fr = 120 * np.exp(-t * 0.8)
    y = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 1.2)
    return y + A.thud(0.2, 120, 50) * 0.4 if False else y


def radio_static(d=1.2):
    x = filt(noise(d), "bp", (500, 4000))
    g = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * t_(d))
    return x * g * np.minimum(1, t_(d) / 0.05) * np.minimum(1, (d - t_(d)) / 0.2)


def glass_creak(d=2.5):
    t = t_(d)
    fr = 180 + 60 * np.sin(2 * np.pi * 0.7 * t) + 20 * rng.standard_normal(len(t)).cumsum() / np.sqrt(len(t))
    y = np.sign(np.sin(2 * np.pi * np.cumsum(fr) / SR)) * 0.3
    y = filt(y, "bp", (300, 2500)) * np.sin(np.pi * t / d)
    return y


def glass_crack():
    parts = [(0, A.thud(0.15, 200, 80))]
    for k in range(9):
        parts.append((0.02 + k * rng.uniform(0.02, 0.07), filt(noise(0.03), "hp", 3500) * env(int(0.03 * SR), 0.0002, 0.01)))
    return at(0.9, parts)


def basket_drop():
    return at(1.0, [(0, A.thud(0.2, 160, 60)), (0.05, filt(noise(0.4), "bp", (1500, 6000)) * env(int(0.4 * SR), 0.001, 0.4, 5) * 0.5),
                    (0.25, A.thud(0.12, 220, 90) * 0.5), (0.4, A.thud(0.1, 260, 110) * 0.3)])


def car_away(d=3.5):
    t = t_(d)
    eng = np.sign(np.sin(2 * np.pi * np.cumsum(55 + 25 * t / d) / SR)) * 0.3 + filt(noise(d), "lp", 300) * 0.5
    return filt(eng, "lp", 900) * np.exp(-t * 0.9)


def step(g=1.0):
    return mix(A.thud(0.08, 140, 60), filt(noise(0.05), "bp", (1000, 4000)) * env(int(0.05 * SR), 0.001, 0.03) * 0.4) * g


def footsteps_run(d=2.0):
    return at(d, [(i * 0.17, step(rng.uniform(0.6, 1.0))) for i in range(int(d / 0.17) - 1)])


def shutter(d=2.2):
    t = t_(d)
    rattle = filt(noise(d), "bp", (400, 3000)) * (0.6 + 0.4 * (np.sin(2 * np.pi * 18 * t) > 0))
    squeal = np.sin(2 * np.pi * np.cumsum(900 + 200 * np.sin(2 * np.pi * 0.8 * t)) / SR) * 0.15
    y = (rattle + squeal) * np.minimum(1, t / 0.1) * np.minimum(1, (d - t) / 0.2)
    return mix(y, at(d, [(d - 0.15, A.thud(0.15, 120, 50))]))


def shutter_hit():
    return mix(A.thud(0.4, 90, 40), filt(noise(0.6), "bp", (300, 2500)) * env(int(0.6 * SR), 0.001, 0.6, 5) * 0.6)


def crash():
    return at(1.6, [(0, A.thud(0.4, 100, 40)), (0.02, A.shatter(0.6) * 0.3 if hasattr(A, "shatter") else np.zeros(1)),
                    (0.1, filt(noise(0.8), "bp", (500, 4000)) * env(int(0.8 * SR), 0.001, 0.8, 4) * 0.5),
                    (0.35, A.thud(0.15, 200, 90) * 0.5), (0.55, A.thud(0.12, 240, 100) * 0.4), (0.8, A.thud(0.1, 260, 120) * 0.3)])


def click():
    return filt(noise(0.01), "hp", 2500) * env(int(0.01 * SR), 0.0003, 0.003)


def faucet(d=2.5):
    t = t_(d)
    flow = filt(noise(d), "bp", (1500, 6000)) * np.exp(-t * 1.5) * 0.5
    sput = at(d, [(rng.uniform(0.1, 1.6), filt(noise(0.06), "bp", (300, 1500)) * env(int(0.06 * SR), 0.001, 0.05)) for _ in range(6)])
    drips = at(d, [(1.6 + k * 0.35, np.sin(2 * np.pi * 1300 * t_(0.04)) * env(int(0.04 * SR), 0.001, 0.03) * 0.4) for k in range(3)])
    return flow + sput + drips


def tape(d=0.9):
    t = t_(d)
    return filt(noise(d), "bp", (1500, 7000)) * (0.5 + 0.5 * np.sin(2 * np.pi * 40 * t)) * np.sin(np.pi * t / d)


def scratch(d=2.5):
    t = t_(d)
    return filt(noise(d), "bp", (2000, 6000)) * (0.3 + 0.7 * np.abs(np.sin(2 * np.pi * 1.3 * t))) * np.sin(np.pi * t / d) * 0.5


def breath(d=3.0):
    return at(d, [(k * 0.75, filt(noise(0.6), "bp", (300, 2000)) * np.sin(np.pi * np.linspace(0, 1, int(0.6 * SR))) * 0.5) for k in range(4)])


def drag(d=1.6):
    t = t_(d)
    return filt(noise(d), "bp", (100, 900)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)) * np.sin(np.pi * t / d)


def cough():
    return at(1.0, [(0, filt(noise(0.18), "bp", (250, 1800)) * env(int(0.18 * SR), 0.005, 0.15)),
                    (0.35, filt(noise(0.15), "bp", (250, 1800)) * env(int(0.15 * SR), 0.005, 0.12) * 0.7)])


def knock():
    return at(1.0, [(k * 0.28, A.thud(0.1, 180, 80) * 0.6) for k in range(3)])


def keys():
    return at(0.8, [(rng.uniform(0, 0.4), np.sin(2 * np.pi * rng.uniform(3000, 6000) * t_(0.15)) * env(int(0.15 * SR), 0.0005, 0.1) * 0.3)
                    for _ in range(10)])


def tools_drop():
    return at(1.2, [(rng.uniform(0, 0.5), mix(A.thud(0.1, 300, 120) * 0.4,
                     np.sin(2 * np.pi * rng.uniform(1500, 3500) * t_(0.3)) * env(int(0.3 * SR), 0.0005, 0.2) * 0.2)) for _ in range(7)])


def door_open(d=1.2):
    t = t_(d)
    creak = filt(np.sign(np.sin(2 * np.pi * np.cumsum(220 + 80 * t) / SR)) * 0.2, "bp", (400, 2000)) * np.sin(np.pi * t / d)
    return mix(click() * 0.8, creak)


def wind(d=12.0):
    t = t_(d)
    x = filt(noise(d), "bp", (150, 900)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.15 * t) ** 2)
    f = int(1.5 * SR)
    x[:f] *= np.linspace(0, 1, f)
    x[-f:] *= np.linspace(1, 0, f)
    return x


def metal_bend(d=1.4):
    t = t_(d)
    fr = 140 + 90 * t / d
    y = np.sign(np.sin(2 * np.pi * np.cumsum(fr + 15 * np.sin(2 * np.pi * 11 * t)) / SR)) * 0.3
    return filt(y, "bp", (200, 2500)) * np.sin(np.pi * t / d) + at(d, [(d - 0.2, A.thud(0.2, 160, 70) * 0.6)])


def helicopter(d=8.0):
    t = t_(d)
    chop = (np.sin(2 * np.pi * 11 * t) > 0.6).astype(float)
    x = filt(noise(d), "lp", 500) * filt(chop, "lp", 60) * 1.5 + filt(noise(d), "bp", (800, 2500)) * 0.08
    return x * np.sin(np.pi * t / d)


def flare(d=4.0):
    t = t_(d)
    pop = at(d, [(0, A.thud(0.15, 300, 120))])
    hiss = filt(noise(d), "bp", (1500, 8000)) * np.minimum(1, t / 0.2) * np.exp(-t * 0.25) * 0.6
    return pop + hiss


def engine(d=3.5):
    t = t_(d)
    crank = at(d, [(k * 0.12, A.thud(0.08, 120, 60) * 0.5) for k in range(5)])
    fr = np.where(t < 0.7, 30, 45 + 20 * np.minimum(1, (t - 0.7) / 0.6) * np.exp(-np.maximum(0, t - 1.3) * 0.8))
    rum = np.sign(np.sin(2 * np.pi * np.cumsum(fr) / SR)) * 0.35 * (t > 0.6)
    return crank + filt(rum + filt(noise(d), "lp", 300) * 0.3 * (t > 0.6), "lp", 800) * np.minimum(1, (d - t) / 0.4)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    A.ROOT = a.out
    A.save("drone", drone(), 0.5)
    A.save("groan", groan(), 0.8)
    A.save("groan_far", filt(groan(2.2, 80), "lp", 1200), 0.5)
    A.save("door_slide", door_slide(), 0.7)
    A.save("switch", switch(), 0.8)
    A.save("flicker", flicker(), 0.5)
    A.save("sco_beep", sco_beep(), 0.6)
    A.save("lock", lock(), 0.8)
    A.save("glass_thump", glass_thump(), 0.9)
    A.save("crowd", crowd(), 0.6)
    A.save("drone_cold", filt(drone(20.0), "lp", 600), 0.5)
    A.save("rain", rain(), 0.5)
    A.save("store_hum", store_hum(), 0.3)
    A.save("hum_down", hum_down(), 0.6)
    A.save("radio_static", radio_static(), 0.5)
    A.save("glass_creak", glass_creak(), 0.6)
    A.save("glass_crack", glass_crack(), 0.9)
    A.save("basket_drop", basket_drop(), 0.8)
    A.save("car_away", car_away(), 0.6)
    A.save("footsteps_run", footsteps_run(), 0.7)
    A.save("shutter", shutter(), 0.7)
    A.save("shutter_hit", shutter_hit(), 0.95)
    A.save("crash", crash(), 0.9)
    A.save("click", click(), 0.6)
    A.save("thud", A.thud(0.3, 110, 42), 0.8)
    A.save("thud_far", filt(A.thud(0.3, 110, 42), "lp", 400), 0.5)
    A.save("faucet", faucet(), 0.6)
    A.save("tape", tape(), 0.6)
    A.save("scratch", scratch(), 0.5)
    A.save("breath", breath(), 0.5)
    A.save("drag", drag(), 0.6)
    A.save("cough", cough(), 0.6)
    A.save("knock", knock(), 0.7)
    A.save("keys", keys(), 0.6)
    A.save("tools_drop", tools_drop(), 0.7)
    A.save("door_open", door_open(), 0.6)
    A.save("wind", wind(), 0.5)
    A.save("metal_bend", metal_bend(), 0.7)
    A.save("helicopter", helicopter(), 0.6)
    A.save("flare", flare(), 0.8)
    A.save("engine", engine(), 0.7)
    print("ok")
