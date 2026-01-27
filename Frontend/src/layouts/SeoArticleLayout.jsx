import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function SeoArticleLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Marketing Navbar (no sidebar) */}
      <Navbar />

      {/* Content Area */}
      <main className="flex-1 bg-white">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
