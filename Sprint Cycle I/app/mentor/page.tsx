import { RoleHome } from "../components/RoleHome";

export default function MentorPage() {
  return (
    <RoleHome
      kicker="Creative Mentor / Critic"
      title="Reviews waiting on you."
      lede="This sprint shows three Mentor use cases: deciding a review request, writing structured feedback, and nominating work for the featured feed."
      cards={[
        {
          title: "Review requests",
          text: "Accept or decline creators who asked you for feedback.",
          action: "Show requests",
          href: "/mentor/desk#requests",
        },
        {
          title: "Structured feedback",
          text: "Record strengths, improvements, and recommendations.",
          action: "Write feedback",
          href: "/mentor/desk#feedback",
        },
        {
          title: "Nominate featured work",
          text: "Send a strong piece to a Moderator for the featured feed.",
          action: "Nominate",
          href: "/mentor/desk#nominate",
        },
      ]}
      rolePage={{ label: "Mentor", href: "/mentor/desk" }}
    />
  );
}
