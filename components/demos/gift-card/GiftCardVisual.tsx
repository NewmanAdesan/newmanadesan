import { useId } from "react";
import { Yellowtail } from "next/font/google";
import { GiftBoxPaths } from "./GiftBoxPaths";
import type { GiftCardTheme } from "./themes";

// The script face Swyftng uses for "Gift Card". Not preloaded: the demo sits far down the page.
const script = Yellowtail({ weight: "400", subsets: ["latin"], display: "swap", preload: false });

type Props = {
  value: number;
  tier: string;
  theme: GiftCardTheme;
  className?: string;
};

// Ported from Swyftng (src/components/gift-card/gift-card-visual.tsx).
// The whole card is one SVG (viewBox 0 0 319 112), so it renders identically at every size.
// Positions come from the Figma dev-mode values; the designer's gift-box paths have their
// front box colour swapped for theme.boxMain. Everything else is constant and lives here.
// Changes for this site: ids come from useId, and the value text uses the site's sans font.
export function GiftCardVisual({ value, tier, theme, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradientId = `gc-bg-${uid}`;
  const maskId = `gc-mask-${uid}`;
  const sans = { fontFamily: "var(--font-sans)" };

  return (
    <svg
      viewBox="0 0 319 112"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${tier} gift card worth ${value.toLocaleString()} naira`}
    >
      <defs>
        <linearGradient id={gradientId} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={theme.bgEdge} />
          <stop offset="46.16%" stopColor={theme.bgMid} />
          <stop offset="83.17%" stopColor={theme.bgEdge} />
        </linearGradient>
        {/* ticket silhouette: rounded corners minus two notches at the vertical mid-line */}
        <mask id={maskId}>
          <rect x="0" y="0" width="319" height="111.6" rx="8" fill="white" />
          <circle cx="0" cy="55.8" r="10" fill="black" />
          <circle cx="319" cy="55.8" r="10" fill="black" />
        </mask>
      </defs>

      <rect x="0" y="0" width="319" height="111.6" fill={`url(#${gradientId})`} mask={`url(#${maskId})`} />

      <text x="22.32" y="66" style={sans} fontWeight="500" fontSize="18.6" fill="#666666">
        ₦
      </text>
      <text x="37" y="70" style={sans} fontWeight="600" fontSize="37.2" fill="#0D0D0D">
        {value.toLocaleString()}
      </text>

      <text x="68.82" y="90" className={script.className} fontSize="29.76" fill={theme.script}>
        Gift Card
      </text>

      <g transform="translate(218.56, 29.76)">
        <GiftBoxPaths boxMain={theme.boxMain} />
      </g>

      <TierPill tier={tier} />
    </svg>
  );
}

// A real flexbox pill inside <foreignObject>: units stay in SVG space, so it scales with the card,
// but the pill grows to fit its label and truncates a long name instead of overrunning the card.
function TierPill({ tier }: { tier: string }) {
  return (
    <foreignObject x="96" y="7.47" width="200.68" height="24">
      <div style={{ display: "flex", justifyContent: "flex-end", height: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3.72px",
            height: "21.44px",
            padding: "0 11.16px",
            maxWidth: "100%",
            background: "#F7F7F7",
            borderRadius: "10.72px",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "11.16px",
              lineHeight: 1,
              color: "#1A1A1A",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {tier}
          </span>
          {/* radio dot: purple ring + gold centre */}
          <span style={{ position: "relative", flex: "0 0 auto", width: "11.16px", height: "11.16px" }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#7556F1" }} />
            <span
              style={{
                position: "absolute",
                left: "2.79px",
                top: "2.79px",
                width: "5.58px",
                height: "5.58px",
                borderRadius: "50%",
                background: "#FECA71",
              }}
            />
          </span>
        </div>
      </div>
    </foreignObject>
  );
}
