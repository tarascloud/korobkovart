/**
 * Subtle grain/noise texture overlay for art studio feel.
 * Fixed position, pointer-events-none, z-50.
 * Uses SVG feTurbulence filter for lightweight GPU-friendly noise.
 * Opacity controlled via CSS class .noise-overlay in globals.css.
 */
export function NoiseOverlay() {
  return (
    <div className="noise-overlay" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="ko-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ko-noise)" />
      </svg>
    </div>
  );
}
