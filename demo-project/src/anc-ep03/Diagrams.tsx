import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Arrow, BLUE, Card, Dot, GOLD, INK, Paper, RED, ROCK, SAND, SEA, SERIF, Unit, ease } from "../anc-lib/kit";

// Alesia diagrams (episode 3). Romans red, Gauls blue, gold for cavalry and highlights. Keep everything above y~860: subtitles sit below.
void SAND;

const GRASS = "#c9bb7f";
const CX = 960;
const CY = 440;

const Ring: React.FC<{ rx: number; ry: number; t: number; color: string; w?: number; towers?: number; out?: 1 | -1 }> = ({ rx, ry, t, color, w = 10, towers = 18, out = 1 }) => (
  <g>
    <ellipse cx={CX} cy={CY} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={w + 6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
    <ellipse cx={CX} cy={CY} rx={rx} ry={ry} fill="none" stroke={color} strokeWidth={w} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
    {Array.from({ length: towers }, (_, i) => {
      const a = (i / towers) * Math.PI * 2 - Math.PI / 2;
      const u = (i / towers);
      const on = t >= u;
      return on ? <rect key={i} x={CX + Math.cos(a) * rx * out - 7} y={CY + Math.sin(a) * ry * out - 7} width={14} height={14} fill="#efe3c8" stroke={INK} strokeWidth={2.5} /> : null;
    })}
  </g>
);

// ---------------- F1: the siege map ----------------
export const F1: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const inner = stage === 1 ? ease(f, 12, 80) : stage >= 2 ? 1 : 0;
  const outer = stage === 2 ? ease(f, 12, 90) : stage >= 3 ? 1 : 0;
  return (
    <Paper slow={0.6}>
      <rect width={1920} height={1080} fill={GRASS} />
      {Array.from({ length: 30 }, (_, i) => (
        <ellipse key={i} cx={random("gx" + i) * 1920} cy={70 + random("gy" + i) * 760} rx={40 + random("gr" + i) * 60} ry={8 + random("gq" + i) * 10} fill="#00000012" />
      ))}
      {/* two rivers */}
      <path d="M560,80 Q640,300 700,440 T640,820" fill="none" stroke={SEA} strokeWidth={34} strokeLinecap="round" />
      <path d="M1360,80 Q1280,300 1220,440 T1280,820" fill="none" stroke={SEA} strokeWidth={34} strokeLinecap="round" />
      {/* the hill and town */}
      <ellipse cx={CX} cy={CY} rx={230} ry={150} fill={ROCK} stroke={INK} strokeWidth={6} />
      <ellipse cx={CX} cy={CY} rx={150} ry={92} fill="#8a7a66" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 36 }, (_, i) => (
        <Dot key={i} x={CX + (random("ax" + i) - 0.5) * 220} y={CY + (random("ay" + i) - 0.5) * 120} r={6} />
      ))}
      <Card x={CX} y={CY - 8} text="ALESIA" at={4} f={f} size={26} />
      {stage === 0 && <Card x={420} y={430} text="TWO RIVERS" at={14} f={f} size={28} />}
      {stage === 0 && <Card x={1500} y={430} text="STEEP HILL" at={24} f={f} size={28} to={[1160, 440]} />}
      {stage === 0 && <Card x={960} y={760} text="ROMANS ARRIVE ON THE PLAIN" at={34} f={f} size={30} />}
      {/* the Roman rings */}
      {stage >= 1 && <Ring rx={340} ry={235} t={inner} color={RED} towers={22} />}
      {stage >= 2 && <Ring rx={500} ry={340} t={outer} color="#8a1f1f" w={9} towers={30} />}
      {stage === 1 && <Card x={1500} y={190} text="INNER LINE: 11 MILES" at={50} f={f} size={28} />}
      {stage === 1 && <Card x={1500} y={270} text="ABOUT 16 KILOMETERS" at={64} f={f} size={26} />}
      {stage === 2 && <Card x={1500} y={150} text="OUTER LINE: 14 MILES" at={50} f={f} size={28} />}
      {stage === 2 && <Card x={1500} y={230} text="ABOUT 21 KILOMETERS" at={64} f={f} size={26} />}
      {/* Romans in the strip between the rings and their moving reserves */}
      {stage >= 3 &&
        Array.from({ length: 22 }, (_, i) => {
          const a = (i / 22) * Math.PI * 2;
          return <Unit key={i} x={CX + Math.cos(a) * 420} y={CY + Math.sin(a) * 288} s={0.8} o={ease(f, 4 + i * 1.2, 14 + i * 1.2)} />;
        })}
      {stage === 3 && (
        <g>
          <Arrow x1={CX - 420} y1={CY + 20} x2={CX - 330} y2={CY - 190} color={GOLD} p={ease(f, 20, 70)} w={12} />
          <Arrow x1={CX + 420} y1={CY - 20} x2={CX + 330} y2={CY + 190} color={GOLD} p={ease(f, 40, 90)} w={12} />
          <Card x={1650} y={110} text="ROMANS HOLD THE GROUND BETWEEN" at={10} f={f} size={24} />
          <Card x={1650} y={180} text="RESERVES MOVE SHORT DISTANCES" at={36} f={f} size={24} />
          <Card x={360} y={760} text="THE ENEMY OUTSIDE MUST MARCH AROUND" at={64} f={f} size={26} />
        </g>
      )}
      {/* the relief army outside */}
      {stage >= 4 &&
        Array.from({ length: 120 }, (_, i) => {
          const side = i % 3;
          const x = side === 0 ? 180 + random("rx" + i) * 260 : side === 1 ? 1500 + random("rx" + i) * 260 : 600 + random("rx" + i) * 700;
          const y = side === 2 ? 40 + random("ry" + i) * 50 : 200 + random("ry" + i) * 460;
          return <Dot key={i} x={x} y={y} r={7} o={ease(f, 4, 30)} />;
        })}
      {stage === 4 && (
        <g>
          <Arrow x1={440} y1={440} x2={CX - 520} y2={CY} color={BLUE} p={ease(f, 20, 70)} w={12} />
          <Arrow x1={1500} y1={440} x2={CX + 520} y2={CY} color={BLUE} p={ease(f, 30, 80)} w={12} />
          <Arrow x1={CX - 240} y1={CY} x2={CX - 340} y2={CY} color={BLUE} p={ease(f, 40, 80)} w={10} />
          <Arrow x1={CX + 240} y1={CY} x2={CX + 340} y2={CY} color={BLUE} p={ease(f, 40, 80)} w={10} />
          <Card x={310} y={720} text="RELIEF ARMY" at={20} f={f} size={30} />
          <Card x={1620} y={720} text="THE TOWN BREAKS OUT FROM INSIDE" at={50} f={f} size={26} />
        </g>
      )}
      {/* the northern hill */}
      {stage >= 5 && (
        <g>
          <path d="M760,70 L960,-10 L1160,70 L1120,170 L800,170 Z" fill={ROCK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {Array.from({ length: 6 }, (_, i) => (
            <Unit key={i} x={900 + i * 24} y={205} s={0.8} />
          ))}
          <Card x={960} y={96} text="THE HILL TO THE NORTH" at={6} f={f} size={26} />
        </g>
      )}
      {stage === 5 && (
        <g>
          <Arrow x1={960} y1={60} x2={960} y2={196} color={BLUE} p={ease(f, 30, 80)} w={16} />
          <Card x={1500} y={190} text="60,000 PICKED MEN FROM BEHIND THE HILL" at={20} f={f} size={26} />
          <Card x={1500} y={270} text="THE ROMAN CAMP SITS ON THE SLOPE" at={40} f={f} size={26} />
        </g>
      )}
      {stage === 6 && (
        <g>
          <path d={`M${CX + 520},${CY + 120} Q${CX + 700},${CY - 120} ${CX + 420},${CY - 360} Q${CX + 150},${CY - 480} ${CX},${CY - 400}`} fill="none" stroke={GOLD} strokeWidth={12} strokeDasharray="20 14" strokeLinecap="round" strokeDashoffset={-f * 1.6} />
          <Arrow x1={CX + 300} y1={CY - 420} x2={CX + 40} y2={CY - 392} color={GOLD} p={ease(f, 20, 70)} w={12} />
          <Card x={1650} y={110} text="CAVALRY RIDES AROUND THE OUTER LINE" at={10} f={f} size={24} />
          <Card x={1650} y={180} text="AND HITS THE GAULS FROM BEHIND" at={36} f={f} size={24} />
        </g>
      )}
    </Paper>
  );
};

