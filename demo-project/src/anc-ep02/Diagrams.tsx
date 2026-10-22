import React from "react";
import { random, useCurrentFrame } from "remotion";
import { Arrow, BLUE, Card, Dot, GOLD, INK, LAND, Paper, RED, ROCK, SAND, SEA, SERIF, Unit, ease } from "../anc-lib/kit";

// Cannae diagrams (episode 2). Romans red, Carthaginians blue and gold. Primitives live in ../anc-lib/kit.tsx.
// Keep everything above y~860: subtitles sit in the bottom band.
void SAND;

const Blk: React.FC<{ x: number; y: number; w?: number; h?: number; c?: string; o?: number }> = ({ x, y, w = 22, h = 22, c = BLUE, o = 1 }) => (
  <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4} fill={c} stroke={INK} strokeWidth={2.2} opacity={o} />
);

// ---------------- E1: Italy and the road to Cannae ----------------
const ITALY = "M560,170 L900,200 L1040,300 L1070,430 L1260,560 L1400,660 L1330,720 L1190,680 L1090,700 L1020,800 L940,900 L870,860 L900,740 L830,640 L720,540 L650,400 Z";
const ROUTE: [number, number][] = [[720, 120], [790, 300], [900, 440], [1030, 560], [1170, 650]];
export const E1: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const t = ease(f, 6, 80);
  const pt = (k: number) => ROUTE[k];
  const upto = stage === 0 ? 1 : stage === 1 ? 2 : stage === 2 ? 3 : 4;
  const seg = (a: number, b: number, p: number) => [pt(a)[0] + (pt(b)[0] - pt(a)[0]) * p, pt(a)[1] + (pt(b)[1] - pt(a)[1]) * p];
  const lines: React.ReactNode[] = [];
  for (let k = 0; k < upto; k++) {
    const last = k === upto - 1;
    const p = last && stage <= 3 ? t : 1;
    const e = seg(k, k + 1, p);
    lines.push(<line key={k} x1={pt(k)[0]} y1={pt(k)[1]} x2={e[0]} y2={e[1]} stroke={BLUE} strokeWidth={10} strokeDasharray="22 14" strokeLinecap="round" />);
  }
  return (
    <Paper>
      <rect width={1920} height={1080} fill={SEA} />
      <path d={ITALY} fill={LAND} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* the Alps */}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${540 + i * 62},170 l30,-70 l30,70 Z`} fill={ROCK} stroke={INK} strokeWidth={3} />
      ))}
      <Card x={640} y={40} text="THE ALPS" at={4} f={f} size={30} />
      {lines}
      {stage >= 1 && <Dot x={790} y={300} r={13} c={RED} o={ease(f, 40, 52)} />}
      {stage >= 1 && <Card x={560} y={300} text="TREBIA, 218 BC" at={40} f={f} size={28} to={[790, 300]} />}
      {stage >= 2 && <Dot x={900} y={440} r={13} c={RED} />}
      {stage >= 2 && <Card x={640} y={440} text="LAKE TRASIMENE, 217 BC" at={20} f={f} size={28} to={[900, 440]} />}
      {stage >= 3 && <Dot x={1170} y={650} r={15} c={GOLD} />}
      {stage >= 3 && <Card x={1500} y={640} text="CANNAE, 216 BC" at={20} f={f} size={30} to={[1180, 650]} />}
      <g opacity={ease(f, 4, 14)}>
        <rect x={866} y={526} width={32} height={32} rx={4} fill={RED} stroke={INK} strokeWidth={3} />
        <text x={880} y={606} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={30} fill="#2a2118">ROME</text>
      </g>
      {stage === 0 && <Card x={1380} y={250} text="HANNIBAL, 218 BC" at={30} f={f} size={32} />}
      {stage >= 4 && (
        <g>
          {[[1010, 600], [930, 600], [960, 640], [880, 640]].map((p, i) => (
            <Dot key={i} x={p[0]} y={p[1]} r={9} c={RED} />
          ))}
          <Dot x={1010} y={660} r={14} c={BLUE} o={ease(f, 30, 50)} />
          <Card x={1390} y={720} text="CAPUA GOES OVER TO HANNIBAL" at={30} f={f} size={26} to={[1020, 665]} />
          <Card x={450} y={720} text="MOST ALLIES HOLD" at={14} f={f} size={28} to={[900, 630]} />
          <Card x={1390} y={300} text="ROME REFUSES TO NEGOTIATE" at={50} f={f} size={28} />
        </g>
      )}
    </Paper>
  );
};

// ---------------- E2: army sizes ----------------
export const E2: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const row = (y: number, label: string, rome: number, carth: number, max: number, a: number, fmt: (n: number) => string) => {
    const t = ease(f, a, a + 40);
    return (
      <g>
        <text x={160} y={y - 30} fontFamily={SERIF} fontWeight={700} fontSize={36} fill="#2a2118" letterSpacing={4}>{label}</text>
        <rect x={160} y={y} width={(rome / max) * 1500 * t} height={66} rx={8} fill={RED} stroke={INK} strokeWidth={4} />
        <text x={160 + (rome / max) * 1500 * t + 16} y={y + 46} fontFamily={SERIF} fontWeight={700} fontSize={36} fill="#2a2118" opacity={t}>{fmt(rome)}</text>
        <rect x={160} y={y + 100} width={(carth / max) * 1500 * t} height={66} rx={8} fill={BLUE} stroke={INK} strokeWidth={4} />
        <text x={160 + (carth / max) * 1500 * t + 16} y={y + 146} fontFamily={SERIF} fontWeight={700} fontSize={36} fill="#2a2118" opacity={t}>{fmt(carth)}</text>
      </g>
    );
  };
  const n = (v: number) => v.toLocaleString("en-US");
  return (
    <Paper slow={0.4}>
      <rect width={1920} height={1080} fill="#e6d4a8" />
      <text x={160} y={90} fontFamily={SERIF} fontWeight={700} fontSize={44} fill="#2a2118" letterSpacing={6}>THE TWO ARMIES AT CANNAE</text>
      <g transform="translate(1180 70)">
        <rect width={40} height={26} fill={RED} stroke={INK} strokeWidth={3} />
        <text x={56} y={22} fontFamily={SERIF} fontWeight={700} fontSize={28} fill="#2a2118">ROME</text>
        <rect x={190} width={40} height={26} fill={BLUE} stroke={INK} strokeWidth={3} />
        <text x={246} y={22} fontFamily={SERIF} fontWeight={700} fontSize={28} fill="#2a2118">HANNIBAL</text>
      </g>
      {row(240, "INFANTRY", 80000, 40000, 80000, 6, n)}
      {stage >= 1 && row(560, "CAVALRY", 6000, 10000, 80000, 4, n)}
      {stage >= 1 && <Card x={1200} y={760} text="HANNIBAL HAD MORE CAVALRY" at={50} f={f} size={32} />}
      {stage === 0 && <Card x={1200} y={500} text="ROME HAD TWICE THE INFANTRY" at={50} f={f} size={32} />}
      <text x={160} y={850} fontFamily={SERIF} fontSize={24} fill="#6b4f36">Figures from Polybius; the totals are uncertain.</text>
    </Paper>
  );
};

// ---------------- field geometry shared by E3 and E4 ----------------
const RIVER_Y = 800;
const Field: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#d9c58f" />
    <rect x={0} y={RIVER_Y - 10} width={1920} height={110} fill={SEA} />
    <path d={`M0,${RIVER_Y - 10} L1920,${RIVER_Y - 10}`} stroke={INK} strokeWidth={5} />
    {Array.from({ length: 24 }, (_, i) => (
      <ellipse key={i} cx={random("fx" + i) * 1920} cy={140 + random("fy" + i) * 600} rx={30 + random("fr" + i) * 40} ry={6 + random("fq" + i) * 8} fill="#00000014" />
    ))}
  </g>
);

const romanInfantry = (x0: number, o: number, compress = 0) => {
  const out: React.ReactNode[] = [];
  const rows = 13;
  const cols = 9;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const cx = x0 + c * (24 - compress * 6);
      const cy = 330 + r * (23 - compress * 5) + compress * 55;
      out.push(<Unit key={`${r}-${c}`} x={cx} y={cy} o={o} s={0.78 - compress * 0.12} />);
    }
  return out;
};

const crescent = (shift: number, o: number) => {
  // centre line of Gauls and Spaniards: an arc bulging towards the Romans (left); `shift` pushes the middle back (positive = right)
  const out: React.ReactNode[] = [];
  for (let layer = 0; layer < 3; layer++)
    for (let i = 0; i <= 18; i++) {
      const u = i / 18;
      const y = 330 + u * 310;
      const bulge = Math.sin(u * Math.PI);
      const x = 1010 - bulge * 130 * (1 - shift) + shift * bulge * 40 + layer * 22 + (shift > 0.6 ? bulge * (shift - 0.6) * 120 : 0);
      out.push(<Dot key={`${layer}-${i}`} x={x} y={y} r={8} c={BLUE} o={o} />);
    }
  return out;
};

// ---------------- E3: deployment ----------------
export const E3: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const oR = stage >= 1 ? 1 : 0;
  const oC = stage >= 2 ? 1 : 0;
  return (
    <Paper slow={0.5}>
      <g transform="translate(960 430) scale(1.12) translate(-960 -430)">
      <Field />
      <text x={960} y={RIVER_Y - 24} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={30} fill="#3f6a80" letterSpacing={10}>RIVER AUFIDUS</text>
      {/* wind and dust: right to left, into Roman faces */}
      {stage === 0 &&
        [0, 1, 2, 3, 4].map((i) => {
          const x = ((1700 - f * 4 - i * 220) % 1500) + 300;
          return <Arrow key={i} x1={x + 160} y1={260 + i * 100} x2={x} y2={260 + i * 100} color="#c9a063" p={1} w={10} />;
        })}
      {stage === 0 && <Card x={1300} y={160} text="WIND AND DUST BLOW TOWARD ROME" at={30} f={f} size={28} />}
      {stage === 0 && <Card x={420} y={430} text="ROMANS FACE THIS WAY" at={20} f={f} size={26} />}
      {/* Romans */}
      <g opacity={oR}>
        {romanInfantry(560, ease(f, 4, 30))}
        {Array.from({ length: 5 }, (_, i) => (
          <Unit key={"rc" + i} x={640 + i * 30} y={725} o={1} s={0.9} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={"ac" + i} x={600 + i * 28} y={200} width={20} height={26} rx={4} fill="#d4695f" stroke={INK} strokeWidth={2.5} />
        ))}
      </g>
      {stage === 1 && <Card x={660} y={110} text="DEEP, PACKED INFANTRY" at={20} f={f} size={30} />}
      {stage === 1 && <Card x={1150} y={440} text="THE AIM: PUNCH THROUGH THE CENTRE" at={50} f={f} size={28} />}
      {stage === 1 && <Arrow x1={800} y1={480} x2={1180} y2={480} color={RED} p={ease(f, 50, 100)} w={14} />}
      {/* Carthaginians */}
      <g opacity={oC}>
        {crescent(stage >= 3 ? ease(f, 20, 90) * (stage === 4 ? 1.35 : 0.6) : 0, ease(f, 4, 24))}
        <g opacity={ease(f, 20, 40)}>
          {Array.from({ length: 4 }, (_, i) =>
            Array.from({ length: 4 }, (_, j) => (
              <React.Fragment key={`${i}-${j}`}>
                <Blk x={1130 + i * 26} y={290 + j * 26} c="#1f3a73" />
                <Blk x={1130 + i * 26} y={585 + j * 26} c="#1f3a73" />
              </React.Fragment>
            ))
          )}
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={"hc" + i} x={900 + i * 30} y={712} width={26} height={30} rx={5} fill={GOLD} stroke={INK} strokeWidth={2.5} />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <rect key={"nc" + i} x={900 + i * 28} y={200} width={20} height={26} rx={4} fill="#e9c97a" stroke={INK} strokeWidth={2.5} />
          ))}
        </g>
      </g>
      {stage === 2 && <Card x={880} y={110} text="GAULS AND SPANIARDS: THE CRESCENT" at={20} f={f} size={28} />}
      {stage === 2 && <Card x={1500} y={430} text="LIBYANS HELD BACK ON THE ENDS" at={44} f={f} size={26} to={[1180, 330]} />}
      {stage === 2 && <Card x={1390} y={710} text="HEAVY CAVALRY BY THE RIVER" at={66} f={f} size={26} to={[960, 727]} />}
      {stage === 3 && <Card x={1180} y={130} text="THE CENTRE GIVES GROUND, STEP BY STEP" at={30} f={f} size={28} />}
      {stage === 3 && <Arrow x1={900} y1={480} x2={1060} y2={480} color={GOLD} p={ease(f, 20, 80)} w={12} />}
      {stage === 4 && (
        <g>
          <Card x={1180} y={130} text="IF THE CENTRE COLLAPSES TOO FAST..." at={20} f={f} size={28} />
          <Card x={1180} y={210} text="...THE TRAP FAILS" at={50} f={f} size={32} />
          <g opacity={ease(f, 40, 60)}>
            <line x1={940} y1={430} x2={1020} y2={530} stroke={RED} strokeWidth={14} strokeLinecap="round" />
            <line x1={1020} y1={430} x2={940} y2={530} stroke={RED} strokeWidth={14} strokeLinecap="round" />
          </g>
        </g>
      )}
    </g>
    </Paper>
  );
};

// ---------------- E4: the battle ----------------
export const E4: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const p = (a: number, b: number) => ease(f, a, b);
  const romanCavAlive = stage === 0 ? 1 - p(40, 90) : stage >= 1 ? 0 : 1;
  // Carthaginian heavy cavalry path (stage 1+): along the river, then behind the Roman line to the far wing
  const hc = stage === 0 ? [940 - p(10, 60) * 150, 727] : stage === 1 ? (() => { const u = p(8, 110); const x = 800 - Math.sin(u * Math.PI) * 360 - u * 60; return [x, 727 - u * 520]; })() : [740, 215];
  const compress = stage === 4 ? ease(f, 6, 50) : stage === 3 ? 0.1 : 0;
  const advance = stage === 2 ? p(6, 90) * 90 : stage >= 3 ? 90 : 0;
  return (
    <Paper slow={0.5}>
      <g transform="translate(960 430) scale(1.12) translate(-960 -430)">
      <Field />
      <text x={960} y={RIVER_Y - 24} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={30} fill="#3f6a80" letterSpacing={10}>RIVER AUFIDUS</text>
      {/* Roman infantry (advances in stage 2, is squeezed in stage 4) */}
      <g>{romanInfantry(560 + advance - compress * 20, 1, compress)}</g>
      {/* allied cavalry: routed from stage 1 */}
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={"ac" + i} x={600 + i * 28} y={200 - (stage >= 1 ? p(70, 120) * 10 : 0)} width={20} height={26} rx={4} fill="#d4695f" stroke={INK} strokeWidth={2.5} opacity={stage >= 1 ? 1 - p(80, 130) : 1} />
      ))}
      {/* Roman citizen cavalry by the river */}
      {Array.from({ length: 5 }, (_, i) => (
        <Unit key={"rc" + i} x={640 + i * 30} y={725} o={romanCavAlive} s={0.9} />
      ))}
      {/* Carthaginian centre: crescent flattens then folds inward as the Romans advance */}
      {crescent(stage >= 2 ? Math.min(1.4, p(6, 90) * 1.4) : 0, 1)}
      {/* Libyans: stand until stage 3, then wheel inward */}
      {Array.from({ length: 4 }, (_, i) =>
        Array.from({ length: 4 }, (_, j) => {
          const w = stage >= 3 ? p(6, 70) : 0;
          return (
            <React.Fragment key={`${i}-${j}`}>
              <Blk x={1130 + i * 26 - w * 300} y={290 + j * 26 + w * 90} c="#1f3a73" />
              <Blk x={1130 + i * 26 - w * 300} y={585 + j * 26 - w * 90} c="#1f3a73" />
            </React.Fragment>
          );
        })
      )}
      {/* Numidians keep the allied horse busy; heavy cavalry */}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={"nc" + i} x={900 + i * 28 - (stage >= 1 ? p(60, 120) * 160 : 0)} y={200} width={20} height={26} rx={4} fill="#e9c97a" stroke={INK} strokeWidth={2.5} />
      ))}
      {stage <= 2 &&
        Array.from({ length: 5 }, (_, i) => (
          <rect key={"hc" + i} x={hc[0] + i * 30 - 70} y={hc[1] - 18 + (i % 2) * 6} width={26} height={30} rx={5} fill={GOLD} stroke={INK} strokeWidth={2.5} />
        ))}
      {stage >= 3 &&
        Array.from({ length: 5 }, (_, i) => (
          <rect key={"hc" + i} x={440 + advance * 0.2 + (stage === 3 ? p(60, 100) * 40 : 40)} y={440 + i * 28} width={26} height={30} rx={5} fill={GOLD} stroke={INK} strokeWidth={2.5} />
        ))}
      {/* captions per stage */}
      {stage === 0 && <Card x={900} y={640} text="THE RIVER-SIDE CAVALRY CLASH" at={10} f={f} size={28} />}
      {stage === 0 && <Card x={1420} y={700} text="ROMAN HORSE CRUSHED" at={60} f={f} size={26} />}
      {stage === 1 && <Arrow x1={900} y1={730} x2={560} y2={520} color={GOLD} p={p(10, 100)} w={10} />}
      {stage === 1 && <Card x={1300} y={640} text="HASDRUBAL RIDES BEHIND THE ROMAN LINE" at={20} f={f} size={28} />}
      {stage === 2 && <Card x={1180} y={130} text="THE ROMANS PUSH THE CENTRE BACK" at={20} f={f} size={28} />}
      {stage === 2 && <Arrow x1={800} y1={480} x2={1000} y2={480} color={RED} p={p(10, 70)} w={14} />}
      {stage === 3 && (
        <g>
          <Arrow x1={1000} y1={310} x2={860} y2={380} color={BLUE} p={p(10, 60)} w={12} />
          <Arrow x1={1000} y1={650} x2={860} y2={580} color={BLUE} p={p(10, 60)} w={12} />
          <Arrow x1={460} y1={480} x2={560} y2={480} color={GOLD} p={p(30, 80)} w={12} />
          <Card x={1260} y={130} text="THE LIBYANS WHEEL IN. THE CAVALRY CLOSES THE BACK." at={20} f={f} size={26} />
        </g>
      )}
      {stage === 4 && (
        <g>
          <rect x={570} y={318} width={170} height={340} rx={10} fill="none" stroke={GOLD} strokeWidth={6} strokeDasharray="14 10" opacity={ease(f, 30, 50)} />
          <Card x={1260} y={130} text="ONLY THE EDGES CAN REACH THE ENEMY" at={20} f={f} size={28} />
          <Card x={1260} y={210} text="EVERYONE ELSE IS JUST WEIGHT" at={50} f={f} size={28} />
        </g>
      )}
    </g>
    </Paper>
  );
};

// ---------------- E6: timeline and verdict ----------------
export const E6: React.FC<{ stage: number }> = ({ stage }) => {
  const f = useCurrentFrame();
  const items: [string, string, string][] = [
    ["216 BC", "CANNAE", "THE PERFECT VICTORY"],
    ["211 BC", "NEAR ROME", "HANNIBAL TURNS AWAY"],
    ["203 BC", "LEAVES ITALY", "AFTER 13 YEARS"],
    ["202 BC", "ZAMA", "SCIPIO WINS"],
  ];
  return (
    <Paper slow={0.4}>
      <rect width={1920} height={1080} fill="#e6d4a8" />
      {stage === 0 && (
        <g>
          <line x1={200} y1={480} x2={1720} y2={480} stroke="#6b4f36" strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" />
          {items.map((c, i) => {
            const o = ease(f, 8 + i * 20, 24 + i * 20);
            const x = 330 + i * 420;
            return (
              <g key={i} opacity={o} transform={`translate(0 ${(1 - o) * 20})`}>
                <rect x={x - 190} y={300} width={380} height={360} rx={14} fill="#efe3c8" stroke="#6b4f36" strokeWidth={4} />
                <text x={x} y={380} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={44} fill={RED}>{c[0]}</text>
                <text x={x} y={490} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={36} fill="#2a2118" letterSpacing={2}>{c[1]}</text>
                <text x={x} y={580} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={25} fill="#6b4f36">{c[2]}</text>
              </g>
            );
          })}
        </g>
      )}
      {stage >= 1 && (
        <g>
          {[["THE BATTLE", "WON", BLUE, 560], ["THE WAR", "LOST", RED, 1360]].map((c, i) => {
            const o = ease(f, 6 + i * 26, 24 + i * 26);
            return (
              <g key={i} opacity={o} transform={`translate(0 ${(1 - o) * 24})`}>
                <rect x={(c[3] as number) - 300} y={260} width={600} height={420} rx={16} fill="#efe3c8" stroke="#6b4f36" strokeWidth={5} />
                <text x={c[3] as number} y={380} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={50} fill="#2a2118" letterSpacing={4}>{c[0] as string}</text>
                <text x={c[3] as number} y={560} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={120} fill={c[2] as string}>{c[1] as string}</text>
              </g>
            );
          })}
          <Card x={960} y={760} text="HANNIBAL, 216 BC" at={60} f={f} size={34} />
        </g>
      )}
    </Paper>
  );
};

export const DIAGRAMS: Record<string, React.FC<{ stage: number }>> = { E1, E2, E3, E4, E6 };
