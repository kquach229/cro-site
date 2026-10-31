import { useEffect, useRef, useState } from "react";
import { useCountUp } from "./useCountUp.js";

const STAGES = ["Visit", "Product", "Cart", "Purchase"];
// Chance a visitor moves on from one stage to the next. Tune these to change the demo.
const RATES = {
  before: [0.65, 0.5, 0.6],
  after: [0.75, 0.6, 0.8],
};
const overall = (r) => r.reduce((a, b) => a * b, 1) * 100;

export default function FunnelDemo() {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("before");
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const [reduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const H = 230;
    const top = 36;
    const bottom = H - 16;
    const lane = (top + bottom) / 2;
    const pad = 40;
    let w = 0;
    let colors = {};
    let parts = [];
    let raf;
    let last = 0;
    let spawn = 0;

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      colors = {
        ink: s.getPropertyValue("--ink").trim(),
        line: s.getPropertyValue("--line").trim(),
        accent: s.getPropertyValue("--accent").trim(),
        pop: s.getPropertyValue("--pop").trim(),
      };
    };
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      canvas.width = w * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const gateX = (i) => pad + (i * (w - 2 * pad)) / (STAGES.length - 1);

    const spawnOne = () => {
      const rates = RATES[modeRef.current];
      let fate = -1; // -1 means this visitor buys
      for (let i = 0; i < rates.length; i++) {
        if (Math.random() > rates[i]) {
          fate = i;
          break;
        }
      }
      parts.push({
        x: gateX(0),
        y: lane + (Math.random() - 0.5) * 70,
        vy: 0,
        fate,
        state: "move",
        a: 1,
      });
    };

    const tick = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      spawn += dt;
      if (spawn > 0.12) {
        spawn = 0;
        spawnOne();
      }

      ctx.clearRect(0, 0, w, H);
      ctx.font = "600 13px 'DM Sans', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 2;
      STAGES.forEach((label, i) => {
        const x = gateX(i);
        ctx.strokeStyle = colors.line;
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();
        ctx.fillStyle = colors.ink;
        ctx.fillText(label, x, 20);
      });

      for (const p of parts) {
        if (p.state === "move") {
          p.x += 90 * dt;
          const dropX = p.fate >= 0 ? gateX(p.fate + 1) - 4 : Infinity;
          if (p.x >= dropX) p.state = "fall";
          else if (p.x >= gateX(3)) p.state = "win";
        } else if (p.state === "fall") {
          p.vy += 500 * dt;
          p.y += p.vy * dt;
          p.a -= dt * 0.9;
        } else {
          p.x += 90 * dt;
          p.a -= dt * 1.5;
        }
        ctx.globalAlpha = Math.max(p.a, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.state === "win" ? 5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = p.state === "win" ? colors.pop : colors.accent;
        ctx.fill();
        if (p.state === "win") {
          ctx.strokeStyle = colors.ink;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.lineWidth = 2;
        }
      }
      ctx.globalAlpha = 1;
      parts = parts.filter((p) => p.a > 0 && p.x < w + 20);
      raf = requestAnimationFrame(tick);
    };

    readColors();
    resize();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", readColors);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", readColors);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  const before = overall(RATES.before);
  const after = overall(RATES.after);
  const current = mode === "before" ? before : after;
  const shown = useCountUp(current);
  const lift = Math.round((after / before - 1) * 100);

  return (
    <div className="funnel">
      <div className="toggle" role="group" aria-label="Funnel version">
        <button
          type="button"
          aria-pressed={mode === "before"}
          onClick={() => setMode("before")}
        >
          Before
        </button>
        <button
          type="button"
          aria-pressed={mode === "after"}
          onClick={() => setMode("after")}
        >
          After
        </button>
      </div>
      {reduced ? null : (
        <canvas
          ref={canvasRef}
          aria-label="Animated funnel showing visitors dropping off at each stage"
          role="img"
        />
      )}
      <div className="readout">
        <span className="big">{Math.round(shown)}</span>
        <span>
          of every 100 visitors buy{mode === "after" ? ` (+${lift}%)` : ""}
        </span>
      </div>
    </div>
  );
}
