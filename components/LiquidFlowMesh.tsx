"use client";

import { useEffect, useRef } from "react";
import styles from "./LiquidFlowMesh.module.css";

/* ── Color Palette Definitions per Section ─────────────────────────────── */
interface ColorStop {
  r: number;
  g: number;
  b: number;
}

interface SectionPalette {
  c1: ColorStop; // Primary wave crest
  c2: ColorStop; // Secondary body
  c3: ColorStop; // Deep current
  accent: ColorStop;
}

const PALETTES: Record<string, SectionPalette> = {
  hero: {
    c1: { r: 10, g: 132, b: 255 },    // iOS Electric Blue
    c2: { r: 94, g: 92, b: 230 },     // Deep Indigo
    c3: { r: 90, g: 200, b: 250 },    // Cyber Cyan
    accent: { r: 0, g: 199, b: 255 },
  },
  vision: {
    c1: { r: 48, g: 209, b: 88 },     // Aurora Emerald
    c2: { r: 0, g: 199, b: 190 },     // Bioluminescent Teal
    c3: { r: 52, g: 199, b: 89 },     // Mint Jade
    accent: { r: 100, g: 230, b: 255 },
  },
  events: {
    c1: { r: 255, g: 159, b: 10 },    // Sunset Amber
    c2: { r: 255, g: 69, b: 58 },     // Coral Fire
    c3: { r: 255, g: 214, b: 10 },    // Warm Gold
    accent: { r: 255, g: 55, b: 95 },
  },
  contact: {
    c1: { r: 191, g: 90, b: 242 },    // Royal Violet
    c2: { r: 94, g: 92, b: 230 },     // Electric Indigo
    c3: { r: 255, g: 55, b: 95 },     // Cyber Magenta
    accent: { r: 90, g: 200, b: 250 },
  },
};

function lerpColor(curr: ColorStop, target: ColorStop, factor: number): ColorStop {
  return {
    r: curr.r + (target.r - curr.r) * factor,
    g: curr.g + (target.g - curr.g) * factor,
    b: curr.b + (target.b - curr.b) * factor,
  };
}

export function LiquidFlowMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Current interpolated colors (init with hero)
    let currentC1: ColorStop = { ...PALETTES.hero.c1 };
    let currentC2: ColorStop = { ...PALETTES.hero.c2 };
    let currentC3: ColorStop = { ...PALETTES.hero.c3 };
    let currentAccent: ColorStop = { ...PALETTES.hero.accent };

    let targetPalette: SectionPalette = PALETTES.hero;
    let scrollSpeed = 0;
    let lastScrollY = window.scrollY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = Math.abs(scrollY - lastScrollY);
      scrollSpeed = Math.min(delta * 0.05, 1.5);
      lastScrollY = scrollY;

      // Determine active section by elements
      const visionEl = document.getElementById("vision-section");
      const eventsEl = document.getElementById("events");
      const contactEl = document.getElementById("contact-section");

      const threshold = window.innerHeight * 0.45;
      const vTop = visionEl ? visionEl.getBoundingClientRect().top : 9999;
      const eTop = eventsEl ? eventsEl.getBoundingClientRect().top : 9999;
      const cTop = contactEl ? contactEl.getBoundingClientRect().top : 9999;

      if (cTop <= threshold) {
        targetPalette = PALETTES.contact;
      } else if (eTop <= threshold) {
        targetPalette = PALETTES.events;
      } else if (vTop <= threshold) {
        targetPalette = PALETTES.vision;
      } else {
        targetPalette = PALETTES.hero;
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let step = 0;

    const render = () => {
      step += 0.012 + scrollSpeed * 0.02;
      scrollSpeed *= 0.94; // Decay scroll velocity

      // Smooth color morphing towards the target section palette
      const lerpSpeed = 0.04;
      currentC1 = lerpColor(currentC1, targetPalette.c1, lerpSpeed);
      currentC2 = lerpColor(currentC2, targetPalette.c2, lerpSpeed);
      currentC3 = lerpColor(currentC3, targetPalette.c3, lerpSpeed);
      currentAccent = lerpColor(currentAccent, targetPalette.accent, lerpSpeed);

      ctx.clearRect(0, 0, width, height);

      // Deep subtle background tint
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );
      bgGrad.addColorStop(
        0,
        `rgba(${Math.round(currentC1.r)}, ${Math.round(currentC1.g)}, ${Math.round(currentC1.b)}, 0.18)`
      );
      bgGrad.addColorStop(
        0.5,
        `rgba(${Math.round(currentC2.r)}, ${Math.round(currentC2.g)}, ${Math.round(currentC2.b)}, 0.09)`
      );
      bgGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ── Wave 1: Flowing Primary Liquid Ribbon ─────────────────────────
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y =
          height * 0.52 +
          Math.sin(x * 0.0035 + step * 1.2) * 85 +
          Math.sin(x * 0.007 - step * 0.8) * 45 +
          Math.cos(x * 0.002 + step * 0.5) * 60;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const grad1 = ctx.createLinearGradient(0, height * 0.35, width, height * 0.85);
      grad1.addColorStop(
        0,
        `rgba(${Math.round(currentC1.r)}, ${Math.round(currentC1.g)}, ${Math.round(currentC1.b)}, 0.28)`
      );
      grad1.addColorStop(
        0.5,
        `rgba(${Math.round(currentC2.r)}, ${Math.round(currentC2.g)}, ${Math.round(currentC2.b)}, 0.22)`
      );
      grad1.addColorStop(
        1,
        `rgba(${Math.round(currentC3.r)}, ${Math.round(currentC3.g)}, ${Math.round(currentC3.b)}, 0.12)`
      );
      ctx.fillStyle = grad1;
      ctx.fill();

      // ── Wave 2: Counter-flow Fluid Wave ──────────────────────────────
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 15) {
        const y =
          height * 0.44 +
          Math.cos(x * 0.004 - step * 1.4) * 95 +
          Math.sin(x * 0.006 + step * 0.9) * 50;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const grad2 = ctx.createLinearGradient(width, height * 0.3, 0, height * 0.7);
      grad2.addColorStop(
        0,
        `rgba(${Math.round(currentAccent.r)}, ${Math.round(currentAccent.g)}, ${Math.round(currentAccent.b)}, 0.24)`
      );
      grad2.addColorStop(
        0.6,
        `rgba(${Math.round(currentC1.r)}, ${Math.round(currentC1.g)}, ${Math.round(currentC1.b)}, 0.16)`
      );
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fill();

      // ── Wave 3: Surface Water Crest Shimmer ──────────────────────────
      ctx.beginPath();
      for (let x = 0; x <= width; x += 20) {
        const y =
          height * 0.48 +
          Math.sin(x * 0.005 + step * 1.5) * 65 +
          Math.cos(x * 0.009 - step) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${Math.round(currentAccent.r)}, ${Math.round(currentAccent.g)}, ${Math.round(currentAccent.b)}, 0.4)`;
      ctx.lineWidth = 3;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.flowWrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.flowCanvas} />
      {/* Subtle organic liquid glow blur layer */}
      <div className={styles.liquidAura} />
    </div>
  );
}

