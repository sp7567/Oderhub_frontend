/**
 * components/SplashScreen.jsx
 * Premium cinematic splash with particles, shimmer, and typewriter animation.
 */

import { useEffect, useState, useRef } from "react";

const BRAND_1 = "Order"; // white
const BRAND_2 = "Hub";   // gradient purple
const FULL    = BRAND_1 + BRAND_2;
const TAGLINE = "MULTI-STORE ORDER MANAGEMENT";

// ─── Floating Particle ────────────────────────────────────────────────────────
const Particle = ({ style }) => (
  <div
    className="absolute rounded-full"
    style={{
      background: "radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)",
      animation: "particleFloat linear infinite",
      ...style,
    }}
  />
);

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  width:  Math.random() * 4 + 1,
  left:   Math.random() * 100,
  delay:  Math.random() * 8,
  dur:    Math.random() * 10 + 8,
  opacity: Math.random() * 0.5 + 0.2,
  bottom: Math.random() * 30,
}));

const SplashScreen = ({ onComplete }) => {
  const [visibleCount,  setVisibleCount]  = useState(0);
  const [coloredCount,  setColoredCount]  = useState(0); // letters that have transitioned from black → final color
  const [tagVisible,    setTagVisible]    = useState(false);
  const [shimmer,       setShimmer]       = useState(false);
  const [exiting,       setExiting]       = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const timers = [];

    // Type each letter — appears black first
    FULL.split("").forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 300 + i * 110));
      // 180ms after each letter appears, transition it from black → final color
      timers.push(setTimeout(() => setColoredCount(i + 1), 300 + i * 110 + 180));
    });

    const afterType = 300 + FULL.length * 110;

    timers.push(setTimeout(() => setShimmer(true),    afterType + 100));
    timers.push(setTimeout(() => setTagVisible(true), afterType + 300));
    timers.push(setTimeout(() => setExiting(true),    afterType + 1100));
    timers.push(setTimeout(() => {
      done.current = true;
      onComplete();
    }, afterType + 1800));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none
        transition-opacity duration-700 ease-in-out
        ${exiting ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ background: "#050510" }}
    >
      {/* ── Gradient mesh background ── */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 20% 80%, rgba(139,92,246,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 40% 50% at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 60%)
        `,
      }} />

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} style={{
          width:  `${p.width}px`,
          height: `${p.width}px`,
          left:   `${p.left}%`,
          bottom: `${p.bottom}%`,
          opacity: p.opacity,
          animationDuration: `${p.dur}s`,
          animationDelay:    `${p.delay}s`,
        }} />
      ))}

      {/* ── Outer glow ring ── */}
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          animation: "glow 4s ease-in-out infinite alternate",
        }}
      />

      {/* ── Logo block ── */}
      <div className="relative z-10 flex flex-col items-center gap-7">

        {/* Logo icon with ring */}
        <div className="relative flex items-center justify-center" style={{ animation: "logoIn 0.8s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          {/* Outer ring */}
          <div className="absolute w-28 h-28 rounded-[2rem] border border-indigo-500/20" style={{ animation: "ringPulse 3s ease-in-out infinite" }} />
          <div className="absolute w-36 h-36 rounded-[2.5rem] border border-indigo-500/10" style={{ animation: "ringPulse 3s 0.5s ease-in-out infinite" }} />

          {/* Icon */}
          <div
            className="relative w-20 h-20 rounded-[1.4rem] flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)",
              boxShadow: "0 0 60px rgba(99,102,241,0.5), 0 0 120px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            {/* Shimmer sweep */}
            <div
              className="absolute inset-0 rounded-[1.4rem] overflow-hidden"
              style={{ opacity: shimmer ? 1 : 0, transition: "opacity 0.3s" }}
            >
              <div style={{
                position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: shimmer ? "iconShimmer 0.8s ease forwards" : "none",
              }} />
            </div>
            <span className="text-white text-3xl font-black tracking-tight" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>O</span>
          </div>
        </div>

        {/* Typewriter brand name */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="flex items-center" style={{ fontFamily: "'SF Pro Display', 'Inter', sans-serif", letterSpacing: "-0.03em" }}>
            {FULL.split("").map((char, i) => {
              const isPurple   = i >= BRAND_1.length;
              const isVisible  = i < visibleCount;
              const isColored  = i < coloredCount;

              return (
                <span
                  key={i}
                  style={{
                    fontSize: "clamp(2.8rem, 8vw, 4.5rem)",
                    fontWeight: 800,
                    display: "inline-block",
                    // Slide in animation
                    opacity:   isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.85)",
                    transition: "opacity 0.2s ease, transform 0.25s cubic-bezier(0.34,1.4,0.64,1)",
                    // Color: starts black, transitions to final color
                    color: isColored
                      ? (isPurple ? "transparent" : "#ffffff")
                      : "#1a0533",            // near-black charcoal on dark bg
                    backgroundImage: isColored && isPurple
                      ? "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #c084fc 100%)"
                      : "none",
                    WebkitBackgroundClip: isColored && isPurple ? "text" : "unset",
                    backgroundClip:       isColored && isPurple ? "text" : "unset",
                    textShadow: isColored && !isPurple ? "0 0 40px rgba(255,255,255,0.15)" : "none",
                    filter: isColored && isPurple
                      ? "drop-shadow(0 0 20px rgba(167,139,250,0.6))"
                      : "none",
                    // Smooth color transition
                    transitionProperty: "opacity, transform, color, filter, text-shadow",
                    transitionDuration: "0.2s, 0.25s, 0.35s, 0.35s, 0.35s",
                    transitionTimingFunction: "ease",
                  }}
                >
                  {char}
                </span>
              );
            })}
            {/* Cursor */}
            <span style={{
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              fontWeight: 200,
              color: "#6366f1",
              opacity: visibleCount < FULL.length ? 1 : 0,
              transition: "opacity 0.4s",
              animation: "blink 0.65s step-end infinite",
              marginLeft: "4px",
            }}>|</span>
          </h1>

          {/* Tagline */}
          <div
            style={{
              opacity: tagVisible ? 1 : 0,
              transform: tagVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <p style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.35em",
              color: "rgba(167,139,250,0.5)",
              textTransform: "uppercase",
            }}>
              {TAGLINE}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="w-48 overflow-hidden rounded-full"
          style={{
            height: "2px",
            background: "rgba(255,255,255,0.07)",
            opacity: tagVisible ? 1 : 0,
            transition: "opacity 0.5s 0.3s",
          }}
        >
          <div style={{
            height: "100%",
            borderRadius: "9999px",
            background: "linear-gradient(90deg, #6366f1, #a78bfa, #6366f1)",
            backgroundSize: "200% 100%",
            animation: tagVisible ? "progressFill 1s ease forwards, shimmerBar 1.5s linear infinite" : "none",
          }} />
        </div>
      </div>

      <style>{`
        @keyframes logoIn {
          0%   { opacity:0; transform:scale(0.4) translateY(20px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes ringPulse {
          0%,100% { opacity:0.5; transform:scale(1); }
          50%      { opacity:1;   transform:scale(1.06); }
        }
        @keyframes glow {
          from { transform:scale(1); opacity:0.6; }
          to   { transform:scale(1.3); opacity:1; }
        }
        @keyframes blink {
          0%,100% { opacity:1; }
          50%      { opacity:0; }
        }
        @keyframes iconShimmer {
          from { left:-100%; }
          to   { left:160%;  }
        }
        @keyframes progressFill {
          from { width:0%;   }
          to   { width:100%; }
        }
        @keyframes shimmerBar {
          0%   { background-position:200% 0; }
          100% { background-position:-200% 0; }
        }
        @keyframes particleFloat {
          0%   { transform:translateY(0) scale(1); opacity:0.2; }
          50%  { opacity:1; }
          100% { transform:translateY(-100vh) scale(0.5); opacity:0; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
