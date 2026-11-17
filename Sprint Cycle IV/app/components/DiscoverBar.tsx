export function safeBack(value: string) {
  if (value === "/") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/feed")) return "";
  if (!/^\/[A-Za-z0-9/_-]*$/.test(value)) return "";
  return value;
}

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
  back = "",
}: {
  q?: string;
  media?: string;
  filter?: string;
  back?: string;
}) {
  const origin = safeBack(back);

  function listHref(nextMedia: string, nextFilter: string) {
    const params = new URLSearchParams();
    if (nextMedia) params.set("media", nextMedia);
    if (q) params.set("q", q);
    if (nextFilter) params.set("filter", nextFilter);
    if (!nextMedia && !nextFilter && !q && origin) return origin;
    if (origin && (nextMedia || nextFilter || q)) params.set("back", origin);
    const query = params.toString();
    return query ? `/feed?${query}` : "/feed";
  }

  return (
    <form className="discover" action="/feed" method="get">
      {origin ? <input type="hidden" name="back" value={origin} /> : null}
      {selectedMedia ? <input type="hidden" name="media" value={selectedMedia} /> : null}
      <nav className="media-links" aria-label="Feeds">
        {media.map((item) => {
          const selected = selectedMedia === item.value;
          return (
            <a
              key={item.value}
              href={listHref(selected ? "" : item.value, filter)}
              aria-current={selected ? "page" : undefined}
            >
              {item.label}
            </a>
          );
        })}
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
          {feedFilters.map((item) => {
            const selected = filter === item.value || (item.value === "recent" && !filter);
            const nextFilter = item.value === "recent" || selected ? "" : item.value;
            return (
              <a key={item.value} href={listHref(selectedMedia, nextFilter)} aria-current={selected ? "page" : undefined}>
                {item.label}
              </a>
            );
          })}
        </div>
      </details>
    </form>
  );
}
