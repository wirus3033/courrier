import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPrint, FaInfoCircle } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import "../assets/style/CourrierEntrant.css";
import jsPDF from "jspdf";
import logo from "../assets/logoFinance.png";

function CourrierEntrant() {
  const [courriers, setCourriers] = useState([]);
  const [filteredCourriers, setFilteredCourriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [courrierId, setCourrierId] = useState(null);
  const [currentCourrier, setCurrentCourrier] = useState({
    numero_courrier: "",
    date_entree: "",
    direction: "",
    date_BE: "",
    numero_BE: "",
    refence_courrier: "",
    email_destinataire: "",
  });
  const [selectedCourrierId, setSelectedCourrierId] = useState(null);
  const [directions, setDirections] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchCourriers();
    fetchDirections();
  }, []);

  useEffect(() => {
    filterCourriers();
  }, [searchTerm, courriers]);

  const fetchDirections = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/directions");
      const data = await response.json();
      setDirections(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des directions:", error);
    }
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
    const filtered = courriers.filter((courrier) =>
      courrier.numero_courrier.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourriers(filtered);
  };

  const handleShowModal = (action, courrier = null, id = null) => {
    setModalAction(action);
    setCurrentCourrier(
      courrier || {
        numero_courrier: "",
        date_entree: "",
        direction: "",
        date_BE: "",
        numero_BE: "",
        refence_courrier: "",
        email_destinataire: "",
      }
    );
    setSelectedCourrierId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCourrier({
      numero_courrier: "",
      date_entree: "",
      direction: "",
      date_BE: "",
      numero_BE: "",
      refence_courrier: "",
      email_destinataire: "",
    });
  };

  const handleShowAlertModal = (id) => {
    setCourrierId(id);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => {
    setShowAlertModal(false);
    setCourrierId(null);
  };

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
      email_destinataire: "",
    });
  };

  const handleSubmit = async () => {
    try {
      const url =
        modalAction === "Ajouter"
          ? "http://localhost:4000/api/entrant"
          : `http://localhost:4000/api/entrant/${selectedCourrierId}`;

      const method = modalAction === "Ajouter" ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentCourrier),
      });

      if (response.ok) {
        handleCloseModal();
        fetchCourriers();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/entrant/${courrierId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchCourriers();
        handleCloseAlertModal();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
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
    doc.text(
      `Email destinataire: ${courrier.email_destinataire}`,
      20,
      startY + lineHeight * 7
    );

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
        <button
          className="btn btn-primary"
          onClick={() => handleShowModal("Ajouter")}
        >
          Nouveau courrier
        </button>
        <input
          type="text"
          placeholder="Rechercher un courrier"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="direction-table">
        <thead>
          <tr>
            <th>Identification</th>
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
              <td>{courrier.id_entrant}</td>
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
                <FaEdit
                  className="icon edit-icon"
                  title="Modifier"
                  onClick={() =>
                    handleShowModal("Modifier", courrier, courrier.id_entrant)
                  }
                />
                <FaTrash
                  className="icon delete-icon"
                  title="Supprimer"
                  onClick={() => handleShowAlertModal(courrier.id_entrant)}
                />
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

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalAction} un courrier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Numéro Courrier</Form.Label>
              <Form.Control
                type="text"
                value={currentCourrier.numero_courrier}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    numero_courrier: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date Entrée</Form.Label>
              <Form.Control
                type="date"
                value={currentCourrier.date_entree}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    date_entree: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Direction</Form.Label>
              <Form.Control
                as="select"
                value={currentCourrier.direction}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    direction: e.target.value,
                  })
                }
              >
                <option value="">-- Sélectionnez une direction --</option>
                {directions.map((direction) => (
                  <option key={direction.id} value={direction.nom_direction}>
                    {direction.nom_direction}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Date BE</Form.Label>
              <Form.Control
                type="date"
                value={currentCourrier.date_BE}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    date_BE: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Numéro BE</Form.Label>
              <Form.Control
                type="text"
                value={currentCourrier.numero_BE}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    numero_BE: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Référence Courrier</Form.Label>
              <Form.Control
                type="text"
                value={currentCourrier.refence_courrier}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    refence_courrier: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email du destinataire</Form.Label>
              <Form.Control
                type="email"
                value={currentCourrier.email_destinataire}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    email_destinataire: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalAction}
          </Button>
        </Modal.Footer>
      </Modal>
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
            <p>
              <strong>Email destinataire:</strong>{" "}
              {currentCourrier.email_destinataire}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAlertModal} onHide={handleCloseAlertModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce courrier ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAlertModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CourrierEntrant;
