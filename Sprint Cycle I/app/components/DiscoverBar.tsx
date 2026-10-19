import { NotReady, NotReadyForm } from "./NotReady";

const media = [
  { label: "Writing", value: "Writing" },
  { label: "Visual art", value: "Visual art" },
  { label: "Music", value: "Music" },
];

export const feedFilters = [
  { value: "recent", label: "Recent" },
  { value: "entertaining", label: "Entertaining" },
  { value: "educational", label: "Educational" },
  { value: "personal", label: "Personal" },
  { value: "experimental", label: "Experimental" },
];

export function DiscoverBar({
  q = "",
  filter = "",
}: {
  q?: string;
  media?: string;
  filter?: string;
}) {
  return (
    <NotReadyForm className="discover">
      <nav className="media-links" aria-label="Feeds">
        {media.map((item) => (
          <NotReady key={item.value}>{item.label}</NotReady>
        ))}
      </nav>
      <input
        className="discover-search"
        name="q"
        defaultValue={q}
        placeholder="Search posts by name"
        aria-label="Search posts by name"
      />
      <NotReady className="button">Search</NotReady>
      <details className="filter-menu">
        <summary>Filter{filter ? `: ${feedFilters.find((item) => item.value === filter)?.label || filter}` : ""}</summary>
        <div className="filter-panel">
          {feedFilters.map((item) => (
            <NotReady key={item.value}>{item.label}</NotReady>
          ))}
        </div>
      </details>
    </NotReadyForm>
  );
}
