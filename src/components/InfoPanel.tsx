import { useEffect, useState } from "react";
import {
  PLANETS,
  SUN,
  EARTH_DIAMETER,
  fmtNum,
  fmtTemp,
  type Body,
} from "../data/bodies";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./icons";

interface InfoPanelProps {
  body: Body | null;
  simDays: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function ProgressRing({
  pct,
  color,
}: {
  pct: number;
  color: string;
}) {
  const R = 20;
  const C = 2 * Math.PI * R;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
      <circle cx="28" cy="28" r={R} fill="none" stroke="#233250" strokeWidth="4" />
      <circle
        cx="28"
        cy="28"
        r={R}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C * (1 - pct)}
        transform="rotate(-90 28 28)"
        style={{ transition: "stroke-dashoffset .2s linear" }}
      />
      <text
        x="28"
        y="31.5"
        textAnchor="middle"
        fill="#e9f0fa"
        fontSize="10.5"
        fontWeight="600"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

export default function InfoPanel({
  body,
  simDays,
  onClose,
  onPrev,
  onNext,
}: InfoPanelProps) {
  const [shown, setShown] = useState<Body | null>(body);
  useEffect(() => {
    if (body) setShown(body);
  }, [body]);

  const open = body !== null;
  const b = shown;

  const idx = b ? PLANETS.findIndex((p) => p.id === b.id) : -1;
  const prev =
    b?.id === "sun" ? PLANETS[PLANETS.length - 1] : PLANETS[(idx + PLANETS.length - 1) % PLANETS.length];
  const next = b?.id === "sun" ? PLANETS[0] : PLANETS[(idx + 1) % PLANETS.length];

  const progress =
    b && b.periodDays ? ((simDays % b.periodDays) + b.periodDays) % b.periodDays / b.periodDays : null;
  const orbitDay = b?.periodDays ? Math.floor(simDays % b.periodDays) + 1 : null;
  const orbitsDone = b?.periodDays ? Math.floor(simDays / b.periodDays) : null;

  const scaleMax = b ? Math.max(b.diameterKm, EARTH_DIAMETER) : 1;
  const earthRatio = b ? b.diameterKm / EARTH_DIAMETER : 1;

  return (
    <aside
      aria-hidden={!open}
      className={`fixed z-40 border-line bg-panel/90 backdrop-blur-xl
        md:top-0 md:right-0 md:bottom-0 md:w-[382px] md:border-l
        max-md:inset-x-0 max-md:bottom-[68px] max-md:h-[62vh] max-md:rounded-t-xl max-md:border-t
        ${open ? "visible translate-x-0 translate-y-0" : "md:translate-x-full max-md:translate-y-full"}`}
      style={{
        transition: open
          ? "transform 500ms cubic-bezier(0.22,0.9,0.28,1)"
          : "transform 500ms cubic-bezier(0.22,0.9,0.28,1), visibility 0s 500ms",
        visibility: open ? "visible" : "hidden",
      }}
    >
      {b && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[3px] md:rounded-none max-md:rounded-t-xl"
            style={{
              background: `linear-gradient(90deg, transparent, ${b.base}, transparent)`,
            }}
          />
          <div className="panel-scroll h-full overflow-y-auto">
            <div key={b.id} className="flex min-h-full flex-col gap-6 p-6 md:p-7">
              <span className="mx-auto -mt-2 h-1 w-10 rounded-full bg-line md:hidden" />

              {/* heading */}
              <div className="rise" style={{ animationDelay: "0.02s" }}>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full border px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em]"
                    style={{
                      borderColor: `${b.accent}66`,
                      color: b.accent,
                      background: `${b.accent}14`,
                    }}
                  >
                    {b.kind}
                  </span>
                  {b.moons !== null && (
                    <span className="rounded-full border border-line px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-dim">
                      {b.moons} moon{b.moons === 1 ? "" : "s"}
                    </span>
                  )}
                  <button
                    onClick={onClose}
                    aria-label="Close details"
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-md border border-line text-dim transition-colors hover:border-ember/50 hover:text-ink"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="font-display mt-4 text-[27px] font-bold leading-tight text-ink">
                  {b.name}
                </h2>
                <span className="mt-2 block h-[3px] w-10 rounded-full" style={{ background: b.base }} />
                <p className="mt-3 text-[13px] italic leading-relaxed text-dim">{b.epithet}</p>
              </div>

              {/* live orbit progress */}
              {progress !== null && (
                <div
                  className="rise flex items-center gap-4 rounded-lg border border-line/70 bg-[#0d1630]/60 px-4 py-3.5"
                  style={{ animationDelay: "0.08s" }}
                >
                  <ProgressRing pct={progress} color={b.accent} />
                  <div>
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-faint">
                      Orbit progress · live
                    </p>
                    <p className="font-display mt-1 text-sm font-semibold text-ink tabular-nums">
                      Day {fmtNum(orbitDay ?? 0)}{" "}
                      <span className="text-dim">/ {fmtNum(b.periodDays ?? 0)}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-dim">
                      {fmtNum(orbitsDone ?? 0)} orbit{(orbitsDone ?? 0) === 1 ? "" : "s"} completed since launch
                    </p>
                  </div>
                </div>
              )}

              {/* stats */}
              <div className="rise grid grid-cols-2 gap-2.5" style={{ animationDelay: "0.14s" }}>
                <StatTile
                  label="Diameter"
                  value={`${fmtNum(b.diameterKm)} km`}
                  sub={`×${earthRatio >= 10 ? earthRatio.toFixed(0) : earthRatio.toFixed(earthRatio >= 1 ? 1 : 2)} Earth`}
                />
                <StatTile
                  label="Distance from Sun"
                  value={b.distanceMKm ? `${b.distanceMKm}M km` : "—"}
                  sub={b.au ? `${b.au} AU` : "centre of the system"}
                />
                <StatTile
                  label="Year length"
                  value={b.periodLabel}
                  sub={b.periodDays ? `${fmtNum(b.periodDays)} Earth days` : "one galactic orbit"}
                />
                <StatTile label="Day length" value={b.dayLength} sub="one full spin" />
                <StatTile
                  label="Temperature"
                  value={b.tempC !== null ? fmtTemp(b.tempC) : "—"}
                  sub={b.tempNote}
                />
                <StatTile
                  label="Moons"
                  value={b.moons !== null ? fmtNum(b.moons) : "—"}
                  sub="natural satellites"
                />
              </div>

              {/* scale check */}
              <div className="rise" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-baseline justify-between">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-faint">
                    Scale check
                  </p>
                  <p className="text-[10px] text-faint">diameter · linear</p>
                </div>
                <div className="mt-3 flex flex-col gap-2.5">
                  <ScaleBar
                    name={b.name}
                    pct={(b.diameterKm / scaleMax) * 100}
                    color={b.base}
                    km={b.diameterKm}
                  />
                  {b.id !== "earth" && b.id !== SUN.id && (
                    <ScaleBar
                      name="Earth"
                      pct={(EARTH_DIAMETER / scaleMax) * 100}
                      color="#8fb8de"
                      km={EARTH_DIAMETER}
                    />
                  )}
                </div>
              </div>

              {/* field note */}
              <div
                className="rise border-l-2 py-1 pl-4"
                style={{ borderColor: b.accent, animationDelay: "0.26s" }}
              >
                <p
                  className="text-[9.5px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: b.accent }}
                >
                  Field note
                </p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/85">{b.fact}</p>
              </div>

              {/* prev / next */}
              <div className="rise mt-auto flex gap-2 pt-2" style={{ animationDelay: "0.32s" }}>
                <button
                  onClick={onPrev}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-line px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-dim transition-colors hover:border-ember/50 hover:text-ink"
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" />
                  {prev.name}
                </button>
                <button
                  onClick={onNext}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-line px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-dim transition-colors hover:border-ember/50 hover:text-ink"
                >
                  {next.name}
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-line/70 bg-[#0d1630]/60 px-3.5 py-3">
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-faint">{label}</p>
      <p className="font-display mt-1.5 text-[14.5px] font-semibold leading-snug text-ink">{value}</p>
      <p className="mt-0.5 text-[11px] text-dim">{sub}</p>
    </div>
  );
}

function ScaleBar({
  name,
  pct,
  color,
  km,
}: {
  name: string;
  pct: number;
  color: string;
  km: number;
}) {
  return (
    <div className="grid grid-cols-[54px_1fr_64px] items-center gap-2.5">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-dim">{name}</span>
      <div className="h-3 overflow-hidden rounded-sm border border-line/50 bg-[#0d1630]">
        <div
          className="h-full rounded-sm"
          style={{
            width: `${Math.max(pct, 1.5)}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            transition: "width .7s cubic-bezier(.22,.9,.3,1)",
          }}
        />
      </div>
      <span className="text-right text-[10px] text-dim tabular-nums">{fmtNum(km)}</span>
    </div>
  );
}
