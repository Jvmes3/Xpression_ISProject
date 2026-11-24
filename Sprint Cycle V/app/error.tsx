"use client";

import { unstable_isUnrecognizedActionError } from "next/navigation";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const stale = unstable_isUnrecognizedActionError(error);

  useEffect(() => {
    if (stale) window.location.reload();
  }, [stale]);

  if (stale) {
    return (
      <main className="page">
        <h1>Refreshing this page</h1>
        <p className="lede">This form was left over from an older copy of the site. The page is loading again.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>This page did not finish</h1>
      <p className="lede">Try it again. If it still fails, go back and open the page once more.</p>
      <button className="button" type="button" onClick={() => reset()}>Try again</button>
    </main>
  );
}
