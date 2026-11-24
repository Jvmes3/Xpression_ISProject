import { currentAccount } from "../../lib/session";
import { saveUpload } from "../../lib/uploads";
export const runtime = "nodejs";
export async function POST(request: Request) {
    const account = await currentAccount();
    if (!account || account.status !== "active") {
        return Response.json({ error: "Sign in before attaching a file." }, { status: 401 });
    }
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
        return Response.json({ error: "Choose a file to attach." }, { status: 400 });
    }
    const saved = await saveUpload(file);
    if ("error" in saved)
        return Response.json(saved, { status: 400 });
    return Response.json(saved);
}
