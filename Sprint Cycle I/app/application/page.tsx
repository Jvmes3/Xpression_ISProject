import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAccount } from "../lib/session";
import { ApplicationForm } from "./form";

export const dynamic = "force-dynamic";

export default async function ApplicationPage() {
  const account = await currentAccount();
  if (!account || account.role !== "applicant" || !account.application) {
    return (
      <main className="page">
        <h1>Your application</h1>
        <p className="lede">Create an application login before you begin. That email and password are how you return to this form.</p>
        <p><Link className="button" href="/apply">Create an application login</Link></p>
      </main>
    );
  }

  const status = account.application.status;
  if (status === "pending" || status === "approved" || status === "rejected") {
    redirect("/application/answers");
  }

  return (
    <main className="page">
      <p className="eyebrow">Application</p>
      <h1>Your application</h1>
      <p className="lede">
        These are the questions for the role you choose. You can leave and sign
        in later with {account.email} and your password to finish. The
        application stays in progress until you submit it.
      </p>
      <p className="meta-line">Application email · {account.email}</p>
      <ApplicationForm initial={account.application} />
    </main>
  );
}
