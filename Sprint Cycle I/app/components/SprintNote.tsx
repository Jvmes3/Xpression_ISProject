import { notReadyMessage } from "../lib/not-ready";

export function SprintNote({ label }: { label: string }) {
  return (
    <p className="note">
      No {label} at the moment. {notReadyMessage}
    </p>
  );
}
