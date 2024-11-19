// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import MonProfil from './pages/MonProfil';
import GestionCourrier from './pages/GestionCourrier';
import GestionDirection from './pages/GestionDirection';
import GestionUtilisateur from './pages/GestionUtilisateur';
import Apropos from './pages/Apropos';
import Courrier from './pages/Courrier';


const App = () => {
  return (
    <Router>
      <Topbar />
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ marginLeft: '200px', padding: '20px', flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/MonProfil" element={<MonProfil />} />
            <Route path="/GestionCourrier" element={<GestionCourrier />} />
            <Route path="/Courrier" element={<Courrier />} />
            <Route path="/GestionDirection" element={<GestionDirection />} />
            <Route path="/GestionUtilisateur" element={<GestionUtilisateur />} />
            <Route path="/Aprops" element={<Apropos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
