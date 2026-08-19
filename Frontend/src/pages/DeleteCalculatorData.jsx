import { Link } from "react-router-dom";

export default function DeleteCalculatorData() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back
        </Link>

        <h1 className="mt-8 text-4xl font-bold tracking-tight">
          Delete Your Calculator – Photo Vault Data
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: August 2026
        </p>

        <div className="mt-8 space-y-6 text-base leading-7 text-slate-700">
          <p>
            Calculator – Photo Vault does not require users to create an
            account. If you use cloud storage features in the app and want to
            request deletion of your associated cloud-stored data, you can
            contact us using the instructions below.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-950">
              How to request data deletion
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
              Delete my Calculator – Photo Vault data
            </p>

            <p className="mt-3">
              Please provide enough information for us to identify the relevant
              data deletion request. We may request additional information only
              when reasonably necessary to verify and process the request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-950">
              What data is deleted
            </h2>

            <p className="mt-2">
              Once a valid deletion request is processed, applicable
              cloud-stored files and associated data relating to Calculator –
              Photo Vault will be deleted from active systems.
            </p>

            <p className="mt-2">
              Data stored only locally on your device can generally be deleted
              directly by uninstalling the app or using available deletion
              features within the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-950">
              Data retention
            </h2>

            <p className="mt-2">
              Deleted data is removed from active systems. Limited information
              may be retained temporarily in backups or where retention is
              required for legal, security, fraud prevention, abuse prevention,
              or compliance purposes. Such retained information will not be
              used to restore your deleted vault data except where necessary
              for legitimate system recovery or legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-950">
              Contact
            </h2>

            <p className="mt-2">
              For data deletion requests or privacy questions relating to
              Calculator – Photo Vault, contact:
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