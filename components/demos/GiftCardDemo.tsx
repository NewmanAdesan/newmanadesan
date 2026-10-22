"use client";

import { useMemo, useState } from "react";
import { DemoFrame } from "./DemoFrame";
import { GiftCardVisual } from "./gift-card/GiftCardVisual";
import { GIFT_CARD_THEMES, colorKey, nameFromColors, themeToColors, type GiftCardColors } from "./gift-card/themes";

const VALUES = [5000, 10000, 20000, 50000];

type Template = { name: string; colors: GiftCardColors };

function sample(name: string, theme: string): Template {
  const found = GIFT_CARD_THEMES.find((t) => t.name === theme) ?? GIFT_CARD_THEMES[0];
  return { name, colors: themeToColors(found.theme) };
}

// Sample templates so the "in use" counts have something to count.
const SAMPLE_TEMPLATES: Template[] = [
  sample("Welcome", "SUPA"),
  sample("Payday", "SUPA"),
  sample("Weekend", "BETA"),
  sample("Ramadan", "EMERALD"),
  sample("Christmas", "GOLDEN"),
  sample("New Year", "GOLDEN"),
];

// The create-template form from Swyftng's admin, minus the network call.
// Usage counts are derived from the template list, exactly as the admin derives them.
export function GiftCardDemo() {
  const [name, setName] = useState("Birthday treat");
  const [themeName, setThemeName] = useState("SUPA");
  const [value, setValue] = useState(20000);
  const [templates, setTemplates] = useState(SAMPLE_TEMPLATES);
  const [saved, setSaved] = useState("");

  const usage = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of templates) {
      const key = colorKey(t.colors);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [templates]);

  const selected = GIFT_CARD_THEMES.find((t) => t.name === themeName) ?? GIFT_CARD_THEMES[0];
  const colors = themeToColors(selected.theme);
  const selectedCount = usage.get(colorKey(colors)) ?? 0;
  const label = name.trim() || "Gift Card";
  const body = { name: label, value, design: { colors } };

  const save = () => {
    setTemplates((prev) => [...prev, { name: label, colors }]);
    const count = selectedCount + 1;
    setSaved(`Saved. ${selected.name} is now used by ${count} ${count === 1 ? "card" : "cards"}.`);
  };

  return (
    <DemoFrame
      title="Design a gift card"
      note="The card component and its 30 themes are ported from Swyftng's admin. Nothing is sent anywhere: the request body is shown, not posted, and the usage counts start from sample data."
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* On phones the preview sticks under the header while the colours scroll past. */}
        <div className="sticky top-16 z-10 -mx-4 flex flex-col gap-3 bg-card px-4 pt-2 pb-3 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:p-0">
          <GiftCardVisual value={value} tier={label} theme={selected.theme} className="w-full max-w-md" />
          <p className="text-sm text-muted">
            <span className="font-medium text-ink">{selected.name}</span>
            {selectedCount > 0 ? ` · in use on ${selectedCount} ${selectedCount === 1 ? "card" : "cards"}` : " · not used yet"}
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:row-span-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Card name</span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved("");
              }}
              maxLength={40}
              className="rounded-md border border-line bg-paper px-3 py-2 text-base outline-none focus:border-accent"
            />
          </label>

          <fieldset className="flex flex-col gap-2 text-sm">
            <legend className="mb-2 font-medium">Colour</legend>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
              {GIFT_CARD_THEMES.map(({ name: option, theme }) => {
                const count = usage.get(colorKey(themeToColors(theme))) ?? 0;
                return (
                  <label key={option} className="relative cursor-pointer" title={option}>
                    <input
                      type="radio"
                      name="gift-card-colour"
                      value={option}
                      checked={option === themeName}
                      onChange={() => {
                        setThemeName(option);
                        setSaved("");
                      }}
                      aria-label={count > 0 ? `${option}, in use on ${count}` : option}
                      className="peer sr-only"
                    />
                    <span
                      className="flex aspect-square items-center justify-center rounded-md border border-black/10 ring-offset-2 ring-offset-card peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent"
                      style={{ background: `linear-gradient(90deg, ${theme.bgEdge}, ${theme.bgMid})` }}
                    >
                      <span className="size-3 rounded-full" style={{ background: theme.boxMain }} />
                    </span>
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-paper">
                        {count}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2 text-sm">
            <legend className="mb-2 font-medium">Value</legend>
            <div className="flex flex-wrap gap-2">
              {VALUES.map((v) => (
                <label key={v} className="cursor-pointer">
                  <input
                    type="radio"
                    name="gift-card-value"
                    checked={v === value}
                    onChange={() => setValue(v)}
                    className="peer sr-only"
                  />
                  <span className="block rounded-full border border-line px-3 py-1.5 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                    ₦{v.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-85"
            >
              Save as template
            </button>
            <p aria-live="polite" className="text-sm text-muted">
              {saved}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2 text-sm">
          <p className="font-medium">What the API receives</p>
          <pre className="overflow-x-auto rounded-md bg-paper p-3 font-mono text-xs leading-relaxed">
            {JSON.stringify(body, null, 2)}
          </pre>
          <p className="text-muted">
            Only the four colours are stored. When this card is opened for editing, they match back to{" "}
            <span className="font-medium text-ink">{nameFromColors(colors)}</span>, so the picker pre-selects it.
          </p>
        </div>
      </div>
    </DemoFrame>
  );
}
