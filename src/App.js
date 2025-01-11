import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import MonProfil from "./pages/MonProfil";
import GestionCourrier from "./pages/GestionCourrier";
import GestionDirection from "./pages/GestionDirection";
import GestionUtilisateur from "./pages/GestionUtilisateur";
import Apropos from "./pages/Apropos";
import Courrier from "./pages/Courrier";
import AuthPage from "./pages/AuthPage";
import CourrierEntrant from "./pages/CourrierEntrant";
import CourrierSortant from "./pages/CourrierSortant";
import CheckCourrier from "./pages/CheckCourrier";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Topbar />
              <div style={{ display: "flex", height: "100vh" }}>
                <Sidebar />
                <div style={{ marginLeft: "200px", padding: "20px", flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/MonProfil" element={<MonProfil />} />
                    {/* <Route
                      path="/GestionCourrier"
                      element={<GestionCourrier />}
                    /> */}
                    <Route
                      path="/CourrierEntrant"
                      element={<CourrierEntrant />}
                    />
                    <Route
                      path="/CourrierSortant"
                      element={<CourrierSortant />}
                    />
                    <Route path="/CheckCourrier" element={<CheckCourrier />} />
                    <Route path="/Courrier" element={<Courrier />} />
                    <Route
                      path="/GestionDirection"
                      element={<GestionDirection />}
                    />
                    <Route
                      path="/GestionUtilisateur"
                      element={<GestionUtilisateur />}
                    />
                    <Route path="/Apropos" element={<Apropos />} />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
