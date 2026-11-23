import {useState} from "react"; // ref(), data(), reactive()

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // <<

import Home from "./pages/home/Home"
import Auth from "./pages/auth/Auth.jsx"
import AddJob from "./pages/dashboard/Dashboard"


function App() {
     
   const [token, setToken] = useState(localStorage.getItem("token") || null);
   const setNewToken = (newToken) => {
       setToken(newToken);
       localStorage.setItem("token", newToken);
   };

   const clearToken = () => {
       setToken(null);
       localStorage.removeItem("token");
   };

   const isAuthenticated = () => !!token;

  return (
    <UserProvider value={{ token, setNewToken, clearToken, isAuthenticated }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/addJob" element={<AddJob />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App 
