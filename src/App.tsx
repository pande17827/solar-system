import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Starfield from "./components/Starfield";
import Orrery from "./components/Orrery";
import InfoPanel from "./components/InfoPanel";
import ControlBar from "./components/ControlBar";
import { OrbitMark } from "./components/icons";
import { BASE_DAYS_PER_SEC, PLANETS, SUN, bodyById, type Body } from "./data/bodies";

const PANEL_W = 382;

interface View {
  simDays: number;
  cx: number;
  cy: number;
  maxR: number;
}

const initView = (): View => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    simDays: 0,
    cx: w / 2,
    cy: h / 2 - 8,
    maxR: Math.max(90, Math.min(h / 2 - 100, w / 2 - 44)),
  };
};

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`h-8 rounded-full border px-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
        active
          ? "border-ember/60 bg-ember/10 text-ember-bright"
          : "border-line text-dim hover:border-faint hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function RailItem({
  body,
  active,
  onClick,
}: {
  body: Body;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="group flex items-center gap-2.5 py-[5px] pr-2">
      <span
        className="h-2.5 w-2.5 rounded-full transition-transform duration-200 group-hover:scale-125"
        style={{
          background: body.base,
          boxShadow: active ? `0 0 0 3px ${body.base}33, 0 0 14px ${body.base}` : `0 0 6px ${body.base}66`,
        }}
      />
      <span
        className={`text-[9.5px] font-semibold uppercase tracking-[0.2em] transition-all duration-200 ${
          active ? "text-ember-bright opacity-100" : "text-dim opacity-0 group-hover:opacity-100"
        }`}
      >
        {body.name}
      </span>
    </button>
  );
}

export default function App() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [view, setView] = useState<View>(initView);
  const [playing, setPlaying] = useState<boolean>(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [speed, setSpeed] = useState(5);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [everSelected, setEverSelected] = useState(false);

  const sizeRef = useRef(size);
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const selRef = useRef(selectedId);
  sizeRef.current = size;
  playingRef.current = playing;
  speedRef.current = speed;
  selRef.current = selectedId;

  const rootRef = useRef<HTMLDivElement>(null);

  /* measure */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      const next = { w: r.width, h: r.height };
      sizeRef.current = next;
      setSize(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* animation loop — sim time + eased camera */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      setView((v) => {
        const { w, h } = sizeRef.current;
        const isDesktop = w >= 768;
        const hasSel = selRef.current !== null;
        const panelOpen = hasSel && isDesktop;
        const sheetOpen = hasSel && !isDesktop;

        let targetCx = w / 2;
        let targetCy = h / 2 - 8;
        let targetR: number;
        if (panelOpen) {
          targetCx = (w - PANEL_W) / 2;
          targetR = Math.min(h / 2 - 100, (w - PANEL_W) / 2 - 44);
        } else if (sheetOpen) {
          const top = 92;
          const bottom = h * 0.38 - 68;
          targetCy = (top + bottom) / 2;
          targetR = Math.min((bottom - top) / 2 - 14, w / 2 - 22);
        } else {
          targetR = Math.min(h / 2 - 100, w / 2 - 44);
        }
        targetR = Math.max(80, targetR);

        const k = 1 - Math.pow(0.002, dt);
        const simDays =
          v.simDays + (playingRef.current ? dt * BASE_DAYS_PER_SEC * speedRef.current : 0);
        return {
          simDays,
          cx: v.cx + (targetCx - v.cx) * k,
          cy: v.cy + (targetCy - v.cy) * k,
          maxR: v.maxR + (targetR - v.maxR) * k,
        };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* selection */
  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) setEverSelected(true);
  }, []);

  const cycle = useCallback((dir: 1 | -1) => {
    setEverSelected(true);
    setSelectedId((prev) => {
      if (!prev || prev === "sun") {
        return dir === 1 ? PLANETS[0].id : PLANETS[PLANETS.length - 1].id;
      }
      const i = PLANETS.findIndex((p) => p.id === prev);
      return PLANETS[(i + dir + PLANETS.length) % PLANETS.length].id;
    });
  }, []);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        cycle(e.key === "ArrowRight" ? 1 : -1);
      } else if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycle]);

  const selected = bodyById(selectedId);

  return (
    <div ref={rootRef} className="fixed inset-0 overflow-hidden bg-abyss font-body text-ink">
      <Starfield />

      <Orrery
        w={size.w}
        h={size.h}
        cx={view.cx}
        cy={view.cy}
        maxR={view.maxR}
        simDays={view.simDays}
        selectedId={selectedId}
        hoveredId={hoveredId}
        everSelected={everSelected}
        showOrbits={showOrbits}
        showLabels={showLabels}
        onSelect={handleSelect}
        onHover={setHoveredId}
      />

      {/* header */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-5 py-4 md:px-8 md:py-5">
        <div>
          <div className="flex items-center gap-2.5">
            <OrbitMark className="h-6 w-6 md:h-7 md:w-7" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.34em] text-ember md:text-[10px]">
              Live orbital model
            </span>
          </div>
          <h1 className="font-display mt-1.5 text-[21px] font-bold leading-none text-ink md:text-[30px]">
            The Solar System
          </h1>
          <p className="mt-2 hidden text-xs text-dim md:block">
            Eight worlds in motion — sizes &amp; spacing compressed for clarity, periods true to life.
          </p>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <Toggle active={showOrbits} onClick={() => setShowOrbits((s) => !s)}>
            Orbits
          </Toggle>
          <Toggle active={showLabels} onClick={() => setShowLabels((s) => !s)}>
            Labels
          </Toggle>
        </div>
      </header>

      {/* planet rail */}
      <nav
        aria-label="Planets"
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-start md:flex md:left-6"
      >
        <RailItem body={SUN} active={selectedId === "sun"} onClick={() => handleSelect("sun")} />
        <div className="my-1 h-px w-6 bg-line" />
        {PLANETS.map((p) => (
          <RailItem key={p.id} body={p} active={selectedId === p.id} onClick={() => handleSelect(p.id)} />
        ))}
      </nav>

      <ControlBar
        playing={playing}
        speed={speed}
        simDays={view.simDays}
        onTogglePlay={() => setPlaying((p) => !p)}
        onReset={() => setView((v) => ({ ...v, simDays: 0 }))}
        onSpeedChange={setSpeed}
      />

      <InfoPanel
        body={selected}
        simDays={view.simDays}
        onClose={() => setSelectedId(null)}
        onPrev={() => cycle(-1)}
        onNext={() => cycle(1)}
      />
    </div>
  );
}
