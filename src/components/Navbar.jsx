import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import notyf from "../utils/notyf";

function Navbar() {
  const { user, clearToken, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    notyf.success("Logged out successfully");
    navigate("/");
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-xs"
        : "text-slate-600 hover:text-blue-600 hover:bg-slate-100"
    }`;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <span className="text-xl">🎬</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  Movie App
                </span>
                <span className="text-[10px] text-blue-600 font-semibold tracking-wider uppercase -mt-1">
                  Catalog
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Movies Catalog
            </NavLink>

            {isAuthenticated() && user?.isAdmin && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Admin Dashboard
              </NavLink>
            )}
          </div>

          {/* Auth section desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated() ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-medium">{user?.email}</span>
                  {user?.isAdmin && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
              >
                Sign In / Register
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-xl text-sm font-medium ${
                isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            Movies Catalog
          </NavLink>

          {isAuthenticated() && user?.isAdmin && (
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl text-sm font-medium ${
                  isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Admin Dashboard
            </NavLink>
          )}

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated() ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-500 px-3">
                  Signed in as <span className="font-semibold text-slate-900">{user?.email}</span>
                  {user?.isAdmin && <span className="text-blue-600 font-bold ml-1">(Admin)</span>}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
