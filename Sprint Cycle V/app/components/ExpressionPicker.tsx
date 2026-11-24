"use client";

import { useEffect, useId, useRef, useState } from "react";
import { emojiGroups, skinTones, withTone, type EmojiItem } from "../lib/emoji";
import { beyondGifs } from "../lib/expressions";
import { OctopusSprite } from "./OctopusSprite";

type Tab = "gifs" | "emoji";

export function ExpressionPicker({
  onGif,
  onEmoji,
}: {
  onGif: (id: string) => void;
  onEmoji: (emoji: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("gifs");
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(emojiGroups[0].id);
  const [tone, setTone] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const needle = query.trim().toLowerCase();
  const gifs = beyondGifs.filter((item) => !needle || item.name.toLowerCase().includes(needle));
  const emojiGroup = emojiGroups.find((item) => item.id === group) || emojiGroups[0];
  const emojiItems = (needle
    ? emojiGroups.flatMap((item) => item.items)
    : emojiGroup.items
  ).filter((item) => !needle || item.name.toLowerCase().includes(needle) || item.emoji.includes(query.trim()));

  function chooseGif(id: string) {
    onGif(id);
    setOpen(false);
  }

  function chooseEmoji(item: EmojiItem) {
    const symbol = withTone(item, tone);
    const recent = window.localStorage.getItem("xpression-recent-emoji") || "";
    const next = [symbol, ...recent.split(" ").filter((value) => value && value !== symbol)].slice(0, 24);
    window.localStorage.setItem("xpression-recent-emoji", next.join(" "));
    onEmoji(symbol);
  }

  const recent = typeof window === "undefined"
    ? []
    : (window.localStorage.getItem("xpression-recent-emoji") || "").split(" ").filter(Boolean);

  return (
    <div className="expression" ref={rootRef}>
      <button
        className="gif-button"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        GIF
      </button>
      {open ? (
        <div className="expression-panel" id={panelId}>
          <div className="expression-tabs" role="tablist">
            {(["gifs", "emoji"] as const).map((item) => (
              <button
                key={item}
                className={tab === item ? "expression-tab is-on" : "expression-tab"}
                type="button"
                role="tab"
                aria-selected={tab === item}
                onClick={() => { setTab(item); setQuery(""); }}
              >
                {item === "gifs" ? "GIFs" : "Emoji"}
              </button>
            ))}
          </div>
          <label className="expression-search">
            <span className="sr-only">Search {tab}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tab === "emoji" ? "Search emoji" : "Search GIFs"}
            />
          </label>
          {tab === "gifs" ? (
            <div className="expression-grid gif-grid">
              {gifs.length === 0 ? <p className="meta-line">No GIFs match that search.</p> : null}
              {gifs.map((item) => (
                <button key={item.id} className="gif-cell" type="button" aria-label={item.name} onClick={() => chooseGif(item.id)}>
                  <OctopusSprite mood={item.mood} size="picker" label={item.name} />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          ) : null}
          {tab === "emoji" ? (
            <div>
              <div className="tone-row">
                {skinTones.map((item) => (
                  <button
                    key={item || "default"}
                    className={tone === item ? "tone is-on" : "tone"}
                    type="button"
                    aria-label={item ? `Skin tone ${skinTones.indexOf(item)}` : "Default skin tone"}
                    onClick={() => setTone(item)}
                  >
                    {item ? `👋${item}` : "👋"}
                  </button>
                ))}
              </div>
              {needle || recent.length === 0 ? null : (
                <div className="emoji-grid recent-emoji">
                  {recent.map((item) => (
                    <button key={item} className="emoji-cell" type="button" onClick={() => onEmoji(item)}>{item}</button>
                  ))}
                </div>
              )}
              <div className="emoji-cats">
                {emojiGroups.map((item) => (
                  <button
                    key={item.id}
                    className={group === item.id && !needle ? "emoji-cat is-on" : "emoji-cat"}
                    type="button"
                    aria-label={item.label}
                    onClick={() => { setGroup(item.id); setQuery(""); }}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
              <div className="emoji-grid">
                {emojiItems.length === 0 ? <p className="meta-line">No emoji match that search.</p> : null}
                {emojiItems.map((item, index) => (
                  <button key={`${item.emoji}-${item.name}-${index}`} className="emoji-cell" type="button" title={item.name} onClick={() => chooseEmoji(item)}>
                    {withTone(item, tone)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