// ---------------- F2: the wall in cross-section (not to scale) ----------------
export const F2: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const G = 600; // ground line
  return (
    <Paper slow={0.4}>
      <rect width={1920} height={1080} fill="#cfe0e8" />
      <rect x={0} y={G} width={1920} height={400} fill="#a6865a" />
      <path d={`M0,${G} L1920,${G}`} stroke={INK} strokeWidth={6} />
      <text x={220} y={180} fontFamily={SERIF} fontWeight={700} fontSize={30} fill="#3f6a80" letterSpacing={5}>GAULS APPROACH</text>
      <Arrow x1={180} y1={230} x2={400} y2={230} color={BLUE} p={1} w={10} />
      <text x={1520} y={180} fontFamily={SERIF} fontWeight={700} fontSize={30} fill="#7a1f1f" letterSpacing={5}>ROMANS</text>
      {/* the first trench */}
      {stage >= 0 && (
        <g opacity={ease(f, 4, 20)}>
          <rect x={880} y={G} width={150} height={120} fill="#5a4630" stroke={INK} strokeWidth={5} />
        </g>
      )}
      {/* two more ditches, the inner one flooded */}
      {stage >= 1 && (
        <g opacity={ease(f, 4, 24)}>
          <rect x={1060} y={G} width={90} height={110} fill="#5a4630" stroke={INK} strokeWidth={5} />
          <rect x={1170} y={G} width={90} height={110} fill={SEA} stroke={INK} strokeWidth={5} />
        </g>
      )}
      {/* rampart, palisade and tower */}
      {stage >= 2 && (
        <g opacity={ease(f, 4, 26)}>
          <path d={`M1290,${G} L1350,${G - 150} L1560,${G - 150} L1620,${G} Z`} fill="#8a6a3a" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${1360 + i * 24},${G - 150} l0,-50 l9,-14 l9,14 l0,50 Z`} fill="#c9a063" stroke={INK} strokeWidth={3} />
          ))}
          <rect x={1520} y={G - 330} width={90} height={150} fill="#b08a4e" stroke={INK} strokeWidth={5} />
          <path d={`M1510,${G - 330} L1565,${G - 380} L1620,${G - 330} Z`} fill="#7a3f2a" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <Unit x={1480} y={G - 178} s={1.2} />
        </g>
      )}
      {/* obstacles in front of the ditches */}
      {stage >= 3 && (
        <g opacity={ease(f, 4, 26)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={"c" + i} d={`M${760 + i * 22},${G} l-30,-36 M${760 + i * 22},${G} l8,-44 M${760 + i * 22},${G} l36,-30`} stroke="#e7d9b8" strokeWidth={7} strokeLinecap="round" />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={"l" + i}>
              <rect x={470 + i * 44} y={G} width={26} height={44} fill="#5a4630" stroke={INK} strokeWidth={3} />
              <path d={`M${483 + i * 44},${G + 44} l0,-30 l-5,0 l5,-12 l5,12 l-5,0`} fill="#e7d9b8" stroke={INK} strokeWidth={2} />
            </g>
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={"s" + i} d={`M${290 + i * 36},${G} l0,-14 l8,-8 l8,8 l0,14`} fill="#cfcfcf" stroke={INK} strokeWidth={3} />
          ))}
        </g>
      )}
      {/* labels */}
      {stage === 0 && <Card x={950} y={760} text="A TRENCH, 20 FEET WIDE, STRAIGHT SIDES" at={24} f={f} size={28} to={[955, G + 70]} />}
      {stage === 1 && <Card x={1100} y={760} text="TWO MORE DITCHES, THE INNER ONE FLOODED" at={30} f={f} size={28} to={[1215, G + 60]} />}
      {stage === 2 && <Card x={1500} y={760} text="RAMPART, PALISADE AND TOWERS" at={30} f={f} size={28} to={[1450, G - 60]} />}
      {stage === 3 && (
        <g>
          <Card x={1160} y={110} text="STAKES, PITS AND IRON HOOKS" at={10} f={f} size={30} />
          <Card x={780} y={760} text="SHARPENED TRUNKS" at={30} f={f} size={26} to={[800, G - 20]} />
          <Card x={520} y={700} text="THE PITS THE SOLDIERS CALLED LILIES" at={44} f={f} size={26} to={[540, G + 20]} />
          <Card x={300} y={780} text="HOOKS BURIED IN WOOD" at={56} f={f} size={26} to={[330, G - 6]} />
        </g>
      )}
      <text x={960} y={920} textAnchor="middle" fontFamily={SERIF} fontSize={22} fill="#e8dcc0" opacity={0.8}>Schematic, not to scale.</text>
    </Paper>
  );
};

// ---------------- F3: army sizes ----------------
export const F3: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const n = (v: number) => v.toLocaleString("en-US");
  const bar = (y: number, label: string, v: number, c: string, a: number, note?: string, dashed?: boolean) => {
    const t = ease(f, a, a + 40);
    const w = (v / 250000) * 1400 * t;
    return (
      <g>
        <text x={160} y={y - 14} fontFamily={SERIF} fontWeight={700} fontSize={30} fill="#2a2118" letterSpacing={3}>{label}</text>
        <rect x={160} y={y} width={w} height={58} rx={8} fill={dashed ? "none" : c} stroke={dashed ? c : INK} strokeWidth={dashed ? 5 : 4} strokeDasharray={dashed ? "16 10" : undefined} />
        <text x={160 + w + 16} y={y + 42} fontFamily={SERIF} fontWeight={700} fontSize={32} fill="#2a2118" opacity={t}>{n(v)}{note ?? ""}</text>
      </g>
    );
  };
  return (
    <Paper slow={0.3}>
      <rect width={1920} height={1080} fill="#e6d4a8" />
      <text x={160} y={90} fontFamily={SERIF} fontWeight={700} fontSize={44} fill="#2a2118" letterSpacing={6}>THE ARMIES AT ALESIA</text>
      {bar(210, "ROMANS (A MODERN ESTIMATE)", 55000, RED, 4, " OR SO")}
      {bar(350, "GAULS IN THE TOWN (CAESAR)", 80000, BLUE, 12)}
      {stage >= 1 && bar(520, "RELIEF ARMY (CAESAR'S FIGURE)", 250000, BLUE, 4, undefined, true)}
      {stage >= 1 && bar(660, "RELIEF ARMY (MODERN ESTIMATE)", 100000, BLUE, 30, " OR FEWER")}
      {stage >= 1 && <Card x={1400} y={760} text="CAESAR WROTE THE ACCOUNT HIMSELF" at={70} f={f} size={28} />}
      <text x={160} y={850} fontFamily={SERIF} fontSize={24} fill="#6b4f36">All figures are uncertain.</text>
    </Paper>
  );
};

// ---------------- F4: three days ----------------
export const F4: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  void stage;
  const items: [string, string, string][] = [
    ["DAY 1", "THE CAVALRY BATTLE", "GERMAN HORSE WIN"],
    ["DAY 2", "THE NIGHT ASSAULT", "BEATEN OFF AT DAWN"],
    ["DAY 3", "THE NORTHERN HILL", "CAVALRY HITS THE REAR"],
  ];
  return (
    <Paper slow={0.4}>
      <rect width={1920} height={1080} fill="#e6d4a8" />
      <line x1={260} y1={470} x2={1660} y2={470} stroke="#6b4f36" strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" />
      {items.map((c, i) => {
        const o = ease(f, 6 + i * 24, 22 + i * 24);
        const x = 480 + i * 480;
        return (
          <g key={i} opacity={o} transform={`translate(0 ${(1 - o) * 20})`}>
            <rect x={x - 210} y={290} width={420} height={380} rx={14} fill="#efe3c8" stroke="#6b4f36" strokeWidth={4} />
            <text x={x} y={380} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={48} fill={RED}>{c[0]}</text>
            <text x={x} y={490} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={34} fill="#2a2118" letterSpacing={2}>{c[1]}</text>
            <text x={x} y={590} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={26} fill="#6b4f36">{c[2]}</text>
          </g>
        );
      })}
    </Paper>
  );
};

export const DIAGRAMS: Record<string, React.FC<{ stage: number }>> = { F1, F2, F3, F4 };
