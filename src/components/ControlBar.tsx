import { BASE_DAYS_PER_SEC, SPEEDS, fmtNum } from "../data/bodies";
import { PauseIcon, PlayIcon, ResetIcon } from "./icons";

interface ControlBarProps {
  playing: boolean;
  speed: number;
  simDays: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onSpeedChange: (s: number) => void;
}

function formatMissionClock(days: number): string {
  const years = Math.floor(days / 365.25);
  const rem = Math.floor(days - years * 365.25);
  return years > 0
    ? `${years}y ${String(rem).padStart(3, "0")}d`
    : `${Math.floor(days)}d`;
}

export default function ControlBar({
  playing,
  speed,
  simDays,
  onTogglePlay,
  onReset,
  onSpeedChange,
}: ControlBarProps) {
  const daysPerSec = BASE_DAYS_PER_SEC * speed;
  const caption =
    daysPerSec >= 365.25
      ? `${(daysPerSec / 365.25).toFixed(1)} yr`
      : `${fmtNum(Math.round(daysPerSec))} days`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line/80 bg-[#070c1a]/90 backdrop-blur-md">
      <div className="flex h-[68px] items-center gap-3 overflow-x-auto px-3 md:h-[78px] md:gap-5 md:overflow-visible md:px-7">
        {/* transport */}
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={onTogglePlay}
            aria-label={playing ? "Pause simulation" : "Play simulation"}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-ember text-[#241503] shadow-[0_0_26px_rgba(245,174,69,0.35)] transition-all duration-200 hover:scale-[1.07] hover:bg-ember-bright active:scale-95"
          >
            {playing ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 translate-x-[1px]" />
            )}
          </button>
          <button
            onClick={onReset}
            aria-label="Reset mission clock"
            title="Reset mission clock"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-dim transition-all duration-300 hover:-rotate-180 hover:border-ember/40 hover:text-ember-bright"
          >
            <ResetIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden h-9 w-px shrink-0 bg-line md:block" />

        {/* time warp */}
        <div className="flex shrink-0 items-center gap-2.5 md:gap-4">
          <div className="hidden shrink-0 flex-col gap-1 md:flex">
            <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-faint">
              Time warp
            </span>
            <span className="text-[10px] text-faint tabular-nums">1s ≈ {caption}</span>
          </div>
          <div className="flex shrink-0 gap-1">
            {SPEEDS.map((s) => {
              const active = s === speed;
              return (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  aria-pressed={active}
                  className={`h-8 rounded-md px-2.5 text-[11px] font-bold transition-all duration-200 ${
                    active
                      ? "bg-ember text-[#241503] shadow-[0_0_16px_rgba(245,174,69,0.3)]"
                      : "border border-line/80 text-dim hover:border-faint hover:text-ink"
                  }`}
                >
                  ×{s}
                </button>
              );
            })}
          </div>
        </div>

        {/* mission clock */}
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <div className="hidden flex-col items-end lg:flex">
            <span className="text-[9.5px] text-faint">SPACE play/pause · ← → worlds · ESC close</span>
          </div>
          <div className="hidden h-8 w-px bg-line lg:block" />
          <div className="flex items-center gap-2">
            {playing ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
              </span>
            ) : (
              <span className="h-2 w-2 shrink-0 rounded-full bg-faint" />
            )}
            <div className="flex flex-col items-end leading-tight">
              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.26em] text-faint md:block">
                Mission clock
              </span>
              <p className="font-display text-[13px] font-semibold text-ink tabular-nums md:text-sm">
                T+ {formatMissionClock(simDays)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
