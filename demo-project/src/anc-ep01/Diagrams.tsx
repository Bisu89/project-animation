import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Arrow, BLUE, Card, Dot, GOLD, INK, LAND, Paper, RED, ROCK, SAND, SEA, SERIF, Ship, Unit, bez, ease } from "../anc-lib/kit";

// Thermopylae diagrams (episode 1). Primitives live in ../anc-lib/kit.tsx.
// ---------------- D1: two fronts ----------------
const MAINLAND = "M0,0 L760,0 L790,180 L850,330 L820,470 L880,640 L1000,820 L1060,1080 L0,1080 Z";
const EUBOEA = "M1030,330 L1170,360 L1480,610 L1620,790 L1500,820 L1260,640 L1060,450 Z";
export const D1: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const army = ease(f, 8, 70);
  const fleet = ease(f, 14, 80);
  return (
    <Paper>
      <rect width={1920} height={1080} fill={SEA} />
      <path d={MAINLAND} fill={LAND} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d={EUBOEA} fill={LAND} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <text x={330} y={760} fontFamily={SERIF} fontSize={46} fill="#6b4f36" opacity={0.7} letterSpacing={10}>GREECE</text>
      <text x={1440} y={760} fontFamily={SERIF} fontSize={30} fill="#6b4f36" opacity={0.7} letterSpacing={6} transform="rotate(38 1440 760)">EUBOEA</text>
      {/* Persian approach */}
      <Arrow x1={560} y1={20} x2={760} y2={330} color={BLUE} p={stage === 3 ? 1 : army} />
      <Arrow x1={1000} y1={20} x2={1120} y2={300} color={BLUE} p={stage === 3 ? 1 : fleet} />
      <Card x={470} y={60} text="PERSIAN ARMY" at={30} f={f} />
      <Card x={1170} y={70} text="PERSIAN FLEET" at={36} f={f} />
      {stage >= 1 && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <Unit key={i} x={808 + i * 14} y={430 + (i % 2) * 6} o={ease(f, 6 + i * 3, 16 + i * 3)} />
          ))}
          <Card x={540} y={500} text="THERMOPYLAE: THE PASS" at={14} f={f} to={[820, 440]} />
          {[0, 1, 2, 3].map((i) => (
            <Ship key={i} x={1060 + i * 38} y={290 + (i % 2) * 34} c={RED} r={20} s={0.9} />
          ))}
          <Card x={1430} y={330} text="ARTEMISIUM: THE FLEET" at={22} f={f} to={[1200, 330]} />
        </g>
      )}
      {stage === 2 && (
        <g>
          <path d="M850,440 Q1000,330 1090,320" fill="none" stroke={GOLD} strokeWidth={8} strokeDasharray="18 14" strokeDashoffset={-f * 1.2} />
          <Card x={1000} y={200} text="EACH PROTECTS THE OTHER" at={10} f={f} size={34} />
        </g>
      )}
      {stage === 3 && (
        <g>
          <Arrow x1={1130} y1={330} x2={1000} y2={760} color={RED} p={ease(f, 10, 70)} />
          <Card x={1100} y={560} text="THE FLEET WITHDRAWS SOUTH" at={30} f={f} />
          <g opacity={ease(f, 8, 20)}>
            <line x1={760} y1={390} x2={880} y2={490} stroke={RED} strokeWidth={14} strokeLinecap="round" />
            <line x1={880} y1={390} x2={760} y2={490} stroke={RED} strokeWidth={14} strokeLinecap="round" />
          </g>
          <Card x={560} y={560} text="THE PASS IS OPEN" at={24} f={f} to={[820, 470]} />
        </g>
      )}
    </Paper>
  );
};

