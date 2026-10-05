import Link from "next/link";

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
  media: selectedMedia = "",
  filter = "",
}: {
  q?: string;
  media?: string;
  filter?: string;
}) {
  return (
    <form className="discover" action="/feed" method="get">
      {selectedMedia ? <input type="hidden" name="media" value={selectedMedia} /> : null}
      <nav className="media-links" aria-label="Feeds">
        {media.map((item) => (
          <Link
            key={item.value}
            href={`/feed?media=${encodeURIComponent(item.value)}`}
            aria-current={selectedMedia === item.value ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <input
        className="discover-search"
        name="q"
        defaultValue={q}
        placeholder="Search posts by name"
        aria-label="Search posts by name"
      />
      <button className="button" type="submit">Search</button>
      <details className="filter-menu">
        <summary>Filter{filter ? `: ${feedFilters.find((item) => item.value === filter)?.label || filter}` : ""}</summary>
        <div className="filter-panel">
          {feedFilters.map((item) => (
            <button key={item.value} type="submit" name="filter" value={item.value}>
              {item.label}
            </button>
          ))}
        </div>
      </details>
    </form>
  );
}
