import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hero } from "../stickman/cast";
import { shakeAt, COL, FONT } from "../stickman/fx";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";
import { cueStart } from "./cues";
import { Backpack, DistantRunner, SURVIVOR, STRIDE, Zombie } from "../survival-test/Figures";
import { FarSkyline, FLOOR, MidSkyline, Sky, Street } from "../survival-test/World";
import { REST, REST_HIP, blend, groundedRun, smooth } from "../survival-test/gait";

// Scene 1 "The Clock Starts" (cue 0-28 of the narration). Four beats, all driven by the narration cues:
//   A  phone alert + 24:00:00 countdown     (cue 0 .. 9)
//   B  the street seen from the window      (cue 9 .. 19)
//   C  packing the backpack                 (cue 19 .. 25)
//   D  leaving the apartment                (cue 25 .. 29)
// Pure function of the frame: no timers, no randomness.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const A0 = 0;
const B0 = cueStart(9);
const C0 = cueStart(19);
const D0 = cueStart(25);
const END = cueStart(29);

export const S01_SFX: SfxCue[] = [
  [18, "buzz", 0.5],
  [44, "buzz", 0.4],
  [70, "buzz", 0.35],
  [B0 + 20, "whoosh_long", 0.25],
  [cueStart(20) - A0, "swish", 0.4],
  [cueStart(21) - A0, "swish", 0.4],
  [cueStart(22) - A0, "swish", 0.4],
  [cueStart(23) - A0, "swish", 0.4],
  [cueStart(27) - A0, "thud", 0.6],
];

const countdown = (f: number) => {
  const left = Math.max(0, 86400 - Math.floor(f / 30));
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
};

// ---------------------------------------------------------------- A: the phone
const Phone: React.FC<{ f: number }> = ({ f }) => {
  const sh = shakeAt(f, [18, 44, 70], 6, 10);
  const lit = interpolate(f, [18, 26], [0, 1], clamp);
  const line1 = interpolate(f, [cueStart(4), cueStart(4) + 12], [0, 1], clamp);
  const line2 = interpolate(f, [cueStart(5), cueStart(5) + 12], [0, 1], clamp);
  const timer = interpolate(f, [cueStart(6), cueStart(6) + 24], [0, 1], clamp);
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.25);
  const head = interpolate(f, [cueStart(3) - 8, cueStart(3) + 6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#0b0e12" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 52%, rgba(200,60,50,${0.35 * lit * (0.6 + 0.4 * pulse)}), rgba(0,0,0,0) 55%)` }} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <g transform={`translate(${sh.x} ${sh.y}) rotate(${sh.r * 3} 960 540)`}>
          <rect x={720} y={80} width={480} height={920} rx={56} fill="#15191f" stroke="#2c323b" strokeWidth={8} />
          <rect x={742} y={104} width={436} height={872} rx={40} fill={lit > 0.1 ? "#10141a" : "#05070a"} />
          <g opacity={lit * (1 - head)}>
            <text x={960} y={520} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} letterSpacing={4} fill="#e9e6df">
              06:02
            </text>
            <text x={960} y={580} textAnchor="middle" fontFamily={FONT.body} fontWeight={600} fontSize={30} letterSpacing={4} fill="#8f8a80">
              TUESDAY
            </text>
          </g>
          <g opacity={lit * head}>
            <rect x={742} y={104} width={436} height={110} rx={40} fill="#b3262b" />
            <rect x={742} y={170} width={436} height={44} fill="#b3262b" />
            <text x={960} y={178} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} letterSpacing={3} fill="#fff">
              EMERGENCY ALERT
            </text>
            <text x={776} y={310} fontFamily={FONT.body} fontWeight={700} fontSize={40} fill="#e9e6df" opacity={line1}>
              Remain calm.
            </text>
            <text x={776} y={380} fontFamily={FONT.body} fontWeight={500} fontSize={32} fill="#cfcac0" opacity={line2}>
              Next update in 24 hours.
            </text>
            <g opacity={timer}>
              <text x={960} y={640} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} letterSpacing={4} fill="#f4efe2">
                {countdown(f - cueStart(6))}
              </text>
              <text x={960} y={700} textAnchor="middle" fontFamily={FONT.body} fontWeight={600} fontSize={28} letterSpacing={6} fill="#a39d90">
                UNTIL NEXT UPDATE
              </text>
            </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- B: the window
