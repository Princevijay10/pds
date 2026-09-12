import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const PublicLayout = () => (
  <div className="flex min-h-screen flex-col bg-obsidian">
    <Navbar />
    <main className="flex-1 pt-[76px]">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
