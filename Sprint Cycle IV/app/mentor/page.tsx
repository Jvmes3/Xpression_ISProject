import { RoleHome } from "../components/RoleHome";
import { taskPath } from "../lib/tasks";

export default function MentorPage() {
  return (
    <RoleHome
      kicker="Creative Mentor / Critic"
      title="Reviews waiting on you."
      lede="A Mentor accepts review requests, writes structured feedback, and can nominate strong work to be featured."
      cards={[
        {
          title: "Review requests",
          text: "Accept or decline creators who asked you for feedback.",
          action: "Show requests",
          href: taskPath("mentor", "requests"),
        },
        {
          title: "Structured feedback",
          text: "Record strengths, improvements, and recommendations.",
          action: "Write feedback",
          href: taskPath("mentor", "feedback"),
        },
        {
          title: "Discover work",
          text: "Search by creator, media type, or genre before offering a review.",
          action: "Search work",
          href: taskPath("mentor", "discover"),
        },
        {
          title: "Nominate featured work",
          text: "Send strong pieces to a Moderator for the featured feed.",
          action: "Nominate",
          href: taskPath("mentor", "nominate"),
        },
        {
          title: "Review history",
          text: "See past reviews and requests still in progress.",
          action: "Show history",
          href: taskPath("mentor", "history"),
        },
        {
          title: "Messages",
          text: "Clarify a review with the creator in private.",
          action: "Show messages",
          href: taskPath("mentor", "messages"),
        },
      ]}
    />
  );
}
