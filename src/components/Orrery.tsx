import { useMemo } from "react";
import { PLANETS, SUN, type Body } from "../data/bodies";

const Y_K = 0.86; // slight vertical squash for depth
const TWO_PI = Math.PI * 2;

interface OrreryProps {
  w: number;
  h: number;
  cx: number;
  cy: number;
  maxR: number;
  simDays: number;
  selectedId: string | null;
  hoveredId: string | null;
  everSelected: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

interface AsteroidSpec {
  angle: number;
  frac: number;
  size: number;
  opacity: number;
}

function BodyGradients() {
  return (
    <>
      {[SUN, ...PLANETS].map((b) => (
        <radialGradient key={b.id} id={`pg-${b.id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={b.hi} />
          <stop offset="46%" stopColor={b.base} />
          <stop offset="100%" stopColor={b.deep} />
        </radialGradient>
      ))}
      {PLANETS.map((b) => (
        <radialGradient key={`g-${b.id}`} id={`glow-${b.id}`}>
          <stop offset="0%" stopColor={b.glow} stopOpacity="0.5" />
          <stop offset="60%" stopColor={b.glow} stopOpacity="0.14" />
          <stop offset="100%" stopColor={b.glow} stopOpacity="0" />
        </radialGradient>
      ))}
      <radialGradient id="sun-glow">
        <stop offset="0%" stopColor="#ffbe5a" stopOpacity="0.55" />
        <stop offset="45%" stopColor="#ff9e3c" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#ff9e3c" stopOpacity="0" />
      </radialGradient>
    </>
  );
}

export default function Orrery({
  w,
  h,
  cx,
  cy,
  maxR,
  simDays,
  selectedId,
  hoveredId,
  everSelected,
  showOrbits,
  showLabels,
  onSelect,
  onHover,
}: OrreryProps) {
  const asteroids = useMemo<AsteroidSpec[]>(
    () =>
      Array.from({ length: 130 }, () => ({
        angle: Math.random() * TWO_PI,
        frac: 0.485 + Math.random() * 0.095,
        size: 0.6 + Math.random() * 1.1,
        opacity: 0.18 + Math.random() * 0.4,
      })),
    []
  );

  const sunR = Math.min(26, Math.max(15, maxR * 0.078));
  const anySelected = selectedId !== null;

  const planetPos = (b: Body) => {
    const r = b.orbitFrac * maxR;
    const a = b.angle0 + (TWO_PI * simDays) / (b.periodDays ?? 1);
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Y_K * Math.sin(a),
      r,
    };
  };

  const earth = PLANETS[2];
  const earthPos = planetPos(earth);

  return (
    <svg
      width={w}
      height={h}
      className="absolute inset-0 z-10"
      onClick={() => onSelect(null)}
    >
      <defs>
        <BodyGradients />
        {PLANETS.map((b) => (
          <clipPath key={`clip-${b.id}`} id={`clip-${b.id}`}>
            <circle r={b.visualR} />
          </clipPath>
        ))}
      </defs>

      {/* Kuiper-belt whisper beyond Neptune */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={maxR * 1.075}
        ry={maxR * 1.075 * Y_K}
        fill="none"
        stroke="#9db4d8"
        strokeOpacity={0.07}
        strokeDasharray="2 11"
      />

      {/* orbits */}
      {showOrbits &&
        PLANETS.map((b) => {
          const sel = selectedId === b.id;
          const hov = hoveredId === b.id;
          return (
            <ellipse
              key={`o-${b.id}`}
              cx={cx}
              cy={cy}
              rx={b.orbitFrac * maxR}
              ry={b.orbitFrac * maxR * Y_K}
              fill="none"
              stroke={sel ? "#f5ae45" : "#9db4d8"}
              strokeWidth={sel ? 1.4 : 1}
              strokeOpacity={sel ? 0.85 : hov ? 0.4 : anySelected ? 0.1 : 0.17}
              strokeDasharray={sel ? "4 7" : undefined}
              className={sel ? "animate-dash" : undefined}
              style={{ transition: "stroke-opacity .4s" }}
            />
          );
        })}

      {/* asteroid belt, drifting with sim time */}
      <g>
        {asteroids.map((s, i) => {
          const a = s.angle + (TWO_PI * simDays) / 1700;
          const rr = s.frac * maxR;
          return (
            <circle
              key={i}
              cx={cx + rr * Math.cos(a)}
              cy={cy + rr * Y_K * Math.sin(a)}
              r={s.size}
              fill="#8fa0bd"
              opacity={s.opacity}
            />
          );
        })}
      </g>

      {/* the Sun */}
      <g
        transform={`translate(${cx} ${cy})`}
        style={{ cursor: "pointer", transition: "opacity .5s" }}
        opacity={anySelected && selectedId !== "sun" ? 0.75 : 1}
        onMouseEnter={() => onHover("sun")}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("sun");
        }}
      >
        <circle
          r={sunR * 3.4}
          fill="url(#sun-glow)"
          className="animate-breathe spin-center"
        />
        <circle r={sunR * 1.75} fill="url(#sun-glow)" opacity={0.8} />
        <circle
          r={sunR}
          fill="url(#pg-sun)"
          stroke="rgba(255,210,140,0.65)"
          strokeWidth={1}
        />
        {(hoveredId === "sun" || selectedId === "sun") && (
          <circle
            r={sunR + 7}
            fill="none"
            stroke={selectedId === "sun" ? "#f5ae45" : "rgba(233,240,250,0.55)"}
            strokeWidth={1.2}
            strokeDasharray={selectedId === "sun" ? "3 7" : undefined}
            className={selectedId === "sun" ? "animate-dash" : undefined}
          />
        )}
        {showLabels && (
          <text
            y={-(sunR + 14)}
            textAnchor="middle"
            fill="#ffd894"
            fontSize={10.5}
            letterSpacing="0.22em"
            style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}
          >
            SUN
          </text>
        )}
        <circle r={sunR + 12} fill="transparent" />
      </g>

      {/* planets */}
      {PLANETS.map((b) => {
        const { x, y, r } = planetPos(b);
        const sel = selectedId === b.id;
        const hov = hoveredId === b.id;
        const showName = showLabels || sel || hov;
        const labelRight = x >= cx;
        const dimmed = anySelected && !sel;
        const vr = b.visualR;

        return (
          <g
            key={b.id}
            style={{ transition: "opacity .5s" }}
            opacity={dimmed ? 0.45 : 1}
          >
            <g transform={`translate(${x} ${y})`}>
              {/* halo */}
              {(hov || sel) && <circle r={vr * 2.4} fill={`url(#glow-${b.id})`} />}

              {/* rings behind-ish (Saturn) */}
              {b.hasRings && (
                <g transform="rotate(-16)">
                  <ellipse
                    rx={vr * 2}
                    ry={vr * 0.55}
                    fill="none"
                    stroke="#d8c08a"
                    strokeWidth={vr * 0.3}
                    opacity={0.5}
                  />
                  <ellipse
                    rx={vr * 1.58}
                    ry={vr * 0.42}
                    fill="none"
                    stroke="#a98f5c"
                    strokeWidth={vr * 0.13}
                    opacity={0.55}
                  />
                </g>
              )}

              {/* body */}
              <g
                style={{
                  transform: hov ? "scale(1.16)" : "scale(1)",
                  transition: "transform .3s cubic-bezier(.22,.9,.3,1)",
                  transformBox: "fill-box",
                  transformOrigin: "center",
                }}
              >
                <circle r={vr} fill={`url(#pg-${b.id})`} />
                {b.bands && (
                  <g clipPath={`url(#clip-${b.id})`} opacity={0.85}>
                    <rect x={-vr} y={-vr * 0.66} width={vr * 2} height={vr * 0.24} fill={b.deep} opacity={0.3} />
                    <rect x={-vr} y={-vr * 0.12} width={vr * 2} height={vr * 0.2} fill={b.deep} opacity={0.22} />
                    <rect x={-vr} y={vr * 0.34} width={vr * 2} height={vr * 0.24} fill={b.deep} opacity={0.26} />
                  </g>
                )}
                {b.spot && (
                  <ellipse
                    cx={vr * 0.32}
                    cy={vr * 0.32}
                    rx={vr * 0.26}
                    ry={vr * 0.16}
                    fill="#c4552f"
                    opacity={0.85}
                  />
                )}
              </g>

              {/* Earth's moon */}
              {b.hasMoon && (
                <g>
                  <circle r={vr + 7} fill="none" stroke="#9db4d8" strokeOpacity={0.14} />
                  <circle
                    cx={Math.cos((TWO_PI * simDays) / 27.3) * (vr + 7)}
                    cy={Math.sin((TWO_PI * simDays) / 27.3) * (vr + 7) * 0.9}
                    r={2.3}
                    fill="#cfd6e4"
                  />
                </g>
              )}

              {/* selection / hover rings */}
              {sel && (
                <circle
                  r={vr + 7}
                  fill="none"
                  stroke="#f5ae45"
                  strokeWidth={1.3}
                  strokeDasharray="3 7"
                  className="animate-dash"
                />
              )}
              {hov && !sel && (
                <circle r={vr + 5} fill="none" stroke="rgba(233,240,250,0.55)" strokeWidth={1} />
              )}

              {/* label */}
              {showName && (
                <text
                  x={labelRight ? vr + 12 : -(vr + 12)}
                  y={-(vr + 9)}
                  textAnchor={labelRight ? "start" : "end"}
                  fill={sel ? "#ffce7a" : "#c9d7ec"}
                  fontSize={11}
                  letterSpacing="0.14em"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  {b.name.toUpperCase()}
                </text>
              )}

              {/* first-visit hint, pinned to Earth */}
              {b.id === "earth" && !everSelected && (
                <g className="animate-floaty" opacity={0.95}>
                  <line
                    x1={vr + 6}
                    y1={-(vr + 4)}
                    x2={vr + 22}
                    y2={-(vr + 20)}
                    stroke="#ffce7a"
                    strokeWidth={1}
                  />
                  <text
                    x={vr + 26}
                    y={-(vr + 24)}
                    fill="#ffce7a"
                    fontSize={11}
                    letterSpacing="0.16em"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}
                  >
                    CLICK A PLANET
                  </text>
                </g>
              )}

              {/* generous hit area */}
              <circle
                r={Math.max(vr + 9, 16)}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => onHover(b.id)}
                onMouseLeave={() => onHover(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(b.id);
                }}
              />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
