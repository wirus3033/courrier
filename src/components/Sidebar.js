import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/MonProfil">Mon Profil</Link>
        </li>
        {user?.role === 'administrateur' && (
          <>
            <li>
              <Link to="/GestionUtilisateur">Gestion des Utilisateurs</Link>
            </li>
            <li>
              <Link to="/GestionDirection">Gestion des Directions</Link>
            </li>
          </>
        )}
        {user?.role === 'secretaire' && (
          <li>
            <Link to="/GestionCourrier">Gestion des Courriers</Link>
          </li>
        )}
        <li>
          <Link to="/Apropos">À propos</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