// ---------------- D2: frontage in the pass ----------------
export const D2: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const cols = Array.from({ length: 32 }, (_, i) => 706 + i * 17);
  const rows = 30;
  const inLine = (x: number) => x >= 770 && x <= 1150;
  return (
    <Paper>
      <rect x={1290} y={0} width={640} height={1080} fill={SEA} />
      <path d="M0,0 L640,0 L690,300 L660,600 L690,1080 L0,1080 Z" fill={ROCK} stroke={INK} strokeWidth={5} />
      <path d="M1290,0 L1250,300 L1290,600 L1260,1080" fill="none" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${60 + (i % 5) * 110},${80 + i * 70} l60,-20 l30,30`} stroke="#4d4033" strokeWidth={4} fill="none" strokeLinecap="round" />
      ))}
      <text x={340} y={980} textAnchor="middle" fontFamily={SERIF} fontSize={38} fill="#d8c9a8" letterSpacing={8}>CLIFF</text>
      <text x={1600} y={980} textAnchor="middle" fontFamily={SERIF} fontSize={38} fill="#eaf3f7" letterSpacing={8}>SEA</text>
      {/* Persians packed behind the line */}
      {cols.map((x, ci) =>
        Array.from({ length: rows }, (_, r) => {
          const y = 556 - r * 17 + Math.sin(f / 10 + ci + r) * 1.4 + (r > 12 ? (stage === 0 ? 0 : 0) : 0);
          const front = r < 2 && inLine(x);
          const o = stage >= 1 ? (front ? 1 : 0.55) : ease(f, 20 + r * 1.5, 40 + r * 1.5);
          return <Dot key={`${ci}-${r}`} x={x} y={y} o={o} />;
        })
      )}
      {stage >= 1 &&
        cols.filter(inLine).map((x, i) => (
          <circle key={i} cx={x} cy={556} r={11 + Math.sin(f / 5) * 1.2} fill="none" stroke={GOLD} strokeWidth={3} opacity={ease(f, 10 + i, 20 + i)} />
        ))}
      {/* the Greek line */}
      {Array.from({ length: 17 }, (_, i) => (
        <Unit key={i} x={780 + i * 23} y={612} o={ease(f, 2 + i * 1.4, 12 + i * 1.4)} s={1.05} />
      ))}
      {stage === 0 && <Card x={960} y={700} text="A LINE ACROSS THE ROAD" at={20} f={f} size={36} />}
      {stage === 0 && <Card x={960} y={790} text="15 TO 20 MEN WIDE" at={44} f={f} size={36} />}
      {stage === 1 && <Card x={960} y={700} text="ONLY THESE CAN FIGHT" at={12} f={f} size={36} to={[960, 568]} />}
      {stage === 1 && <Card x={960} y={790} text="EVERYONE ELSE WAITS" at={46} f={f} size={36} />}
      {stage === 2 && (
        <g>
          <Card x={340} y={220} text="100,000 MEN" at={8} f={f} size={44} />
          <Card x={340} y={330} text="IN THE ARMY" at={14} f={f} size={32} />
          <Card x={340} y={500} text="ABOUT 20" at={46} f={f} size={44} />
          <Card x={340} y={610} text="AT THE SPEAR POINT" at={52} f={f} size={32} />
        </g>
      )}
    </Paper>
  );
};

// ---------------- D3: the mountain path ----------------
const SEG1 = [[560, 230], [560, 420], [420, 520], [470, 660]];
const SEG2 = [[470, 660], [520, 820], [820, 920], [1040, 850]];
const pathPoint = (s: number) => (s < 0.5 ? bez(SEG1, s * 2) : bez(SEG2, (s - 0.5) * 2));
export const D3: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const draw = stage === 0 ? ease(f, 14, 110) : 1;
  const travel = stage === 3 ? ease(f, 30, 200) : 0;
  const trail = Array.from({ length: 36 }, (_, i) => i / 35);
  const dim = stage === 2 ? 0.0 : 1;
  const dashed = (sg: number[][]) => `M${sg[0][0]},${sg[0][1]} C${sg[1][0]},${sg[1][1]} ${sg[2][0]},${sg[2][1]} ${sg[3][0]},${sg[3][1]}`;
  return (
    <Paper>
      <rect x={1180} y={0} width={740} height={1080} fill={SEA} />
      {/* mountain */}
      <path d="M200,140 L900,140 L980,400 L1000,700 L1010,1080 L120,1080 Z" fill={ROCK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${260 + i * 8},${230 + i * 120} Q${600},${180 + i * 120} ${940 - i * 4},${260 + i * 120}`} fill="none" stroke="#5a4c3e" strokeWidth={3} />
      ))}
      <path d="M1010,0 L1090,300 L1050,700 L1080,1080 L1180,1080 L1180,0 Z" fill={SAND} />
      <path d="M1010,0 L1090,300 L1050,700 L1080,1080" fill="none" stroke={INK} strokeWidth={5} />
      <text x={560} y={150} textAnchor="middle" fontFamily={SERIF} fontSize={30} fill="#e7d9b8" letterSpacing={6} opacity={0.0} />
      {/* Persian camp and army */}
      {Array.from({ length: 40 }, (_, i) => (
        <Dot key={i} x={520 + (random("cx" + i) - 0.5) * 220} y={110 + (random("cy" + i) - 0.5) * 120} />
      ))}
      {Array.from({ length: 70 }, (_, i) => (
        <Dot key={"m" + i} x={1090 + (random("mx" + i) - 0.5) * 120} y={200 + random("my" + i) * 230} />
      ))}
      {/* Greek line at the pass */}
      {Array.from({ length: 5 }, (_, i) => (
        <Unit key={i} x={1060 + i * 22 - 44} y={480} s={1.05} />
      ))}
      {/* the track */}
      <g opacity={dim}>
        <path d={dashed(SEG1)} fill="none" stroke={stage >= 3 ? RED : "#4d3a22"} strokeWidth={9} strokeDasharray="22 14" strokeLinecap="round" />
        <path d={dashed(SEG2)} fill="none" stroke={stage >= 3 ? RED : "#4d3a22"} strokeWidth={9} strokeDasharray="22 14" strokeLinecap="round" opacity={draw > 0.5 ? 1 : 0} />
      </g>
      {stage === 0 && (
        <g>
          {trail.map((s, i) => (s <= draw ? <circle key={i} cx={pathPoint(s)[0]} cy={pathPoint(s)[1]} r={3} fill={GOLD} /> : null))}
          <Card x={560} y={850} text="THE ANOPAIA PATH" at={40} f={f} size={34} to={pathPoint(0.78) as [number, number]} />
          <Card x={600} y={330} text="MOUNT KALLIDROMON" at={16} f={f} size={32} />
        </g>
      )}
      {stage >= 1 &&
        Array.from({ length: 34 }, (_, i) => (
          <rect key={i} x={440 + (random("px" + i) - 0.5) * 80} y={600 + (random("py" + i) - 0.5) * 80} width={14} height={18} rx={3} fill="#c9a063" stroke={INK} strokeWidth={2} opacity={stage >= 1 ? ease(f, i, i + 8) : 0} />
        ))}
      {stage === 1 && <Card x={300} y={720} text="1,000 PHOCIANS GUARD IT" at={20} f={f} size={32} to={[440, 650]} />}
      {stage === 2 && (
        <g>
          <Card x={1500} y={150} text="THE PLAN: THE PASS IS THE ONLY WAY" at={8} f={f} size={32} />
          <g opacity={ease(f, 10, 25)}>
            <circle cx={1060} cy={560} r={70} fill="none" stroke={GOLD} strokeWidth={8} />
          </g>
        </g>
      )}
      {stage === 3 && (
        <g>
          {Array.from({ length: 14 }, (_, i) => {
            const s = Math.max(0, travel * 1.1 - i * 0.025);
            const p = pathPoint(Math.min(1, s));
            return <Dot key={i} x={p[0]} y={p[1]} o={s > 0 ? 1 : 0} r={8} />;
          })}
          <Card x={1500} y={150} text="BUT THERE WAS ANOTHER WAY" at={8} f={f} size={32} />
        </g>
      )}
      <Card x={1330} y={640} text="THE PASS" at={6} f={f} size={32} to={[1070, 560]} />
    </Paper>
  );
};

