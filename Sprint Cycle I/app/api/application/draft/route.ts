import { type DraftInput } from "../../../lib/application";
import { currentAccount } from "../../../lib/session";
import { saveDraft } from "../../../lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const account = await currentAccount();
  if (!account || account.role !== "applicant") {
    return Response.json({ error: "sign-in" }, { status: 401 });
  }
  const body = (await request.json()) as DraftInput;
  const result = await saveDraft(account.id, body);
  return Response.json(result);
}
