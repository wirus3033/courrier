import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/style/authpage.css";

function AuthPage() {
  const [pseudo, setPseudo] = useState("");
  const [passe, setPasse] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, passe }),
      });

      if (!response.ok) {
        throw new Error("Échec de la connexion. Vérifiez vos identifiants.");
      }

      const data = await response.json();
      login(data.token, data.role);

      // Redirection selon le rôle
      if (data.role === 1) {
        // Admin
        navigate("/GestionUtilisateur");
      } else if (data.role === 2) {
        // Secrétaire
        navigate("/GestionCourrier");
      } else {
        // Utilisateur
        navigate("/MonProfil");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Page d'authentification</h2>
      <img src="./logoFinance.png" alt="Logo" className="logo" />
      <form className="auth-form" onSubmit={handleLogin}>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Matricule"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={passe}
          onChange={(e) => setPasse(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default AuthPage;
