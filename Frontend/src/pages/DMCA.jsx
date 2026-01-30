import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export default function DMCA() {
  console.log("API URL:", process.env.REACT_APP_API_URL);


  const [params] = useSearchParams();

  const [done, setDone] = useState(false);

  const field =
    "w-full border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    copyrightedWork: "",
    infringingUrl: "",
    goodFaith: false,
    accuracy: false,
    signature: ""
  });

  useEffect(() => {
    const url = params.get("url");
    if (url) {
      setForm(f => ({ ...f, infringingUrl: url }));
    }
  }, []);

  const [error, setError] = useState("");

const submit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.goodFaith || !form.accuracy) {
    setError("You must confirm both legal statements to submit a DMCA notice.");
    return;
  }

  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/dmca/submit`,
      form
    );
    setDone(true);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Failed to submit DMCA notice. Please check your information."
    );
  }
};


  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center p-6">
        <div className="bg-white p-10 rounded-xl border max-w-md text-center space-y-4">
          <h2 className="text-xl font-semibold">DMCA Notice Received</h2>
          <p className="text-slate-600 text-sm">
            Your request has been submitted. Our legal team will review it and take
            appropriate action.
          </p>
          <Link to="/" className="text-blue-600 text-sm hover:underline">
            Return to SafeVault
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center p-6">
      <div className="bg-white w-full max-w-3xl p-10 rounded-xl border space-y-6">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            DMCA Takedown Notice
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Use this form to report content that you believe infringes your copyright.
            Submitting false claims may result in legal liability.
          </p>
        </div>


        {error && (
  <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
    {error}
  </div>
)}







        <form onSubmit={submit} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Full legal name"
              className={field}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              placeholder="Company (optional)"
              className={field}
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
            />
          </div>

          <input
            placeholder="Email address"
            type="email"
            className={field}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          <textarea
            placeholder="Describe the copyrighted work you own"
            className={`${field} h-24`}
            value={form.copyrightedWork}
            onChange={e => setForm({ ...form, copyrightedWork: e.target.value })}
            required
          />

          <input
            placeholder="Infringing SafeVault URL"
            className={field}
            value={form.infringingUrl}
            onChange={e => setForm({ ...form, infringingUrl: e.target.value })}
            required
          />

          <div className="space-y-2 text-sm text-slate-700">
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={form.goodFaith}
                onChange={e => setForm({ ...form, goodFaith: e.target.checked })}
              />
              I have a good-faith belief that this use is not authorized by the copyright owner.
            </label>

            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={form.accuracy}
                onChange={e => setForm({ ...form, accuracy: e.target.checked })}
              />
              I swear, under penalty of perjury, that this information is accurate.
            </label>
          </div>

          <input
            placeholder="Type your full legal name as signature"
            className={field}
            value={form.signature}
            onChange={e => setForm({ ...form, signature: e.target.value })}
            required
          />

          <button className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-black">
            Submit DMCA Notice
          </button>

        </form>

        <p className="text-xs text-slate-400">
          This form is governed by the Digital Millennium Copyright Act (17 U.S.C. §512).
        </p>

      </div>
    </div>
  );
}
