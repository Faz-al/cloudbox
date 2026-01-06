export default function SessionRow({ session }) {
  return (
    <div className="flex items-center justify-between py-5">
      {/* Left */}
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">
            {session.device}
          </p>

          {session.isCurrent && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              This device
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {session.location} • IP {session.ip}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Last active {session.lastActive}
        </p>
      </div>

      {/* Right */}
      {!session.isCurrent && (
        <button className="text-sm font-medium text-red-600 hover:text-red-700">
          Sign out
        </button>
      )}
    </div>
  );
}
