import SessionRow from "./SessionRow";

export default function ActiveSessionsCard({ sessions }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Active sessions
        </h2>
        <p className="text-sm text-gray-500 mt-1 max-w-lg">
          These are the devices currently signed in to your CloudBox account.
        </p>
      </div>

      {/* Sessions */}
      <div className="divide-y">
        {sessions.map((session) => (
          <SessionRow key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
