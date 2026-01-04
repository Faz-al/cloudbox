import Navbar from "../components/Navbar";
import StorageBar from "../components/StorageBar";
import UploadBox from "../components/UploadBox";
import { getUser } from "../utils/auth";

export default function Dashboard() {
  const user = getUser();

  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome
        </h1>
        <p className="text-gray-600 mb-6">
          {user?.email}
        </p>

        <StorageBar />
        <UploadBox />
      </main>
    </>
  );
}
