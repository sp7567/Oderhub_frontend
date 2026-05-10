/**
 * layouts/MainLayout.jsx
 * Mobile-responsive layout with collapsible hamburger sidebar.
 * Features: Lazy loading, mobile overlay, theme toggle.
 */

import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard, ClipboardList, PlusCircle, RefreshCcw, BarChart3,
  Sun, Moon, Menu, X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/",              label: "Dashboard",     icon: LayoutDashboard },
  { to: "/orders",        label: "Orders",        icon: ClipboardList   },
  { to: "/orders/create", label: "Create Order",  icon: PlusCircle      },
  { to: "/orders/update", label: "Update Status", icon: RefreshCcw      },
  { to: "/analytics",     label: "Analytics",     icon: BarChart3       },
];

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      aria-label={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      className={`
        w-9 h-9 rounded-xl flex items-center justify-center shrink-0
        transition-all duration-200 hover:scale-110 active:scale-95
        ${isDark
          ? "bg-amber-400/15 text-amber-400 hover:bg-amber-400/25 border border-amber-400/25"
          : "bg-brand-50 text-brand-600 hover:bg-brand-100 border border-brand-200"
        }
      `}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

// ─── Sidebar Content ──────────────────────────────────────────────────────────
const SidebarContent = ({ onClose }) => (
  <>
    {/* Logo — clickable, goes to Dashboard */}
    <NavLink
      to="/"
      className="flex items-center gap-2.5 px-4 py-4 border-b hover:opacity-80 transition-opacity"
      style={{ borderColor: "var(--sidebar-border)" }}
    >
      <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
        O
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-sm leading-tight truncate" style={{ color: "var(--text-primary)" }}>
          OrderHub
        </p>
        <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
          Multi-Store OMS
        </p>
      </div>
      {/* Close button — mobile only */}
      {onClose && (
        <button onClick={(e) => { e.preventDefault(); onClose(); }} className="md:hidden p-1 rounded-lg hover:bg-[var(--bg-hover)]">
          <X size={18} style={{ color: "var(--text-muted)" }} />
        </button>
      )}
    </NavLink>

    {/* Navigation */}
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={onClose} // Close mobile drawer on nav
          id={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-brand-600/10 text-brand-600 border border-brand-200 dark:bg-brand-600/20 dark:text-brand-400 dark:border-brand-600/30"
                : "hover:bg-[var(--bg-hover)]"
            }`
          }
          style={({ isActive }) => isActive ? {} : { color: "var(--text-muted)" }}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>

    {/* Footer */}
    <div
      className="px-4 py-3 border-t text-[11px]"
      style={{ borderColor: "var(--sidebar-border)", color: "var(--text-muted)" }}
    >
      v1.0.0 — Production
    </div>
  </>
);

// ─── Main Layout ──────────────────────────────────────────────────────────────
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-page)" }}>

      {/* ── Desktop Sidebar (always visible on md+) ── */}
      <aside
        className="hidden md:flex w-60 shrink-0 flex-col border-r"
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderColor: "var(--sidebar-border)",
          transition: "background-color 0.25s, border-color 0.25s",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-64 flex flex-col border-r
          transition-transform duration-300 ease-in-out md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          backgroundColor: "var(--sidebar-bg)",
          borderColor: "var(--sidebar-border)",
        }}
      >
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-auto min-w-0" style={{ backgroundColor: "var(--bg-page)" }}>
        {/* Header */}
        <header
          className="shrink-0 flex items-center justify-between px-4 md:px-6 py-3 border-b"
          style={{
            backgroundColor: "var(--sidebar-bg)",
            borderColor: "var(--sidebar-border)",
            transition: "background-color 0.25s, border-color 0.25s",
          }}
        >
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} style={{ color: "var(--text-muted)" }} />
          </button>

          {/* Mobile Logo (shown in header when sidebar is hidden) */}
          <span className="md:hidden font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            OrderHub
          </span>

          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
