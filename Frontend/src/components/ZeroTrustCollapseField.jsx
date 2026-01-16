import { useEffect, useRef } from "react";

function ZeroTrustCollapseField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h, cx, cy;
    const DPR = window.devicePixelRatio || 1;

    const mouse = { x: 0, y: 0, active: false };
    const tooltip = { text: "", x: 0, y: 0, alpha: 0 };

    function resize() {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      cx = w / 2;
      cy = h / 2;
    }

    resize();
    window.addEventListener("resize", resize);

    canvas.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left - cx;
      mouse.y = e.clientY - rect.top - cy;
      mouse.active = true;
    });

    canvas.addEventListener("mouseleave", () => {
      mouse.active = false;
      tooltip.alpha = 0;
    });

    /* ================= MESH ================= */
    const NODE_COUNT = 210;
    const nodes = Array.from({ length: NODE_COUNT }).map(() => {
      const a = Math.random() * Math.PI * 2;
      const r = 60 + Math.random() * 140;
      return {
        ox: Math.cos(a) * r,
        oy: Math.sin(a) * r,
        x: Math.cos(a) * r,
        y: Math.sin(a) * r,
        vx: 0,
        vy: 0,
      };
    });

    /* ================= CLEAN DATA ================= */
    let cleanPackets = [];
    function spawnClean() {
      const a = Math.random() * Math.PI * 2;
      cleanPackets.push({
        x: Math.cos(a) * 260,
        y: Math.sin(a) * 260,
        vx: -Math.cos(a) * 0.7,
        vy: -Math.sin(a) * 0.7,
      });
    }

    /* ================= THREAT ================= */
    let threat = null;
    let lastThreat = 0;

    function spawnThreat() {
      const a = Math.random() * Math.PI * 12;
      threat = {
        x: Math.cos(a) * 260,
        y: Math.sin(a) * 260,
        vx: -Math.cos(a) * 1.2,
        vy: -Math.sin(a) * 1.2,
        life: 0,
      };
    }

    let t = 0;

    function drawTooltip() {
      if (tooltip.alpha <= 0) return;
      ctx.globalAlpha = tooltip.alpha;
      ctx.fillStyle = "rgba(15,23,42,0.85)";
      ctx.font = "11px system-ui";
      const pad = 6;
      const w = ctx.measureText(tooltip.text).width + pad * 2;
      ctx.fillRect(tooltip.x + 10, tooltip.y - 22, w, 18);
      ctx.fillStyle = "#fff";
      ctx.fillText(tooltip.text, tooltip.x + 16, tooltip.y - 9);
      ctx.globalAlpha = 1;
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.002;

      if (Math.random() < 0.02) spawnClean();
      if (!threat && performance.now() - lastThreat > 9000) {
        spawnThreat();
        lastThreat = performance.now();
      }

      /* ================= MESH DYNAMICS ================= */
      for (const n of nodes) {
        let tx = n.ox + Math.sin(t + n.oy * 0.01) * 14;
        let ty = n.oy + Math.cos(t + n.ox * 0.01) * 14;

        if (mouse.active) {
          const md = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (md < 120) {
            tx += (n.x - mouse.x) * 0.15;
            ty += (n.y - mouse.y) * 0.15;
          }
        }

        n.vx += (tx - n.x) * 0.015;
        n.vy += (ty - n.y) * 0.015;
        n.vx *= 0.88;
        n.vy *= 0.88;
        n.x += n.vx;
        n.y += n.vy;
      }

      /* ================= CONNECTIONS ================= */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 40) {
            ctx.strokeStyle = `rgba(37,99,235,${1 - d / 40})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(cx + a.x, cy + a.y);
            ctx.lineTo(cx + b.x, cy + b.y);
            ctx.stroke();
          }
        }
      }

      /* ================= CLEAN DATA ================= */
      cleanPackets = cleanPackets.filter(p => {
        p.x += p.vx;
        p.y += p.vy;

        const d = Math.hypot(p.x, p.y);
        if (d < 18) return false;

        const hover = mouse.active && Math.hypot(p.x - mouse.x, p.y - mouse.y) < 6;
        if (hover) {
          tooltip.text = "Clean data";
          tooltip.x = cx + p.x;
          tooltip.y = cy + p.y;
          tooltip.alpha = Math.min(1, tooltip.alpha + 0.1);
        }

        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#2563eb";
        ctx.fill();
        return true;
      });

      /* ================= THREAT ================= */
      if (threat) {
        threat.x += threat.vx;
        threat.y += threat.vy;
        threat.life++;

        const d = Math.hypot(threat.x, threat.y);
        if (d < 125) {
          for (const n of nodes) {
            const nd = Math.hypot(n.x - threat.x, n.y - threat.y);
            if (nd < 80) {
              n.vx += (n.x - threat.x) * 0.12;
              n.vy += (n.y - threat.y) * 0.12;
            }
          }
          if (threat.life > 10) {
            threat = null;
            return requestAnimationFrame(draw);
          }
        }

        const hover = mouse.active && Math.hypot(threat.x - mouse.x, threat.y - mouse.y) < 8;
        if (hover) {
          tooltip.text = "Threat detected";
          tooltip.x = cx + threat.x;
          tooltip.y = cy + threat.y;
          tooltip.alpha = Math.min(1, tooltip.alpha + 0.1);
        }

        ctx.beginPath();
        ctx.arc(cx + threat.x, cy + threat.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      tooltip.alpha *= 0.92;
      drawTooltip();

      /* ================= CORE ================= */
      ctx.beginPath();
      ctx.arc(cx, cy, 6 + Math.sin(t * 3), 0, Math.PI * 2);
      ctx.fillStyle = "#2563eb";
      ctx.shadowColor = "#2563eb";
      ctx.shadowBlur = 22;
      ctx.fill();
      ctx.shadowBlur = 0;

      requestAnimationFrame(draw);
    }

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section className="relative h-[55vh] sm:h-[70vh] overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="absolute top-4 w-full text-center text-[10px] tracking-widest uppercase text-gray-400">
        The system notices before you do.
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />

      <div className="absolute bottom-6 w-full text-center text-[10px] text-gray-400">
        Decisions happen in real time, without interruption.
      </div>
    </section>
  );
}

export default ZeroTrustCollapseField;
