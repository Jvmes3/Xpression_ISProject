export function SprintNote({ label }: { label: string }) {
  return (
    <p className="note">
      No {label} at the moment. Not completed in this sprint cycle yet.
    </p>
  );
}
