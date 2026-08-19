import { Link } from "react-router-dom";

export default function DeleteAccount() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to SafeVault
        </Link>

        <h1 className="mt-8 text-4xl font-bold tracking-tight">
          Delete Your SafeVault Account
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: January 2026
        </p>

        <div className="mt-8 space-y-6 text-base leading-7 text-slate-700">
          <p>
            If you want to delete your SafeVault account and associated data,
            please contact us from the email address linked to your SafeVault
            account.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-950">
              How to request account deletion
            </h2>

            <p className="mt-2">
              Send an email to{" "}
              <a
                href="mailto:support@safevault.in"
                className="font-semibold text-blue-600"
              >
                Acidhouseonline@gmail.com
              </a>{" "}
              with the subject line:
            </p>

            <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 font-semibold text-slate-900">
              Delete my SafeVault account
            </p>

            <p className="mt-3">
              Please include the email address connected to your SafeVault
              account. We may ask for additional verification before processing
              the request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-950">
              What data is deleted
            </h2>

            <p className="mt-2">
              When your request is verified, we will delete your SafeVault
              account and associated stored files from active systems.
            </p>

            <p className="mt-2">
              Some limited information may be retained where required for legal,
              security, fraud prevention, abuse prevention, backup, or compliance
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-950">
              Delete files without deleting your account
            </h2>

            <p className="mt-2">
              You can delete individual files from your SafeVault account using
              the app. Deleted files may be moved to Trash before permanent
              removal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-950">Contact</h2>

            <p className="mt-2">
              For account deletion requests or privacy questions, contact:
            </p>

            <p className="font-semibold text-slate-950">
              Acidhouseonline@gmail.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}