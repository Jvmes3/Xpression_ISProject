export function Answers({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="answers panel">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
