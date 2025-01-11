import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import "../assets/style/CourrierEntrant.css";

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
  });
  const [selectedCourrierId, setSelectedCourrierId] = useState(null);
  const [directions, setDirections] = useState([]);

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
