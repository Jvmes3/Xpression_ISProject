"use client";

import { useId, useRef, useState } from "react";

export function SampleLinkField({
  label,
  name,
  value,
  placeholder,
  onChange,
  accept = ".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,application/pdf,image/png,image/jpeg,image/gif,image/webp,text/plain",
  showAttach = true,
}: {
  label?: string;
  name?: string;
  value?: string;
  placeholder: string;
  onChange?: (value: string) => void;
  accept?: string;
  showAttach?: boolean;
}) {
  const id = useId();
  const picker = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(value || "");
  const [attached, setAttached] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const shown = onChange ? value || "" : text;

  function setValue(next: string) {
    if (onChange) onChange(next);
    else setText(next);
  }

  async function attach(file: File) {
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/upload", { method: "POST", body });
    const result = (await response.json()) as { url?: string; filename?: string; error?: string };
    setBusy(false);
    if (!response.ok || !result.url) {
      setError(result.error || "That file could not be attached.");
      return;
    }
    setValue(result.url);
    setAttached(result.filename || file.name);
  }

  const row = (
    <>
      <div className="attach-row">
        <input
          id={label ? id : undefined}
          name={name}
          value={shown}
          placeholder={placeholder}
          onChange={(event) => {
            setAttached("");
            setValue(event.target.value);
          }}
        />
        {showAttach ? (
          <button
            className="button button-quiet"
            type="button"
            disabled={busy}
            onClick={() => picker.current?.click()}
          >
            {busy ? "Attaching" : "Attach"}
          </button>
        ) : null}
        <input
          ref={picker}
          className="sr-only"
          type="file"
          accept={accept}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void attach(file);
          }}
        />
      </div>
      {attached ? <span className="attach-name">Attached: {attached}</span> : null}
      {error ? <span className="note">{error}</span> : null}
    </>
  );

  if (!label) return <div className="field">{row}</div>;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {row}
    </div>
  );
}
