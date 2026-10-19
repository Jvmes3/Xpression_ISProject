"use client";

import { useState } from "react";
import { notReadyMessage } from "../lib/not-ready";

export { notReadyMessage };

export function NotReadyForm({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        setShown(true);
      }}
    >
      {children}
      {shown ? (
        <p className="note" role="alert">
          {notReadyMessage}
        </p>
      ) : null}
    </form>
  );
}

export function NotReady({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [shown, setShown] = useState(false);
  return (
    <span className="not-ready">
      <button type="button" className={className} onClick={() => setShown(true)}>
        {children}
      </button>
      {shown ? (
        <span className="note" role="alert">
          {notReadyMessage}
        </span>
      ) : null}
    </span>
  );
}
