"use client";

import { useState } from "react";
import { SampleLinkField } from "../../../components/SampleLinkField";
import { publishWork } from "../../../lib/actions";

const notes: Record<string, string> = {
  required: "Add a title before publishing.",
  picture: "Visual art needs a picture attached before it can be published.",
  music: "A music piece needs a link before it can be published.",
  writing: "Writing needs a description or an attached document before it can be published.",
  account: "This sign-in is not a Creator row in the database. Approve a creator application, then sign in with the role email.",
};

export function PublishForm({ error = "" }: { error?: string }) {
  const [media, setMedia] = useState("Writing");
  const attachment = media === "Visual art"
    ? {
        label: "Picture",
        placeholder: "Attach a PNG, JPG, GIF, or WEBP",
        accept: ".png,.jpg,.jpeg,.gif,.webp,image/png,image/jpeg,image/gif,image/webp",
        showAttach: true,
      }
    : media === "Music"
      ? {
          label: "Link",
          placeholder: "https://soundcloud.com/you/track",
          accept: "",
          showAttach: false,
        }
      : {
          label: "Document",
          placeholder: "Attach a PDF or text file, or leave this blank if the description is filled in",
          accept: ".pdf,.txt,application/pdf,text/plain",
          showAttach: true,
        };

  return (
    <form className="form panel" action={publishWork}>
      <label>
        Title
        <input name="title" placeholder="Night bus" />
      </label>
      <label>
        Kind of work
        <select name="media" value={media} onChange={(event) => setMedia(event.target.value)}>
          <option>Writing</option>
          <option>Visual art</option>
          <option>Music</option>
        </select>
      </label>
      <label>
        Description
        <textarea name="description" placeholder={media === "Writing" ? "The writing itself, or a note about the attached document." : "Optional. What should people know about this piece?"} />
      </label>
      <SampleLinkField
        key={media}
        label={attachment.label}
        name="link"
        placeholder={attachment.placeholder}
        accept={attachment.accept}
        showAttach={attachment.showAttach}
      />
      {notes[error] ? <p className="note">{notes[error]}</p> : null}
      <button className="button" type="submit">Publish</button>
    </form>
  );
}
