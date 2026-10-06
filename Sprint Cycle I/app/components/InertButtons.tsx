"use client";

import { useEffect, useState } from "react";

export function InertButtons() {
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    function block(event: Event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const control = target.closest("button, input[type='submit'], a.button");
      if (!control || control.classList.contains("hamburger")) return;
      event.preventDefault();
      event.stopPropagation();
      setNotice(true);
    }

    document.addEventListener("click", block, true);
    document.addEventListener("submit", block, true);
    return () => {
      document.removeEventListener("click", block, true);
      document.removeEventListener("submit", block, true);
    };
  }, []);

  if (!notice) return null;

  return (
    <p className="note sprint-later" role="status">
      This will be added in a future sprint cycle.
    </p>
  );
}
