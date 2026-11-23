import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserProvider } from "./context/UserContext";

import Home from "./pages/home/Home";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard/Dashboard";
import MovieDetails from "./pages/home/components/MovieDetails";

function decodeToken(tok) {
  if (!tok) return null;
  try {
    return jwtDecode(tok);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => decodeToken(localStorage.getItem("token")));

  const setNewToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      setUser(decodeToken(newToken));
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const clearToken = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const isAuthenticated = () => !!token;

  return (
    <UserProvider
      value={{
        token,
        user,
        setNewToken,
        clearToken,
        isAuthenticated,
        isAdmin: !!user?.isAdmin
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Backward compatibility aliases */}
          <Route path="/addJob" element={<Dashboard />} />
          <Route path="/admin" element={<Dashboard />} />
          {/* Individual Movie detail views */}
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
