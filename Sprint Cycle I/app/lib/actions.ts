"use server";

import type {
  AccountStatus,
  Nomination,
  PlatformPost,
  ReportStatus,
  ReviewRequest,
} from "./store";

export async function signIn(_formData: FormData) {}

export async function signOut() {}

export async function beginApplication() {}

export async function createLogin(_formData: FormData) {}

export async function decideApplication(_accountId: string, _decision: "approved" | "rejected") {}

export async function undoApplication(_accountId: string) {}

export async function changeAccountStatus(_accountId: string, _status: AccountStatus) {}

export async function moderateReport(_id: string, _status: ReportStatus) {}

export async function reviewNomination(_id: string, _status: Nomination["status"]) {}

export async function updateCase(_formData: FormData) {}

export async function moderatePost(_id: string, _status: PlatformPost["status"]) {}

export async function createCategory(_formData: FormData) {}

export async function updateCategory(_formData: FormData) {}

export async function updateSettings(_formData: FormData) {}

export async function runReport() {}

export async function publishWork(_formData: FormData) {}

export async function decideReview(_id: string, _status: ReviewRequest["status"]) {}

export async function recordFeedback(_formData: FormData) {}

export async function fileTicket(_formData: FormData) {}

export async function replyToTicket(_formData: FormData) {}

export async function resolveTicket(_id: string) {}

export async function escalateTicket(_id: string) {}

export async function ignoreTicket(_formData: FormData) {}

export async function sendScoutNote(_formData: FormData) {}
