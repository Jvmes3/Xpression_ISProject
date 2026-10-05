export const MEDIA = ["Writing", "Visual art", "Music"] as const;
export type MediaKind = (typeof MEDIA)[number];

export const APPLICANT_ROLES = ["Creator", "Creative Mentor", "Talent Scout"] as const;
export type ApplicantRole = (typeof APPLICANT_ROLES)[number];

export type AppStatus = "new" | "draft" | "pending" | "approved" | "rejected";

export type AreaAnswer = {
  id: string;
  media: MediaKind;
  label: string;
  detail: string;
  sample: string;
};

export type Application = {
  status: AppStatus;
  role: ApplicantRole | "";
  name: string;
  age: string;
  reason: string;
  credentials: string;
  experience: string;
  selectedMedia: MediaKind[];
  areas: AreaAnswer[];
  organization: string;
  opportunities: string;
  proof: string;
  xpressionEmail: string;
  xpressionPassword: string;
  xpressionSalt: string;
  xpressionPasswordHash: string;
};

export type DraftInput = {
  role: string;
  name: string;
  age: string;
  reason: string;
  credentials: string;
  experience: string;
  selectedMedia: string[];
  areas: AreaAnswer[];
  organization: string;
  opportunities: string;
  proof: string;
};

export function emptyApplication(): Application {
  return {
    status: "new",
    role: "",
    name: "",
    age: "",
    reason: "",
    credentials: "",
    experience: "",
    selectedMedia: [],
    areas: [],
    organization: "",
    opportunities: "",
    proof: "",
    xpressionEmail: "",
    xpressionPassword: "",
    xpressionSalt: "",
    xpressionPasswordHash: "",
  };
}

export function isMedia(value: string): value is MediaKind {
  return (MEDIA as readonly string[]).includes(value);
}

export function isApplicantRole(value: string): value is ApplicantRole {
  return (APPLICANT_ROLES as readonly string[]).includes(value);
}

export function roleHome(role: ApplicantRole | "") {
  if (role === "Creator") return "/creator/desk";
  if (role === "Creative Mentor") return "/mentor/desk";
  if (role === "Talent Scout") return "/scout/desk";
  return "/account";
}

export function questionsFor(role: ApplicantRole | "", media: MediaKind) {
  if (role === "Creative Mentor") {
    if (media === "Writing") {
      return {
        detail: "What writing will you review?",
        detailPlaceholder: "Poetry, essays, fiction, or scripts.",
        sample: "Example of feedback on a piece of writing",
        samplePlaceholder: "Name what is working, then one place the draft can be clearer.",
        sampleOptional: false,
      };
    }
    if (media === "Visual art") {
      return {
        detail: "What visual art will you review?",
        detailPlaceholder: "Illustration, painting, photography, or design.",
        sample: "Example of feedback on a piece of visual art",
        samplePlaceholder: "Describe the strength you see, then one change you would suggest.",
        sampleOptional: false,
      };
    }
    return {
      detail: "What music will you review?",
      detailPlaceholder: "Songs, beats, scores, or recorded performances.",
      sample: "Example of feedback on a track",
      samplePlaceholder: "Comment on structure, performance, or the recording.",
      sampleOptional: false,
    };
  }

  if (role === "Talent Scout") {
    return {
      detail: `What ${media.toLowerCase()} opportunities will you offer?`,
      detailPlaceholder: "Commissions, exhibitions, performances, publishing, or collaborations.",
      sample: "How creators can confirm this opportunity",
      samplePlaceholder: "A page, organization, or person creators can check.",
      sampleOptional: false,
    };
  }

  if (media === "Writing") {
    return {
      detail: "What writing are you applying to publish?",
      detailPlaceholder: "Poems, essays, stories, or scripts.",
      sample: "Sample page or link",
      samplePlaceholder: "https://example.com/your-writing",
      sampleOptional: true,
    };
  }
  if (media === "Visual art") {
    return {
      detail: "What visual art are you applying to publish?",
      detailPlaceholder: "Studies, illustrations, or finished pieces.",
      sample: "Image or portfolio link",
      samplePlaceholder: "https://example.com/your-art",
      sampleOptional: true,
    };
  }
  return {
    detail: "What music are you applying to publish?",
    detailPlaceholder: "Songs, instrumentals, or recorded performances.",
    sample: "SoundCloud or sample link",
    samplePlaceholder: "https://soundcloud.com/you/track",
    sampleOptional: true,
  };
}

