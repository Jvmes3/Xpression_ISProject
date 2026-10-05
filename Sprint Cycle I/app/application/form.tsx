"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  APPLICANT_ROLES,
  MEDIA,
  type ApplicantRole,
  type Application,
  type AreaAnswer,
  type DraftInput,
  type MediaKind,
  isMedia,
  mediaPrompt,
  missingFields,
  questionsFor,
} from "../lib/application";

function newArea(media: MediaKind): AreaAnswer {
  return { id: crypto.randomUUID(), media, label: "", detail: "", sample: "" };
}

function withSelection(selected: MediaKind[], areas: AreaAnswer[]) {
  const kept = areas.filter((area) => selected.includes(area.media));
  if (selected.length === 0) return [];
  if (selected.length === 1) {
    const media = selected[0];
    const existing = kept.find((area) => area.media === media) ?? newArea(media);
    return [{ ...existing, label: existing.label || media }];
  }
  const next = [...kept];
  for (const media of selected) {
    if (!next.some((area) => area.media === media)) next.push(newArea(media));
  }
  return next;
}

export function ApplicationForm({
  initial,
}: {
  initial: {
    role: Application["role"];
    name: string;
    age: string;
    reason: string;
    credentials: string;
    experience: string;
    selectedMedia: MediaKind[];
    areas: AreaAnswer[];
    organization: string;
    proof: string;
  };
}) {
  const router = useRouter();
  const [role, setRole] = useState<ApplicantRole | "">(initial.role);
  const [name, setName] = useState(initial.name);
  const [age, setAge] = useState(initial.age);
  const [reason, setReason] = useState(initial.reason);
  const [credentials, setCredentials] = useState(initial.credentials);
  const [experience, setExperience] = useState(initial.experience);
  const [selected, setSelected] = useState<MediaKind[]>(initial.selectedMedia);
  const [areas, setAreas] = useState<AreaAnswer[]>(() => withSelection(initial.selectedMedia, initial.areas));
  const [organization, setOrganization] = useState(initial.organization);
  const [proof, setProof] = useState(initial.proof);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const skipSave = useRef(false);
  const payload = useRef<DraftInput | null>(null);

  const draft = (): DraftInput => ({
    role,
    name,
    age,
    reason,
    credentials,
    experience,
    selectedMedia: selected,
    areas,
    organization,
    opportunities: "",
    proof,
  });

  payload.current = draft();

  useEffect(() => {
    const sendDraft = () => {
      if (skipSave.current || !payload.current) return;
      const body = new Blob([JSON.stringify(payload.current)], { type: "application/json" });
      navigator.sendBeacon("/api/application/draft", body);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.getAttribute("target") === "_blank") return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || skipSave.current) return;
      event.preventDefault();
      event.stopPropagation();
      void fetch("/api/application/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.current),
        keepalive: true,
      }).finally(() => {
        window.location.assign(anchor.href);
      });
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", sendDraft);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", sendDraft);
    };
  }, []);

  function chooseRole(next: ApplicantRole) {
    setRole(next);
    setMessage("");
  }

  function toggleMedia(media: MediaKind) {
    const next = selected.includes(media)
      ? selected.filter((item) => item !== media)
      : [...selected, media];
    const ordered = MEDIA.filter((item) => next.includes(item));
    setSelected(ordered);
    setAreas((current) => withSelection(ordered, current));
  }

  function updateArea(id: string, patch: Partial<AreaAnswer>) {
    setAreas((current) => current.map((area) => (area.id === id ? { ...area, ...patch } : area)));
  }

  function addLine() {
    const media = selected[0];
    if (!media) return;
    setAreas((current) => [...current, newArea(media)]);
  }

  function removeLine(id: string) {
    const next = areas.filter((area) => area.id !== id);
    const still = MEDIA.filter((media) => next.some((area) => area.media === media));
    setSelected(still);
    setAreas(withSelection(still, next));
  }

  async function submit(kind: "draft" | "submit") {
    const payload = draft();
    if (kind === "submit") {
      const missing = missingFields(payload);
      if (missing) {
        setMessage(missing);
        return;
      }
    }
    setBusy(true);
    setMessage("");
    skipSave.current = true;
    const response = await fetch(kind === "draft" ? "/api/application/draft" : "/api/application/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { error?: string; message?: string };
    if (!response.ok || result.error) {
      skipSave.current = false;
      setBusy(false);
      setMessage(
        result.error === "required"
          ? result.message || "Fill in every field. A sample link can be left blank."
          : "The application could not be saved. Stay on this page and try again.",
      );
      return;
    }
    router.push("/account");
    router.refresh();
  }

  const several = selected.length > 1;
  const prompt = mediaPrompt(role);

  return (
    <form
      className="form panel"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <p className="note">
        Leaving this page keeps the application in progress. It is submitted only
        when you choose Submit application.
      </p>
      <label>
        Full name
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Amara Cole" />
      </label>
      <label>
        Age
        <input value={age} onChange={(event) => setAge(event.target.value)} inputMode="numeric" placeholder="21" />
      </label>
      <fieldset>
        <legend>Role you are applying for</legend>
        <div className="choices">
          {APPLICANT_ROLES.map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="role"
                checked={role === item}
                onChange={() => chooseRole(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        Reason for applying
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Why do you want this role on Xpression?" />
      </label>
      <label>
        Credentials
        <textarea
          value={credentials}
          onChange={(event) => setCredentials(event.target.value)}
          placeholder="School, training, or experience. Education is added here, not as your login email."
        />
      </label>

      {role ? (
        <fieldset>
          <legend>{role} questions</legend>
          {role === "Creative Mentor" ? (
            <label>
              Experience giving feedback
              <textarea
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                placeholder="Teaching, editing, critique groups, or years of practice."
              />
            </label>
          ) : null}
          {role === "Talent Scout" ? (
            <>
              <label>
                Organization, or independent
                <input value={organization} onChange={(event) => setOrganization(event.target.value)} placeholder="Northline Gallery" />
              </label>
              <label>
                How you represent that work
                <textarea
                  value={proof}
                  onChange={(event) => setProof(event.target.value)}
                  placeholder="Your role at the organization, or how creators can confirm who you are."
                />
              </label>
            </>
          ) : null}
          <fieldset>
            <legend>{prompt}</legend>
            <div className="choices">
              {MEDIA.map((media) => (
                <label key={media}>
                  <input
                    type="checkbox"
                    checked={selected.includes(media)}
                    onChange={() => toggleMedia(media)}
                  />
                  {media}
                </label>
              ))}
            </div>
          </fieldset>
          {several ? (
            <div className="area-list">
              <p>
                You chose more than one. List what you are applying for. The
                questions below follow each line.
              </p>
              {areas.map((area) => (
                <div className="area-row" key={area.id}>
                  <select
                    aria-label="Kind of work"
                    value={area.media}
                    onChange={(event) => {
                      const media = event.target.value;
                      if (!isMedia(media)) return;
                      const next = areas.map((item) => (item.id === area.id ? { ...item, media } : item));
                      setAreas(next);
                      setSelected(MEDIA.filter((item) => next.some((entry) => entry.media === item)));
                    }}
                  >
                    {selected.map((media) => (
                      <option key={media}>{media}</option>
                    ))}
                  </select>
                  <input
                    aria-label="What you are applying for"
                    value={area.label}
                    placeholder={area.media === "Music" ? "For example, jazz or beat tapes" : "For example, poetry or illustration"}
                    onChange={(event) => updateArea(area.id, { label: event.target.value })}
                  />
                  <button className="button button-quiet" type="button" onClick={() => removeLine(area.id)}>
                    Remove
                  </button>
                </div>
              ))}
              <button className="button button-quiet" type="button" onClick={addLine}>
                Add another line
              </button>
            </div>
          ) : null}
          {areas.map((area) => {
            const copy = questionsFor(role, area.media);
            const heading = several ? area.label || area.media : area.media;
            return (
              <fieldset key={area.id} className="area-block">
                <legend>{heading}</legend>
                <label>
                  {copy.detail}
                  <textarea
                    value={area.detail}
                    placeholder={copy.detailPlaceholder}
                    onChange={(event) => updateArea(area.id, { detail: event.target.value })}
                  />
                </label>
                <label>
                  {copy.sample}
                  {copy.sampleOptional ? " (optional)" : ""}
                  {role === "Creator" ? (
                    <input
                      value={area.sample}
                      placeholder={copy.samplePlaceholder}
                      onChange={(event) => updateArea(area.id, { sample: event.target.value })}
                    />
                  ) : (
                    <textarea
                      value={area.sample}
                      placeholder={copy.samplePlaceholder}
                      onChange={(event) => updateArea(area.id, { sample: event.target.value })}
                    />
                  )}
                </label>
              </fieldset>
            );
          })}
        </fieldset>
      ) : (
        <p className="meta-line">Choose Creator, Creative Mentor, or Talent Scout to open that role&apos;s questions.</p>
      )}

      <p className="note">Fill in every field before submitting. Sample page or link, and the other sample links, can be left blank.</p>
      {message ? <p className="note">{message}</p> : null}
      <div className="hero-actions">
        <button className="button" type="button" disabled={busy} onClick={() => submit("submit")}>
          Submit application
        </button>
        <button className="button button-quiet" type="button" disabled={busy} onClick={() => submit("draft")}>
          Save and finish later
        </button>
      </div>
    </form>
  );
}
