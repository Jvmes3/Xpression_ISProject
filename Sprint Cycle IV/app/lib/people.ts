export function personSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const personNotes: Record<string, string> = {
  "amara-cole": "Writes poems and short essays about night travel.",
  "luis-ortega": "Makes studies of studio walls, light, and leftover paint.",
  "nia-brooks": "Records songs and short demos.",
};

export function peopleFromPosts(
  posts: { id: string; title: string; media: string; creator: string; status: string; description?: string; link?: string }[],
) {
  const map = new Map<string, { name: string; slug: string; works: typeof posts }>();
  for (const post of posts) {
    if (post.status === "removed") continue;
    const slug = personSlug(post.creator) || "creator";
    const current = map.get(slug) || { name: post.creator, slug, works: [] as typeof posts };
    current.works.push(post);
    map.set(slug, current);
  }
  return [...map.values()];
}
