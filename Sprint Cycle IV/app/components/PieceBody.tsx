import type { Piece } from "../lib/pieces";

export function PieceBody({ piece }: { piece: Piece }) {
  if (piece.kind === "painting") {
    return (
      <figure className="painting">
        <svg viewBox="0 0 640 420" role="img" aria-label="A studio wall after a week of marks, with two sketches taped to the plaster.">
          <rect width="640" height="420" fill="#efe4d4" />
          <rect x="36" y="28" width="568" height="364" fill="#f6efe4" stroke="#d9cbb8" />
          <path d="M70 90 C 140 70, 180 150, 250 120 S 360 60, 430 130" fill="none" stroke="#6d5844" strokeWidth="3" />
          <path d="M90 210 C 160 180, 200 250, 280 220 S 390 170, 470 230" fill="none" stroke="#8d5a3c" strokeWidth="2" />
          <path d="M120 300 C 190 270, 230 340, 310 310" fill="none" stroke="#3f342b" strokeWidth="2" />
          <circle cx="168" cy="146" r="7" fill="#c4491d" opacity="0.85" />
          <rect x="390" y="78" width="132" height="96" fill="#fffdf8" stroke="#b7a894" transform="rotate(-3 456 126)" />
          <path d="M408 110 h90 M408 128 h70 M408 146 h80" stroke="#8a7b6a" strokeWidth="1.5" />
          <rect x="86" y="236" width="118" height="88" fill="#fffdf8" stroke="#b7a894" transform="rotate(2 145 280)" />
          <path d="M104 262 c 20 -18 48 -8 70 6 c -16 20 -46 22 -70 4 z" fill="none" stroke="#3f342b" strokeWidth="1.5" />
          <rect x="248" y="48" width="46" height="14" fill="#e7d7a8" transform="rotate(8 271 55)" />
          <rect x="300" y="168" width="38" height="12" fill="#e7d7a8" transform="rotate(-6 319 174)" />
        </svg>
        <figcaption>Studio wall, after a week. The tape is still on the plaster.</figcaption>
      </figure>
    );
  }

  if (piece.kind === "lyrics") {
    return (
      <div className="work-copy lyrics">
        {piece.lines.map((line, index) => (
          line ? <p key={index}>{line}</p> : <span key={index} className="stanza-gap" />
        ))}
      </div>
    );
  }

  return (
    <div className="work-copy">
      {piece.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
