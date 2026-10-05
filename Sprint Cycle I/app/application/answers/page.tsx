import Link from "next/link";
import { redirect } from "next/navigation";
import { Answers } from "../../components/Answers";
import { answerLines } from "../../lib/application";
import { currentAccount } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function AnswersPage() {
  const account = await currentAccount();
  if (!account || account.role !== "applicant" || !account.application) {
    redirect("/sign-in");
  }
  const application = account.application;
  if (application.status === "new" || application.status === "draft") {
    redirect("/application");
  }

  return (
    <main className="page">
      <p className="eyebrow">Submitted</p>
      <h1>Your answers</h1>
      <p className="lede">
        This application has been submitted, so the answers can be read and not
        edited.
      </p>
      <Answers rows={answerLines(account.email, application)} />
      <p className="more">
        <Link href="/account">Back to application status</Link>
      </p>
    </main>
  );
}
