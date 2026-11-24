import Link from "next/link";
import { SprintNote } from "../../components/SprintNote";
import { canUseRole } from "../../lib/access";
import { saveAnyProfile, savePortfolio } from "../../lib/actions";
import { currentAccount } from "../../lib/session";
import { accountForSession, readAccountByEmail, readCreatorProfile } from "../../lib/writes";

export const dynamic = "force-dynamic";

const notices: Record<string, string> = {
  feature: "Featuring a piece on your profile is not completed in this sprint cycle yet.",
  archive: "Archiving a post from your profile is not completed in this sprint cycle yet.",
};

const errors: Record<string, string> = {
  name: "Add a name of 120 characters or fewer.",
  bio: "Keep the bio to 150 characters.",
  website: "A website link has to start with http:// or https://.",
  music: "A SoundCloud or music link has to start with http:// or https://.",
  discipline: "Keep what you make to 80 characters.",
  photo: "Use a PNG, JPG, GIF, or WEBP image that is 8 MB or smaller.",
  account: "This sign-in is not a row in the database yet.",
};

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const account = await currentAccount();
  if (!account || account.status !== "active") {
    return (
      <main className="page">
        <h1>Edit profile</h1>
        <p className="lede">Sign in to edit the profile for this account.</p>
        <p><Link className="button" href="/sign-in?returnTo=%2Fprofile%2Fedit">Sign in</Link></p>
      </main>
    );
  }

  const params = await searchParams;
  const creator = canUseRole(account, "creator") ? await accountForSession(account, "Creator") : null;
  const creatorProfile = creator ? await readCreatorProfile(creator.account_id) : null;
  if (creatorProfile) {
    const practices = new Set((creatorProfile.practices || "").split(",").map((item) => item.trim()));
    const initial = creatorProfile.name.slice(0, 1).toUpperCase();
    return (
      <main className="page">
        <p className="eyebrow">Profile</p>
        <h1>Edit profile</h1>
        <p className="lede">This is your public profile. Name, bio, photo, and what you make are saved. Featuring and archiving a piece stay for a later sprint.</p>
        {params.error && errors[params.error] ? <p className="note">{errors[params.error]}</p> : null}
        {params.notice && notices[params.notice] ? <p className="note">{notices[params.notice]}</p> : null}
        <form className="edit-profile panel" action={savePortfolio}>
          <div className="edit-photo">
            <div className="portfolio-avatar" aria-hidden="true">
              {creatorProfile.avatar_url ? <img src={creatorProfile.avatar_url} alt="" /> : initial}
            </div>
            <div>
              <strong>{creatorProfile.name}</strong>
              <label className="text-button">
                Change photo
                <input type="file" name="photo" accept="image/png,image/jpeg,image/gif,image/webp" />
              </label>
              {creatorProfile.avatar_url ? (
                <label className="check-line">
                  <input type="checkbox" name="removePhoto" value="yes" />
                  Remove current photo
                </label>
              ) : null}
            </div>
          </div>
          <label>
            Name
            <input name="name" required maxLength={120} defaultValue={creatorProfile.name} />
          </label>
          <label>
            Bio
            <textarea name="bio" maxLength={150} rows={3} defaultValue={creatorProfile.bio || ""} placeholder="A short line about your work." />
          </label>
          <label>
            Website
            <input name="website" defaultValue={creatorProfile.website_url || ""} placeholder="https://" />
          </label>
          <label>
            SoundCloud or music link
            <input name="music" defaultValue={creatorProfile.music_url || ""} placeholder="https://" />
          </label>
          <label>
            What you make
            <input name="discipline" maxLength={80} defaultValue={creatorProfile.discipline || ""} placeholder="Poetry, painting, songwriting" />
          </label>
          <fieldset>
            <legend>Work you publish</legend>
            <div className="choices">
              {["Writing", "Visual art", "Music"].map((item) => (
                <label key={item}>
                  <input type="checkbox" name="practice" value={item} defaultChecked={practices.has(item)} />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="check-line">
            <input type="checkbox" name="commissions" value="yes" defaultChecked={Boolean(creatorProfile.open_to_commissions)} />
            Open to commissions
          </label>
          <div className="task-actions">
            <button className="button" type="submit" name="intent" value="save">Submit</button>
            <button className="button button-quiet" type="submit" name="intent" value="feature">Feature a piece</button>
            <button className="button button-quiet" type="submit" name="intent" value="archive">Archive posts</button>
          </div>
        </form>
        <SprintNote label="featuring and archiving from this page" />
        <p className="more"><Link href="/profile">Back to your profile</Link></p>
      </main>
    );
  }

  const record = await accountForSession(account);
  const profile = record ? await readAccountByEmail(record.email) : null;
  if (!profile) {
    return (
      <main className="page">
        <h1>Edit profile</h1>
        <p className="lede">This sign-in is not a row in the database yet.</p>
      </main>
    );
  }

  const initial = profile.name.slice(0, 1).toUpperCase();
  return (
    <main className="page">
      <p className="eyebrow">Profile</p>
      <h1>Edit profile</h1>
      <p className="lede">Name, bio, photo, and website are saved for this account.</p>
      {params.error && errors[params.error] ? <p className="note">{errors[params.error]}</p> : null}
      <form className="edit-profile panel" action={saveAnyProfile}>
        <div className="edit-photo">
          <div className="portfolio-avatar" aria-hidden="true">
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : initial}
          </div>
          <div>
            <strong>{profile.name}</strong>
            <label className="text-button">
              Change photo
              <input type="file" name="photo" accept="image/png,image/jpeg,image/gif,image/webp" />
            </label>
            {profile.avatar_url ? (
              <label className="check-line">
                <input type="checkbox" name="removePhoto" value="yes" />
                Remove current photo
              </label>
            ) : null}
          </div>
        </div>
        <label>
          Name
          <input name="name" required maxLength={120} defaultValue={profile.name} />
        </label>
        <label>
          Bio
          <textarea name="bio" maxLength={150} defaultValue={profile.bio || ""} />
        </label>
        <label>
          Website
          <input name="website" defaultValue={profile.website_url || ""} placeholder="https://" />
        </label>
        <button className="button" type="submit">Save</button>
      </form>
      <p className="more"><Link href="/profile">Back to your profile</Link></p>
    </main>
  );
}