export function missingFields(input: DraftInput) {
  const draft = sanitizeDraft(input);
  if (!draft.role) return "Choose the role you are applying for.";
  if (!draft.name.trim()) return "Enter your full name.";
  if (!/^\d{1,3}$/.test(draft.age.trim())) return "Enter your age.";
  if (!draft.reason.trim()) return "Enter your reason for applying.";
  if (!draft.credentials.trim()) return "Enter your credentials.";
  if (draft.role === "Creative Mentor" && !draft.experience.trim()) {
    return "Enter your experience giving feedback.";
  }
  if (draft.role === "Talent Scout") {
    if (!draft.organization.trim()) return "Enter your organization, or independent.";
    if (!draft.proof.trim()) return "Enter how you represent that work.";
  }
  if (draft.selectedMedia.length === 0 || draft.areas.length === 0) {
    return "Choose at least one kind of work.";
  }
  for (const area of draft.areas) {
    if (draft.selectedMedia.length > 1 && !area.label.trim()) {
      return "Name each kind of work you are applying for.";
    }
    if (!area.detail.trim()) return "Answer every question. A sample link can be left blank.";
    const copy = questionsFor(draft.role, area.media);
    if (!copy.sampleOptional && !area.sample.trim()) {
      return "Answer every question. A sample link can be left blank.";
    }
  }
  return "";
}

export function answerLines(email: string, application: Application) {
  const lines: { label: string; value: string }[] = [
    { label: "Email", value: email.trim() },
    { label: "Full name", value: application.name.trim() },
    { label: "Age", value: application.age.trim() },
    { label: "Role", value: application.role },
    { label: "Reason for applying", value: application.reason.trim() },
    { label: "Credentials", value: application.credentials.trim() },
  ];
  if (application.role === "Creative Mentor") {
    lines.push({ label: "Experience giving feedback", value: application.experience.trim() });
  }
  if (application.role === "Talent Scout") {
    lines.push({ label: "Organization", value: application.organization.trim() });
    lines.push({ label: "How you represent that work", value: application.proof.trim() });
  }
  for (const area of application.areas) {
    const copy = questionsFor(application.role, area.media);
    const title = area.label.trim() || area.media;
    if (area.detail.trim()) lines.push({ label: `${title} · ${copy.detail}`, value: area.detail.trim() });
    if (area.sample.trim()) lines.push({ label: `${title} · ${copy.sample}`, value: area.sample.trim() });
  }
  return lines.filter((line) => line.value);
}

export function mediaPrompt(role: ApplicantRole | "") {
  if (role === "Creative Mentor") return "What do you review?";
  if (role === "Talent Scout") return "What work are you looking for?";
  return "What do you make?";
}

export function sanitizeDraft(input: DraftInput): Omit<
  Application,
  "status" | "xpressionEmail" | "xpressionPassword" | "xpressionSalt" | "xpressionPasswordHash"
> {
  const role = isApplicantRole(input.role) ? input.role : "";
  const selectedMedia = (input.selectedMedia || []).filter(isMedia);
  const areas = (input.areas || [])
    .filter((area) => area && isMedia(area.media) && selectedMedia.includes(area.media))
    .map((area) => ({
      id: String(area.id || ""),
      media: area.media,
      label: String(area.label || "").slice(0, 120),
      detail: String(area.detail || "").slice(0, 4000),
      sample: String(area.sample || "").slice(0, 2000),
    }));

  return {
    role,
    name: String(input.name || "").slice(0, 120),
    age: String(input.age || "").slice(0, 3),
    reason: String(input.reason || "").slice(0, 4000),
    credentials: String(input.credentials || "").slice(0, 4000),
    experience: String(input.experience || "").slice(0, 4000),
    selectedMedia,
    areas,
    organization: String(input.organization || "").slice(0, 200),
    opportunities: String(input.opportunities || "").slice(0, 4000),
    proof: String(input.proof || "").slice(0, 4000),
  };
}
