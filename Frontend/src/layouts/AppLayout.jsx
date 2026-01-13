import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto min-h-[80vh]">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
