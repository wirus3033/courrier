import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

function GestionCourrier() {
  const [courriers, setCourriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourriers, setFilteredCourriers] = useState([]);

  useEffect(() => {
    fetchCourriers();
  }, []);

  useEffect(() => {
    filterCourriers();
  }, [searchTerm, courriers]);

  const fetchCourriers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/sortant');
      const data = await response.json();
      setCourriers(data);
      setFilteredCourriers(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des courriers:', error);
    }
  };

  const filterCourriers = () => {
    const filtered = courriers.filter((courrier) =>
      courrier.numero_courrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courrier.nom_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courrier.nom_responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courrier.observation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourriers(filtered);
  };

  return (
    <div className="gestion-container">
      <div className="header">
        <input
          type="text"
          placeholder="Rechercher un courrier..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="direction-table">
        <thead>
          <tr>
            <th>Numéro Courrier</th>
            <th>Date Sortie</th>
            <th>Observation</th>
            <th>Nom et Prénom</th>
            <th>Nom Responsable</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourriers.map((courrier) => (
            <tr key={courrier.id_sortant}>
              <td>{courrier.numero_courrier}</td>
              <td>{courrier.date_sortie}</td>
              <td>{courrier.observation}</td>
              <td>{courrier.nom_prenom}</td>
              <td>{courrier.nom_responsable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionCourrier;
