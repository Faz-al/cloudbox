import { useEffect, useRef, useState } from "react";

export default function IntentFieldSystem() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);
  const [stageText, setStageText] = useState("Encrypting");

  /* Pipeline text loop */
  useEffect(() => {
    const stages = ["Encrypting", "Isolating", "Storing"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % stages.length;
      setStageText(stages[i]);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Canvas Engine – Enterprise Calm Pipeline */
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

    const STAGES = {
      UPLOAD: 0.12,
      POLICY: 0.32,
      ENCRYPT: 0.52,
      ISOLATE: 0.72,
      STORE: 0.88,
    };

    const LANES = [-60, -30, 0, 30, 60];
    const PACKET_COUNT = Math.min(120, Math.floor(w / 7));

    const packets = Array.from({ length: PACKET_COUNT }).map(() => ({
      p: Math.random(),
      v: Math.random() * 0.25 + 0.15,
      lane: LANES[Math.floor(Math.random() * LANES.length)],
      size: Math.random() * 1.2 + 0.9,
      alpha: Math.random() * 0.4 + 0.25,
    }));

    function pathY(x, phase, lane) {
      const curve = Math.sin((x / w) * Math.PI) * 14;
      return cy + lane + curve + Math.sin(phase + lane) * 0.4;
    }

    function drawRail(offsetY, alpha, blur = 0) {
      ctx.save();
      ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = blur;
      ctx.shadowColor = "rgba(37,99,235,0.25)";
      ctx.beginPath();
      for (let x = 0; x <= w; x += 12) {
        const y = pathY(x, t, offsetY);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function stageNode(x, label) {
      const y = cy;
      ctx.save();
      ctx.globalAlpha = 0.85;

      ctx.beginPath();
      ctx.arc(x, y, 42, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37,99,235,0.02)";
      ctx.fill();

      ctx.strokeStyle = "rgba(37,99,235,0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 18 + Math.sin(t * 2.4) * 0.8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37,99,235,1)";
      ctx.fill();

      ctx.fillStyle = "rgba(37,99,235,0.8)";
      ctx.font = "11px ui-monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y - 52);

      ctx.restore();
    }

    function drawBackground() {
      ctx.fillStyle = "rgba(37,99,235,0.01)";
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      ctx.ellipse(w / 2, cy, 520, 240, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37,99,235,0.008)";
      ctx.fill();
    }

    function draw() {
      if (!active) return requestAnimationFrame(draw);

      ctx.clearRect(0, 0, w, h);
      t += 0.0009;

      drawBackground();

      LANES.forEach((lane, i) =>
        drawRail(lane, i === 2 ? 0.22 : 0.07, i === 2 ? 6 : 0)
      );

      stageNode(w * STAGES.UPLOAD, "UPLOAD");
      stageNode(w * STAGES.POLICY, "POLICY");
      stageNode(w * STAGES.ENCRYPT, "ENCRYPT");
      stageNode(w * STAGES.ISOLATE, "ISOLATE");
      stageNode(w * STAGES.STORE, "STORE");

      for (const p of packets) {
        p.p += 0.0006 * p.v;
        if (p.p > 1) p.p = 0;

        const x = p.p * w;
        const y = pathY(x, t, p.lane);

        const encryptZone =
          x > w * STAGES.ENCRYPT - 45 && x < w * STAGES.ENCRYPT + 45;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = encryptZone
          ? "rgba(37,99,235,1)"
          : `rgba(37,99,235,${p.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    draw();
    return () => window.removeEventListener("resize", resize);
  }, [active]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 bg-white border-t border-slate-200 overflow-hidden"
    >
      {/* Subtle Enterprise Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-4xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
          SafeVault Zero-Trust Architecture
        </p>

        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-gray-900">
          Security Pipeline with Policy-Driven Encryption
        </h2>

        <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Files are verified, encrypted, isolated, and stored without human
          access. Every action is enforced by policy.
        </p>

        <p className="mt-4 text-sm font-medium text-blue-600">
          {stageText}…
        </p>
      </div>

      {/* Timeline */}
      <div className="mt-12 px-6">
        <div className="max-w-6xl mx-auto relative">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          <div className="flex justify-between mt-4 text-xs font-medium text-gray-700">
            <Stage label="Upload" />
            <Stage label="Policy Engine" />
            <Stage label="Encryption Core" />
            <Stage label="Isolation Gate" />
            <Stage label="Cold Storage" />
          </div>
        </div>
      </div>

      {/* Pipeline Canvas */}
      <div className="relative h-[46vh] sm:h-[58vh] mt-10">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_40%,rgba(0,0,0,0.05)_100%)] pointer-events-none" />
      </div>

      {/* Enterprise Metrics Panel */}
      <div className="hidden sm:grid mt-10 max-w-5xl mx-auto grid-cols-4 gap-4 px-6">
  <GlassMetric title="Files / sec" value="1,582" />
  <GlassMetric title="Encryption" value="AES-256 Active" />
  <GlassMetric title="Isolation Zones" value="7 Active" />
  <GlassMetric title="Policy Decisions" value="Realtime" />
</div>


      {/* Mobile Metrics */}
      <div className="sm:hidden mt-10 px-6 grid grid-cols-3 gap-3">
        <GlassMetric title="Files/sec" value="1,582" />
        <GlassMetric title="Encrypted" value="100%" />
        <GlassMetric title="Zones" value="7" />
      </div>
    </section>
  );
}

/* Timeline Stage */
function Stage({ label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-2 h-2 bg-blue-600 rounded-full" />
      <span>{label}</span>
    </div>
  );
}

/* Glass Metric */
function GlassMetric({ title, value }) {
  return (
    <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="font-semibold text-gray-900 text-sm">{value}</p>
    </div>
  );
}
