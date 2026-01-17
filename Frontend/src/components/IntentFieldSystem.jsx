import { useEffect, useRef } from "react";

export default function IntentFieldSystem() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const DPR = window.devicePixelRatio || 1;

    let w, h, cy, t = 0;

    function resize() {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cy = h / 2;
    }

    resize();
    window.addEventListener("resize", resize);

    /* ========================= SYSTEM CONSTANTS ========================= */

    const STAGES = {
      INGEST: 0.18,
      INTENT: 0.32,
      ENCRYPT: 0.5,
      REPLICATE: 0.68,
      STORE: 0.85,
    };

    /* ========================= DATA PACKETS ========================= */

    const packets = Array.from({ length: 220 }).map(() => ({
      p: Math.random(),
      v: Math.random() * 0.6 + 0.4,
      seed: Math.random() * 100,
      integrity: Math.random(),
      size: Math.random() * 1.6 + 1.2,
    }));

    /* ========================= CORE PATH ========================= */

    function pathY(x, phase) {
      const pressure =
        x > w * STAGES.ENCRYPT - 40 && x < w * STAGES.ENCRYPT + 40
          ? 32
          : 18;

      return (
        cy +
        Math.sin(x * 0.0038 + phase) * pressure +
        Math.sin(x * 0.014) * 6
      );
    }

    /* ========================= DRAW HELPERS ========================= */

    function glowPath(offset, width, alpha) {
      ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let x = 0; x <= w; x += 14) {
        const y = pathY(x, t + offset);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function stageRing(x, label, energy) {
      const y = pathY(x, t);

      ctx.save();
      ctx.globalAlpha = energy;

      // containment field
      ctx.beginPath();
      ctx.arc(x, y, 36, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37,99,235,0.08)";
      ctx.fill();

      // ring
      ctx.strokeStyle = "rgba(37,99,235,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 18 + Math.sin(t * 2) * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // core
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37,99,235,0.9)";
      ctx.fill();

      // label
      ctx.fillStyle = "#334155";
      ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y - 34);

      ctx.restore();
    }

    /* ========================= MAIN DRAW ========================= */

    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.0024;

      /* ---------- DEEP FIELD ---------- */

      ctx.fillStyle = "rgba(37,99,235,0.025)";
      ctx.beginPath();
      ctx.ellipse(w / 2, cy, 380, 190, 0, 0, Math.PI * 2);
      ctx.fill();

      /* ---------- ENERGY CHANNELS ---------- */

      glowPath(0, 46, 0.06);   // pressure field
      glowPath(1, 28, 0.12);   // transport layer
      glowPath(2, 2, 0.55);    // signal core

      /* ---------- STAGES ---------- */

      stageRing(w * STAGES.INGEST, "Upload", (Math.sin(t * 1.1) + 1) / 2);
      stageRing(w * STAGES.ENCRYPT, "Encrypt", (Math.sin(t * 1.6 + 2) + 1) / 2);
      stageRing(w * STAGES.STORE, "Cold Store", (Math.sin(t * 1.4 + 4) + 1) / 2);

      /* ---------- DATA FLOW ---------- */

      for (const p of packets) {
        p.p += 0.0009 * p.v;
        if (p.p > 1) p.p = 0;

        const x = p.p * w;
        let y = pathY(x, t);

        // intent inspection slowdown
        if (x > w * STAGES.INTENT - 30 && x < w * STAGES.INTENT + 30) {
          y += Math.sin(p.seed + t * 12) * 10;
        }

        // encryption turbulence
        if (x > w * STAGES.ENCRYPT - 40 && x < w * STAGES.ENCRYPT + 40) {
          y += Math.sin(p.seed + t * 18) * 18;
        }

        // replication fan-out
        if (x > w * STAGES.REPLICATE) {
          y += Math.sin(p.seed) * 6;
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          x > w * STAGES.ENCRYPT - 40 && x < w * STAGES.ENCRYPT + 40
            ? "rgba(37,99,235,0.95)"
            : "rgba(37,99,235,0.6)";
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section className="relative h-[48vh] sm:h-[58vh] overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </section>
  );
}
