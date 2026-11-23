import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import api from "../../api";
import notyf from "../../utils/notyf";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Auth() {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.token) {
      navigate("/");
    }
  }, [user?.token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (isRegister && form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Register endpoint: POST /users/register
        const res = await api.post("/users/register", form);
        notyf.success(res.data?.message || "Registered successfully! Logging you in...");

        // Automatically log in after registration
        try {
          const loginRes = await api.post("/users/login", form);
          const token = loginRes.data.access || loginRes.data.token;
          if (token) {
            user.setNewToken(token);
            notyf.success("Logged in successfully!");
            navigate("/");
            return;
          }
        } catch {
          // If auto login fails, switch to login tab
          setIsRegister(false);
        }
      } else {
        // Login endpoint: POST /users/login
        const res = await api.post("/users/login", form);
        const token = res.data.access || res.data.token;

        if (token) {
          user.setNewToken(token);
          notyf.success("Logged in successfully!");
          navigate("/");
        } else {
          setError("No access token received from server.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        "Authentication failed. Please check your credentials.";
      setError(errMsg);
      notyf.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 items-center justify-center text-white shadow-md shadow-blue-500/20 mb-3">
              <span className="text-2xl">🎬</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {isRegister ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isRegister
                ? "Sign up to explore, view, and comment on movies"
                : "Sign in with your email and password"}
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !isRegister
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isRegister
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {isRegister && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Must be at least 8 characters long.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all mt-2 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Quick toggle link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {isRegister ? "Already have an account?" : "Don't have an account yet?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4 cursor-pointer"
            >
              {isRegister ? "Sign in instead" : "Register now"}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            <p>Admin demo: <code className="text-slate-600 font-medium">admin@mail.com</code> / <code className="text-slate-600 font-medium">admin123</code></p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
