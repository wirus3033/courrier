import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

function CheckCourrier() {
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
      const response = await fetch('http://localhost:4000/api/entrant');
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
      courrier.direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courrier.refence_courrier.toLowerCase().includes(searchTerm.toLowerCase())
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
            <th>Date Entrée</th>
            <th>Direction</th>
            <th>Date BE</th>
            <th>Numéro BE</th>
            <th>Référence Courrier</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourriers.map((courrier) => (
            <tr key={courrier.id_entrant}>
              <td>{courrier.numero_courrier}</td>
              <td>{courrier.date_entree}</td>
              <td>{courrier.direction}</td>
              <td>{courrier.date_BE}</td>
              <td>{courrier.numero_BE}</td>
              <td>{courrier.refence_courrier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CheckCourrier;