const PEOPLE = [
  { x: 120, v: 8.6, s: 1.0, c: "#2b3038" },
  { x: 420, v: 7.4, s: 0.9, c: "#3a2f2f" },
  { x: 760, v: 9.4, s: 1.05, c: "#2b3a3f" },
  { x: 1010, v: 6.6, s: 0.85, c: "#3a3a2b" },
  { x: 1380, v: 8.1, s: 0.95, c: "#32283a" },
  { x: 1650, v: 7.0, s: 0.9, c: "#2b3038" },
  { x: 2100, v: 9.0, s: 1.0, c: "#3a2f2f" },
];
const CARS = [260, 780, 1380];

const Window: React.FC<{ f: number }> = ({ f }) => {
  const t = f - B0;
  const push = lerp(1.0, 1.12, smooth(t / (C0 - B0)));
  const WX = 600;
  const WY = 150;
  const k = 0.54;
  return (
    <AbsoluteFill style={{ background: "#0d1015" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="win">
            <rect x={WX} y={WY} width={1000} height={600} />
          </clipPath>
        </defs>
        <g transform={`translate(960 450) scale(${push}) translate(-960 -450)`}>
          {/* what is outside: the street scaled into the window, the crowd running right, a few zombies drifting in from the left */}
          <g clipPath="url(#win)">
            <g transform={`translate(${WX} ${WY}) scale(${k})`}>
              <Sky />
              <FarSkyline />
              <MidSkyline />
              <Street />
              {CARS.map((x, i) => (
                <g key={i}>
                  <rect x={x} y={FLOOR + 62} width={190} height={52} rx={14} fill={["#4a5260", "#6a4a46", "#44525a"][i]} stroke={COL.ink} strokeWidth={4} />
                  <rect x={x + 36} y={FLOOR + 36} width={110} height={34} rx={10} fill="#3b434d" stroke={COL.ink} strokeWidth={4} />
                  <circle cx={x + 44} cy={FLOOR + 114} r={16} fill="#1b1d20" />
                  <circle cx={x + 148} cy={FLOOR + 114} r={16} fill="#1b1d20" />
                </g>
              ))}
              {PEOPLE.map((p, i) => {
                const x = ((p.x + p.v * f) % 2700) - 400;
                return <DistantRunner key={i} f={f} x={x} ground={FLOOR + 46 + (i % 3) * 10} scale={p.s} color={p.c} />;
              })}
              {[0, 1, 2].map((i) => {
                const x = -260 + i * 150 + 1.15 * t;
                return <Zombie key={`z${i}`} f={f} i={i} x={x} ground={FLOOR + 40 + (i % 2) * 14} scale={0.9} d={x + i * 31} stride={110} lean={26} tilt={24} />;
              })}
            </g>
          </g>
          {/* the room: dark wall, window frame, curtains, sill */}
          <path d={`M0,0 H1920 V1080 H0 Z M${WX},${WY} V${WY + 600} H${WX + 1000} V${WY} Z`} fill="#1e2733" fillRule="evenodd" />
          <rect x={WX - 14} y={WY - 14} width={1028} height={14} fill="#222a35" />
          <rect x={WX - 14} y={WY + 600} width={1028} height={22} fill="#2a3340" />
          <rect x={WX - 14} y={WY} width={14} height={600} fill="#222a35" />
          <rect x={WX + 1000} y={WY} width={14} height={600} fill="#222a35" />
          <rect x={WX + 493} y={WY} width={14} height={600} fill="#222a35" />
          <polygon points={`${WX},${WY - 20} ${WX + 150},${WY - 20} ${WX + 90},${WY + 640} ${WX - 10},${WY + 640}`} fill="#1c222c" />
          <polygon points={`${WX + 1000},${WY - 20} ${WX + 850},${WY - 20} ${WX + 910},${WY + 640} ${WX + 1010},${WY + 640}`} fill="#1c222c" />
          <rect x={0} y={900} width={1920} height={180} fill="#161d27" />
        </g>
        {/* the survivor at the window, in the dark of the room */}
        <Hero f={f} who={SURVIVOR} x={470} ground={1010} scale={1.75} facing={1} seed={1} emotion="worried" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- C: packing
const ITEMS = [
  { name: "water", cue: 20, x: 1160, y: 800, w: 46, h: 120, color: "#4a7fb0" },
  { name: "water2", cue: 20, x: 1240, y: 800, w: 46, h: 120, color: "#5a8fc0" },
  { name: "bar", cue: 21, x: 1340, y: 880, w: 90, h: 36, color: "#a8783a" },
  { name: "bar2", cue: 21, x: 1450, y: 880, w: 90, h: 36, color: "#b8884a" },
  { name: "light", cue: 22, x: 1120, y: 905, w: 130, h: 34, color: "#3b4048" },
  { name: "phone", cue: 23, x: 1250, y: 940, w: 62, h: 110, color: "#15191f" },
];
const MOUTH = { x: 760, y: 560 };

const Packing: React.FC<{ f: number }> = ({ f }) => {
  const zoom = interpolate(f, [C0, END], [1, 1.06], clamp);
  const close = smooth((f - cueStart(24)) / 18);
  return (
    <AbsoluteFill style={{ background: "#14171c" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
          <rect x={0} y={0} width={1920} height={760} fill="#1a1f27" />
          <rect x={0} y={760} width={1920} height={320} fill="#3b2f26" />
          <rect x={0} y={760} width={1920} height={10} fill="#2a2119" />
          {/* backpack, open at the top; the flap comes down when the last item is in */}
          <rect x={560} y={560} width={400} height={440} rx={60} fill="#6a5a3a" stroke={COL.ink} strokeWidth={6} />
          <rect x={620} y={800} width={280} height={140} rx={22} fill="#54462b" stroke={COL.ink} strokeWidth={5} />
          <rect x={590} y={540} width={340} height={40} rx={18} fill="#10131a" />
          <rect x={540} y={600} width={26} height={300} rx={12} fill="#3a2f1c" />
          <g transform={`translate(0 ${lerp(-210, 0, close)})`} opacity={close > 0.02 ? 1 : 0}>
            <rect x={560} y={520} width={400} height={170} rx={60} fill="#54462b" stroke={COL.ink} strokeWidth={6} />
            <rect x={730} y={660} width={60} height={46} rx={10} fill="#caa94a" stroke={COL.ink} strokeWidth={4} />
          </g>
          {ITEMS.map((it) => {
            const t0 = cueStart(it.cue);
            const u = smooth((f - t0 - (it.name.endsWith("2") || it.name === "bar2" ? 8 : 0)) / 26);
            const px = lerp(it.x, MOUTH.x, u);
            const py = lerp(it.y, MOUTH.y + 80, u) - Math.sin(Math.PI * u) * 150;
            const s = lerp(1, 0.55, u);
            if (u >= 0.98) return null;
            return (
              <g key={it.name} transform={`translate(${px} ${py}) scale(${s})`}>
                <rect x={-it.w / 2} y={-it.h / 2} width={it.w} height={it.h} rx={it.name.startsWith("water") ? 16 : 10} fill={it.color} stroke={COL.ink} strokeWidth={5} />
                {it.name === "phone" && <rect x={-it.w / 2 + 6} y={-it.h / 2 + 8} width={it.w - 12} height={it.h - 16} rx={8} fill="#2a8f5a" opacity={0.8} />}
                {it.name === "light" && <rect x={it.w / 2 - 22} y={-it.h / 2} width={22} height={it.h} fill="#c8c0a0" stroke={COL.ink} strokeWidth={4} />}
              </g>
            );
          })}
          <text x={1300} y={700} fontFamily={FONT.body} fontWeight={700} fontSize={34} fill="#e9e6df" opacity={interpolate(f, [cueStart(23), cueStart(23) + 14], [0, 1], clamp) * (1 - close)}>
            phone 85%
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- D: leaving
const Leaving: React.FC<{ f: number }> = ({ f }) => {
  const t = f - D0;
  const walkT = cueStart(27) - D0; // walks to the door, opens it, goes out as the narration says he did not look back
  const x0 = 520;
  const x1 = 1450;
  const sp = (x1 - x0) / Math.max(60, walkT - 40);
  const go = smooth((t - 10) / 20);
  const x = x0 + Math.max(0, Math.min(x1 - x0, sp * (t - 20)));
  const d = x - x0;
  const g = groundedRun(d, 1.25, { stride: 140, lean: 6, lift: 12, arm: 20 });
  const moving = t > 20 && x < x1 - 1;
  const toRest = moving ? 0 : 1;
  const pose = blend(g.pose, REST, Math.max(toRest, 1 - go));
  const hipH = lerp(g.hipH, REST_HIP, Math.max(toRest, 1 - go));
  const doorOpen = interpolate(t, [walkT - 40, walkT - 10], [0, 1], clamp) * (1 - smooth((t - (walkT + 36)) / 24));
  const out = smooth((t - (walkT + 10)) / 26); // fades into the dark of the hall
  const closeBlack = smooth((f - cueStart(28)) / 20);
  return (
    <AbsoluteFill style={{ background: "#10141a" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <rect x={0} y={0} width={1920} height={800} fill="#1a2029" />
        <rect x={0} y={800} width={1920} height={280} fill="#2a2320" />
        <rect x={0} y={800} width={1920} height={8} fill="#161210" />
        {/* the door: a lit rectangle behind the leaf, the leaf swings open */}
        <rect x={1500} y={300} width={220} height={500} fill="#0d1015" />
        <g opacity={doorOpen}>
          <rect x={1500} y={300} width={220} height={500} fill="#2c3a4a" opacity={0.6} />
        </g>
        <polygon points={`1500,300 ${1500 + 220 * (1 - 0.75 * doorOpen)},${300 - 20 * doorOpen} ${1500 + 220 * (1 - 0.75 * doorOpen)},${800 + 20 * doorOpen} 1500,800`} fill="#5a4a38" stroke={COL.ink} strokeWidth={6} />
        <circle cx={1500 + 190 * (1 - 0.75 * doorOpen)} cy={560} r={9} fill="#d9c27a" />
        {/* hook by the door */}
        <rect x={1400} y={420} width={12} height={60} rx={5} fill="#8a8f98" />
        <g opacity={1 - out}>
          <Hero
            f={f}
            who={SURVIVOR}
            x={x}
            ground={900}
            scale={1.25}
            facing={1}
            seed={3}
            emotion="worried"
            mod={(tt, p) => ({ ...p, ...pose, y: 900 - hipH * 1.25 })}
            held={(j) => <Backpack j={j} s={1.25} phase={d / STRIDE} />}
          />
        </g>
      </svg>
      <AbsoluteFill style={{ background: "#05070a", opacity: closeBlack }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: closeBlack }}>
        <div style={{ fontFamily: FONT.title, fontWeight: 800, fontSize: 130, letterSpacing: 6, color: "#f4efe2" }}>{countdown(f)}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const S01ClockStarts: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  // short dips to black at every cut, and a fade in at the very start
  const dip = (b: number) => interpolate(f, [b - 8, b, b + 8], [0, 1, 0], clamp);
  const black = Math.max(dip(B0), dip(C0), dip(D0), interpolate(f, [0, 14], [1, 0], clamp));
  return (
    <AbsoluteFill style={{ background: "#05070a" }}>
      {f < B0 && <Phone f={f} />}
      {f >= B0 && f < C0 && <Window f={f} />}
      {f >= C0 && f < D0 && <Packing f={f} />}
      {f >= D0 && <Leaving f={f} />}
      <AbsoluteFill style={{ background: "#05070a", opacity: black, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
