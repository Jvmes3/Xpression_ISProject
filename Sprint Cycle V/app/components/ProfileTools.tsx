import Link from "next/link";

export function ProfileTools({ editHref }: { editHref: string }) {
  return (
    <div className="profile-tools">
      <Link className="button button-quiet" href={editHref}>Edit profile</Link>
      <Link className="profile-menu" href="/settings" aria-label="Settings and activity">
        <span className="bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </Link>
    </div>
  );
}
