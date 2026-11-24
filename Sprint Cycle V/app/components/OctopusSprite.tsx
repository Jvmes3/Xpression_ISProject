export function OctopusSprite({
  mood,
  size = "gif",
  label,
}: {
  mood: string;
  size?: "picker" | "gif" | "react";
  label: string;
}) {
  return (
    <span className={`octo octo-${size}`} data-mood={mood} role="img" aria-label={label}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <ellipse className="head" cx="60" cy="46" rx="28" ry="26" />
        <g className="tentacles">
          <g className="leg l1"><path d="M40 66 C24 80 18 96 28 110" /><circle cx="26" cy="92" r="2.2" /><circle cx="29" cy="104" r="1.8" /></g>
          <g className="leg l2"><path d="M48 70 C34 86 32 100 40 114" /><circle cx="36" cy="96" r="2.1" /><circle cx="39" cy="108" r="1.7" /></g>
          <g className="leg l3"><path d="M56 72 C50 90 48 104 56 116" /><circle cx="51" cy="98" r="2" /><circle cx="55" cy="110" r="1.7" /></g>
          <g className="leg l4"><path d="M64 72 C70 92 74 104 66 116" /><circle cx="71" cy="98" r="2" /><circle cx="68" cy="110" r="1.7" /></g>
          <g className="leg l5"><path d="M72 70 C86 86 88 100 80 114" /><circle cx="84" cy="96" r="2.1" /><circle cx="81" cy="108" r="1.7" /></g>
          <g className="leg l6"><path d="M80 66 C96 80 102 96 92 110" /><circle cx="96" cy="90" r="2.2" /><circle cx="93" cy="104" r="1.8" /></g>
          <g className="leg l7"><path d="M86 60 C102 70 108 84 100 98" /><circle cx="102" cy="80" r="2" /><circle cx="101" cy="92" r="1.6" /></g>
          <g className="leg l8"><path d="M34 60 C16 66 10 80 18 94" /><circle cx="16" cy="76" r="2" /><circle cx="17" cy="88" r="1.6" /></g>
        </g>
        <ellipse className="mantle" cx="60" cy="34" rx="16" ry="10" />
        <circle className="blush left" cx="34" cy="56" r="5" />
        <circle className="blush right" cx="86" cy="56" r="5" />
        <ellipse className="eye left" cx="46" cy="46" rx="8" ry="9" />
        <ellipse className="eye right" cx="74" cy="46" rx="8" ry="9" />
        <circle className="pupil left" cx="48" cy="48" r="3.4" />
        <circle className="pupil right" cx="76" cy="48" r="3.4" />
        <path className="brow left" d="M38 36 Q46 32 54 36" />
        <path className="brow right" d="M66 36 Q74 32 82 36" />
        <path className="mouth smile" d="M48 62 Q60 72 72 62" />
        <path className="mouth frown" d="M48 68 Q60 58 72 68" />
        <path className="mouth flat" d="M48 64 H72" />
        <ellipse className="mouth open" cx="60" cy="66" rx="8" ry="6" />
        <circle className="mouth o" cx="60" cy="66" r="5" />
        <path className="mouth smirk" d="M50 64 Q62 66 74 58" />
        <path className="tear left" d="M40 56 q3 8 0 14 q-3-6 0-14z" />
        <path className="tear right" d="M80 56 q3 8 0 14 q-3-6 0-14z" />
        <ellipse className="drool" cx="70" cy="74" rx="3" ry="6" />
        <path className="heart a" d="M18 28c0-4 6-6 6 0 0-6 6-4 6 0 0 6-6 8-6 8s-6-2-6-8z" />
        <path className="heart b" d="M90 18c0-4 6-6 6 0 0-6 6-4 6 0 0 6-6 8-6 8s-6-2-6-8z" />
        <path className="zzz" d="M88 22 h8 l-8 8 h8" />
        <circle className="sweat" cx="90" cy="34" r="4" />
        <circle className="spark a" cx="18" cy="24" r="3" />
        <circle className="spark b" cx="102" cy="30" r="2.4" />
      </svg>
    </span>
  );
}
