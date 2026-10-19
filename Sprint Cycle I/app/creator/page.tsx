import { RoleHome } from "../components/RoleHome";

export default function CreatorPage() {
  return (
    <RoleHome
      kicker="Creator"
      title="Your work, in one place."
      lede="This sprint shows three Creator use cases: publishing a piece, managing that portfolio, and reading feedback written on your own work."
      cards={[
        {
          title: "Publish work",
          text: "Post writing, visual art, or music, including a SoundCloud link for a music piece.",
          action: "Publish",
          href: "/creator/desk#publish",
        },
        {
          title: "My portfolio",
          text: "Feature, archive, edit, or remove work on your own profile.",
          action: "Open portfolio",
          href: "/creator/desk#portfolio",
        },
        {
          title: "Feedback on my work",
          text: "Read a mentor review of your piece and reply.",
          action: "Read feedback",
          href: "/creator/desk#feedback",
        },
      ]}
      rolePage={{ label: "Creator", href: "/creator/desk" }}
    />
  );
}