// ---------------- D4: the last stand ----------------
const PASS_ROAD = "M880,330 L1040,330 L1040,780 L880,780 Z";
export const D4: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const allies = Array.from({ length: 40 }, (_, i) => i);
  const march = ease(f, 10, 140);
  const adv = stage >= 1 ? ease(f, 10, 90) : 0;
  const spread = stage >= 2 ? ease(f, 6, 70) : 0;
  return (
    <Paper>
      <rect x={1040} y={0} width={880} height={1080} fill={SEA} />
      <path d="M0,0 L1500,0 L1040,330 L1040,780 L1100,1080 L0,1080 Z" fill={SAND} />
      <path d="M0,0 L400,0 L880,330 L880,780 L820,1080 L0,1080 Z" fill={ROCK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d={PASS_ROAD} fill="#e6d4a8" />
      <path d="M1500,0 L1040,330 L1040,780 L1100,1080" fill="none" stroke={INK} strokeWidth={5} />
      <text x={960} y={560} textAnchor="middle" fontFamily={SERIF} fontSize={26} fill="#6b4f36" letterSpacing={5} transform="rotate(-90 960 560)" opacity={0.65}>THE NARROW PASS</text>
      <text x={1260} y={260} textAnchor="middle" fontFamily={SERIF} fontSize={28} fill="#6b4f36" opacity={0.7} letterSpacing={6}>OPEN GROUND</text>
      {/* Persians to the north */}
      {Array.from({ length: 130 }, (_, i) => {
        const nx = 480 + random("nx" + i) * 760;
        const ny = 30 + random("ny" + i) * 110;
        const toward = stage >= 2 ? spread * 70 : 0;
        return <Dot key={i} x={nx + (stage >= 2 ? (880 + 80 - nx) * spread * 0.0 : 0)} y={ny + toward} o={0.95} />;
      })}
      {/* the Immortals arrive from behind */}
      {stage >= 2 &&
        Array.from({ length: 36 }, (_, i) => (
          <Dot key={"b" + i} x={900 + (random("bx" + i) - 0.3) * 130} y={1020 - spread * 250 + random("by" + i) * 50} r={8} o={spread} />
        ))}
      {/* allies leaving southward */}
      {allies.map((i) => {
        const y0 = 360 + (i % 8) * 38;
        const y = y0 + march * 520 * (stage === 0 ? 1 : 1);
        const x = 905 + Math.floor(i / 8) * 28;
        return <Dot key={i} x={x} y={Math.min(y, 1060)} c="#c9a063" r={8} o={stage >= 1 ? 0 : 1} />;
      })}
      {stage === 0 && <Card x={1450} y={380} text="ALLIES MARCH SOUTH" at={14} f={f} size={32} />}
      {stage === 0 && <Card x={1450} y={560} text="THE REARGUARD STAYS" at={40} f={f} size={32} to={[960, 360]} />}
      {/* the rearguard: Spartans + Thespians in red */}
      {Array.from({ length: 21 }, (_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const x = 903 + col * 22;
        const y = 360 - adv * 180 + row * 30 - (stage >= 2 ? spread * 30 : 0);
        return <Unit key={i} x={x} y={y} o={1} s={0.9} />;
      })}
      {stage === 1 && <Card x={1450} y={300} text="OUT ONTO OPEN GROUND" at={30} f={f} size={32} to={[980, 190]} />}
      {stage === 2 && <Card x={1450} y={330} text="THE PASS IS NO LONGER HOLDING" at={20} f={f} size={32} />}
      {stage === 2 && <Card x={1450} y={450} text="SURROUNDED" at={40} f={f} size={40} />}
    </Paper>
  );
};

