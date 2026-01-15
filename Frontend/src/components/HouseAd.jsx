export default function HouseAd() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
      <div className="text-blue-600 font-semibold text-lg">☁ CloudBox</div>
      <p className="text-sm text-gray-500">
        Upload, share, and protect your files securely.
      </p>
      <a
        href="/"
        className="text-sm text-blue-600 underline hover:text-blue-700"
      >
        Upload your own files
      </a>
    </div>
  );
}
