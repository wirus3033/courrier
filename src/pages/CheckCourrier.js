import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaInfoCircle, FaPrint } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import logo from "../assets/logoFinance.png";

function CheckCourrier() {
  const [courriers, setCourriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourriers, setFilteredCourriers] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [currentCourrier, setCurrentCourrier] = useState({
      numero_courrier: "",
      date_entree: "",
      direction: "",
      date_BE: "",
      numero_BE: "",
      refence_courrier: "",
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
      date_entree: "",
      direction: "",
      date_BE: "",
      numero_BE: "",
      refence_courrier: "",
    });
  };

  const fetchCourriers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/entrant");
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
        courrier.direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courrier.refence_courrier
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredCourriers(filtered);
  };

  const handlePrintFunction = (courrier) => {
    const doc = new jsPDF();

    // Ajout du logo
    doc.addImage(logo, "PNG", 150, 10, 40, 40);

    // En-tête
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Bordereau d'envoi", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const startY = 60;
    const lineHeight = 10;

    doc.text(`Identification: ${courrier.id_entrant}`, 20, startY);
    doc.text(
      `Numéro Courrier: ${courrier.numero_courrier}`,
      20,
      startY + lineHeight
    );
    doc.text(
      `Date Entrée: ${new Date(courrier.date_entree).toLocaleDateString(
        "fr-FR"
      )}`,
      20,
      startY + lineHeight * 2
    );
    doc.text(`Direction: ${courrier.direction}`, 20, startY + lineHeight * 3);
    doc.text(
      `Date BE: ${new Date(courrier.date_BE).toLocaleDateString("fr-FR")}`,
      20,
      startY + lineHeight * 4
    );
    doc.text(`Numéro BE: ${courrier.numero_BE}`, 20, startY + lineHeight * 5);
    doc.text(
      `Référence Courrier: ${courrier.refence_courrier}`,
      20,
      startY + lineHeight * 6
    );
    // doc.text(
    //   `Email destinataire: ${courrier.email_destinataire}`,
    //   20,
    //   startY + lineHeight * 7
    // );

    // Pied de page
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text("© 2025 - Tous droits réservés", 105, pageHeight - 10, {
      align: "center",
    });

    // Génération du PDF
    doc.save(`courrier_${courrier.numero_courrier}.pdf`);
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourriers.map((courrier) => (
            <tr key={courrier.id_entrant}>
              <td>{courrier.numero_courrier}</td>
              <td>
                {new Date(courrier.date_entree).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </td>
              <td>{courrier.direction}</td>
              <td>
                {new Date(courrier.date_BE).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </td>
              <td>{courrier.numero_BE}</td>
              <td>{courrier.refence_courrier}</td>
              <td>
                <FaPrint
                  className="icon edit-icon"
                  title="Imprimer"
                  onClick={() => handlePrintFunction(courrier)}
                />

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
              <strong>Identification:</strong> {currentCourrier.id_entrant}
            </p>
            <p>
              <strong>Numéro Courrier:</strong>{" "}
              {currentCourrier.numero_courrier}
            </p>
            <p>
              <strong>Date Entrée:</strong>{" "}
              {currentCourrier.date_entree &&
                new Date(currentCourrier.date_entree).toLocaleDateString(
                  "fr-FR"
                )}
            </p>
            <p>
              <strong>Direction:</strong> {currentCourrier.direction}
            </p>
            <p>
              <strong>Date BE:</strong>{" "}
              {currentCourrier.date_BE &&
                new Date(currentCourrier.date_BE).toLocaleDateString("fr-FR")}
            </p>
            <p>
              <strong>Numéro BE:</strong> {currentCourrier.numero_BE}
            </p>
            <p>
              <strong>Référence Courrier:</strong>{" "}
              {currentCourrier.refence_courrier}
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

export default CheckCourrier;
