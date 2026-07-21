import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import "../assets/css/components/layout.css";

export default function Layout({ title, children }) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < 992
  );

  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 992
  );

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;

      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const toggleSidebar = () => {
    isMobile
      ? setSidebarOpen((prev) => !prev)
      : setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="layout">
      <Sidebar
        isMobile={isMobile}
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() =>
          isMobile && setSidebarOpen(false)
        }
      />

      <div
        className={`layout-content ${
          sidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <Navbar
          title={title}
          onToggleSidebar={toggleSidebar}
        />

        <main className="layout-main">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}