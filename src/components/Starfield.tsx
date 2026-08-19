import { memo, useMemo, type CSSProperties } from "react";

interface StarSpec {
  left: number;
  top: number;
  size: number;
  delay: number;
  dur: number;
}

const Starfield = memo(function Starfield() {
  const stars = useMemo<StarSpec[]>(
    () =>
      Array.from({ length: 150 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() < 0.85 ? 1 + Math.random() : 2 + Math.random() * 1.4,
        delay: Math.random() * 6,
        dur: 2.6 + Math.random() * 4.5,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* deep space base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 38%, #0d1730 0%, #081022 44%, #050811 100%)",
        }}
      />
      {/* milky band */}
      <div
        className="absolute -inset-[20%] opacity-[0.16]"
        style={{
          background:
            "linear-gradient(115deg, transparent 34%, rgba(150,180,230,0.22) 46%, rgba(190,205,240,0.30) 50%, rgba(150,180,230,0.18) 55%, transparent 68%)",
          transform: "rotate(-8deg)",
        }}
      />
      {/* nebulas */}
      <div
        className="nebula"
        style={{
          width: "46vw",
          height: "34vh",
          left: "-8vw",
          top: "8vh",
          background:
            "radial-gradient(closest-side, rgba(46,108,146,0.34), transparent 70%)",
        }}
      />
      <div
        className="nebula"
        style={{
          width: "40vw",
          height: "38vh",
          right: "-6vw",
          bottom: "-4vh",
          background:
            "radial-gradient(closest-side, rgba(140,84,44,0.20), transparent 70%)",
          animationDelay: "-9s",
        }}
      />
      <div
        className="nebula"
        style={{
          width: "26vw",
          height: "30vh",
          right: "16vw",
          top: "2vh",
          background:
            "radial-gradient(closest-side, rgba(64,86,160,0.22), transparent 72%)",
          animationDelay: "-17s",
        }}
      />
      {/* stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--delay": `${s.delay}s`,
              "--dur": `${s.dur}s`,
            } as CSSProperties
          }
        />
      ))}
      {/* occasional meteors */}
      <span
        className="shooting-star"
        style={
          {
            right: "6vw",
            top: "14vh",
            "--delay": "5s",
            "--shoot-dur": "13s",
          } as CSSProperties
        }
      />
      <span
        className="shooting-star"
        style={
          {
            right: "-4vw",
            top: "48vh",
            "--delay": "11.5s",
            "--shoot-dur": "17s",
          } as CSSProperties
        }
      />
      {/* vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 80% at 50% 45%, transparent 55%, rgba(3,5,12,0.55) 100%)",
        }}
      />
    </div>
  );
});

export default Starfield;
