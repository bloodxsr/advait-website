import React from "react";

// Stencil brutalist geometry matching Creative Reference Library (CRL) aesthetic
export const GLYPH_PATHS = {
  A: "M 37 26 L 50 2 L 63 26 H 37 Z M 35 28.8 L 3 98 H 25 L 34 76 H 42 V 68 H 37 L 46 44 H 36 Z M 65 28.8 L 64 44 H 54 L 63 68 H 58 V 76 H 66 L 75 98 H 97 Z M 42 68 H 58 V 76 H 42 Z",
  D: "M 0 0 H 24 V 48.6 H 0 Z M 0 51.4 H 24 V 100 H 0 Z M 26.8 0 H 70 L 100 30 V 48.6 H 76 L 62 24 H 26.8 Z M 76 51.4 H 100 V 70 L 70 100 H 26.8 V 76 H 62 L 76 51.4 Z",
  V: "M 0 0 H 24 L 45 68 H 21 Z M 100 0 H 76 L 55 68 H 79 Z M 32 70.8 H 68 L 56 100 H 44 Z",
  I: "M 0 0 H 52 V 22 H 0 Z M 14 24.8 H 38 V 75.2 H 14 Z M 0 78 H 52 V 100 H 0 Z",
  T: "M 0 0 H 100 V 24 H 0 Z M 38 26.8 H 62 V 100 H 38 Z",
  Dot: "M 4 76 H 28 V 100 H 4 Z",
};

export const GLYPH_VIEWBOX = {
  A: "0 0 100 100",
  D: "0 0 100 100",
  V: "0 0 100 100",
  I: "0 0 52 100",
  T: "0 0 100 100",
  Dot: "0 0 32 100",
};

interface GlyphProps {
  fillProgress?: number; // 0 to 1 vertical liquid color fill
  className?: string;
  style?: React.CSSProperties;
}

export function StencilGlyph({
  glyph,
  fillProgress,
  className,
  style,
  fillColor = "currentColor",
}: {
  glyph: keyof typeof GLYPH_PATHS;
  fillProgress?: number;
  className?: string;
  style?: React.CSSProperties;
  fillColor?: string;
}) {
  const path = GLYPH_PATHS[glyph];
  const viewBox = GLYPH_VIEWBOX[glyph];
  const fillPct = typeof fillProgress === "number" ? Math.max(0, Math.min(1, fillProgress)) : 1;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        lineHeight: 0,
        ...style,
      }}
    >
      {/* 01. Ghost Base Layer (18% faint silhouette matching CRL shader uGhost) */}
      <svg
        viewBox={viewBox}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          fill: fillColor,
          opacity: 0.18,
        }}
      >
        <path d={path} />
      </svg>

      {/* 02. Solid Color Fill Layer (wiping up from bottom 0% to top 100%) */}
      {fillPct > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(${((1 - fillPct) * 100).toFixed(2)}% 0 0 0)`,
            transition: "clip-path 0.05s linear",
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox={viewBox}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              fill: fillColor,
            }}
          >
            <path d={path} />
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * Complete ADVAIT. wordmark rendered with precision stencil typography
 */
export function AdvaitWordmark({
  className,
  style,
  height = 48,
}: {
  className?: string;
  style?: React.CSSProperties;
  height?: number | string;
}) {
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.08em",
        height,
        ...style,
      }}
      aria-label="ADVAIT"
    >
      <svg viewBox="0 0 100 100" style={{ height: "100%", width: "auto", fill: "currentColor" }}>
        <path d={GLYPH_PATHS.A} />
      </svg>
      <svg viewBox="0 0 100 100" style={{ height: "100%", width: "auto", fill: "currentColor" }}>
        <path d={GLYPH_PATHS.D} />
      </svg>
      <svg viewBox="0 0 100 100" style={{ height: "100%", width: "auto", fill: "currentColor" }}>
        <path d={GLYPH_PATHS.V} />
      </svg>
      <svg viewBox="0 0 100 100" style={{ height: "100%", width: "auto", fill: "currentColor" }}>
        <path d={GLYPH_PATHS.A} />
      </svg>
      <svg viewBox="0 0 52 100" style={{ height: "100%", width: "auto", fill: "currentColor" }}>
        <path d={GLYPH_PATHS.I} />
      </svg>
      <svg viewBox="0 0 100 100" style={{ height: "100%", width: "auto", fill: "currentColor" }}>
        <path d={GLYPH_PATHS.T} />
      </svg>
      <svg viewBox="0 0 32 100" style={{ height: "100%", width: "auto", fill: "currentColor" }}>
        <path d={GLYPH_PATHS.Dot} />
      </svg>
    </div>
  );
}