// ---------------- D5: Salamis and what followed ----------------
export const D5: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const cards: [string, string, string][] = [
    ["480 BC", "THERMOPYLAE", "A DELAY"],
    ["480 BC", "SALAMIS", "THE FLEET DESTROYED"],
    ["479 BC", "PLATAEA", "THE ARMY BEATEN"],
  ];
  return (
    <Paper>
      <rect width={1920} height={1080} fill={stage === 0 ? SEA : SAND} />
      {stage === 0 && (
        <g>
          <path d="M0,0 L760,0 Q820,260 1000,420 Q1200,600 1400,700 L1400,1080 L0,1080 Z" fill={LAND} stroke={INK} strokeWidth={5} />
          <path d="M1920,0 L1920,1080 L1500,1080 Q1300,760 1100,540 Q960,380 940,0 Z" fill={LAND} stroke={INK} strokeWidth={5} />
          {Array.from({ length: 34 }, (_, i) => {
            const t = (i % 17) / 16;
            const x = 840 + t * 520 + (random("sx" + i) - 0.5) * 60 + Math.sin(f / 18 + i) * 3;
            const y = 150 + t * 520 + (random("sy" + i) - 0.5) * 70;
            return <Ship key={i} x={x - 20} y={y} c={BLUE} r={42} s={0.8} />;
          })}
          {Array.from({ length: 10 }, (_, i) => (
            <Ship key={"g" + i} x={760 + i * 36} y={540 + (i % 2) * 28 + Math.sin(f / 15 + i) * 3} c={RED} r={-20} s={0.8} />
          ))}
          <Card x={560} y={90} text="THE NARROW CHANNEL" at={10} f={f} size={36} />
          <Card x={1450} y={200} text="TOO MANY SHIPS FOR THE SPACE" at={34} f={f} size={32} />
        </g>
      )}
      {stage >= 1 && (
        <g>
          <line x1={240} y1={540} x2={1680} y2={540} stroke="#6b4f36" strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" />
          {cards.map((c, i) => {
            const o = ease(f, 8 + i * 22, 24 + i * 22);
            const x = 480 + i * 480;
            return (
              <g key={i} opacity={o} transform={`translate(0 ${(1 - o) * 20})`}>
                <rect x={x - 220} y={330} width={440} height={420} rx={14} fill="#efe3c8" stroke="#6b4f36" strokeWidth={4} />
                <text x={x} y={410} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={44} fill={RED}>{c[0]}</text>
                <text x={x} y={540} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={38} fill="#2a2118" letterSpacing={2}>{c[1]}</text>
                <text x={x} y={650} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={26} fill="#6b4f36" letterSpacing={1}>{c[2]}</text>
              </g>
            );
          })}
          {stage === 2 && <Card x={960} y={860} text="THE GROUND DOES THE FIGHTING" at={20} f={f} size={44} />}
        </g>
      )}
    </Paper>
  );
};

export const DIAGRAMS: Record<string, React.FC<{ stage: number }>> = { D1, D2, D3, D4, D5 };
