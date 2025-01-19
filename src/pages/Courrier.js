import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";

function GestionCourrier() {
  const [courriers, setCourriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourriers, setFilteredCourriers] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currentCourrier, setCurrentCourrier] = useState({
      numero_courrier: "",
      date_sortie: "",
      observation: "",
      nom_prenom: "",
      nom_responsable: "",
    });

  useEffect(() => {
    fetchCourriers();
  }, []);

  useEffect(() => {
    filterCourriers();
  }, [searchTerm, courriers]);

  const handleShowDetails = (courrier) => {
    setCurrentCourrier(courrier);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setCurrentCourrier({
      numero_courrier: "",
      date_sortie: "",
      observation: "",
      nom_prenom: "",
      nom_responsable: "",
    });
  };

  const fetchCourriers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/sortant");
      const data = await response.json();
      setCourriers(data);
      setFilteredCourriers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des courriers:", error);
    }
  };

  const filterCourriers = () => {
    const filtered = courriers.filter(
      (courrier) =>
        courrier.numero_courrier
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        courrier.nom_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courrier.nom_responsable
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourriers.map((courrier) => (
            <tr key={courrier.id_sortant}>
              <td>{courrier.numero_courrier}</td>
              <td>
                {new Date(courrier.date_sortie).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </td>
              <td>{courrier.observation}</td>
              <td>{courrier.nom_prenom}</td>
              <td>{courrier.nom_responsable}</td>
              <td>
                <FaInfoCircle
                  className="icon edit-icon"
                  title="Détails"
                  onClick={() => handleShowDetails(courrier)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showDetailsModal} onHide={handleCloseDetails} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails du courrier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="details-container">
            <p>
              <strong>Identification:</strong> {currentCourrier.id_sortant}
            </p>
            <p>
              <strong>Numéro Courrier:</strong>{" "}
              {currentCourrier.numero_courrier}
            </p>
            <p>
              <strong>Date sortie:</strong>{" "}
              {currentCourrier.date_sortie &&
                new Date(currentCourrier.date_sortie).toLocaleDateString(
                  "fr-FR"
                )}
            </p>
            <p>
              <strong> observation:</strong> {currentCourrier.observation}
            </p>
            <p>
              <strong> Nom et prénom:</strong> {currentCourrier.nom_prenom}
            </p>
            <p>
              <strong>nom_responsable:</strong>{" "}
              {currentCourrier.nom_responsable}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionCourrier;
