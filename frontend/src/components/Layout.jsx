import React from "react";

import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  FileText,
  Briefcase,
  BarChart3,
  BookOpen,
  History,
  LogOut,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  useAuth,
} from "../context/AuthContext";

const Layout = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const {
    logout: handleLogout,
  } = useAuth();

  const sessionId = localStorage.getItem("sessionId");

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Resume",
      path: "/resume-upload",
      icon: FileText,
    },
    {
      name: "Job Description",
      path: "/job-description",
      icon: FileText,
    },
    {
      name: "ATS Report",
      path: "/ats-result",
      icon: BarChart3,
    },
    {
      name: "Mock Interview",
      path: "/mock-interview",
      icon: Briefcase,
    },
    {
      name: "Revision Plan",
      path: sessionId
        ? `/revision-plan/${sessionId}`
        : "#",
      icon: BookOpen,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },
  ];

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  const handleNavigation = (item) => {
    if (
      item.name === "Revision Plan" &&
      !sessionId
    ) {
      alert(
        "Complete a Mock Interview first to generate your Revision Plan."
      );
      return;
    }

    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7FF] to-[#F3F0FF] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl border-r border-[#ECE8FF] min-h-screen px-8 py-10 relative">
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <h1 className="text-3xl font-black text-[#493D9E]">
            AI Copilot
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Interview Intelligence
          </p>
        </motion.div>

        <nav className="space-y-4 mt-12">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              (item.name === "Revision Plan" &&
                location.pathname.startsWith("/revision-plan/"));

            return (
              <motion.button
                key={item.name}
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() =>
                  handleNavigation(item)
                }
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition ${
                  active
                    ? "bg-[#F3F0FF] text-[#6D5BD0] shadow-md"
                    : "hover:bg-[#F3F0FF] text-gray-700"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="absolute bottom-10 flex items-center gap-3 text-red-500 font-medium hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;