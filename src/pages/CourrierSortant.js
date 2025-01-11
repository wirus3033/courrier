import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import "../assets/style/CourrierSortant.css";

function CourrierSortant() {
  const [courriers, setCourriers] = useState([]);
  const [filteredCourriers, setFilteredCourriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [courrierId, setCourrierId] = useState(null);
  const [currentCourrier, setCurrentCourrier] = useState({
    numero_courrier: "",
    date_sortie: "",
    observation: "",
    nom_prenom: "",
    nom_responsable: "",
  });
  const [selectedCourrierId, setSelectedCourrierId] = useState(null);
  const [courrierEntrants, setCourrierEntrants] = useState([]);

  useEffect(() => {
    fetchCourriers();
    fetchCourrierEntrants();
  }, []);

  useEffect(() => {
    filterCourriers();
  }, [searchTerm, courriers]);

  const fetchCourrierEntrants = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/entrant");
      const data = await response.json();
      setCourrierEntrants(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des courriers entrants:",
        error
      );
    }
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
        date_sortie: "",
        observation: "",
        nom_prenom: "",
        nom_responsable: "",
      }
    );
    setSelectedCourrierId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCourrier({
      numero_courrier: "",
      date_sortie: "",
      observation: "",
      nom_prenom: "",
      nom_responsable: "",
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
          ? "http://localhost:4000/api/sortant"
          : `http://localhost:4000/api/sortant/${selectedCourrierId}`;

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
        `http://localhost:4000/api/sortant/${courrierId}`,
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
            <th>Numéro du courrier</th>
            <th>Date de sortie</th>
            <th>Observation</th>
            <th>Nom et prénom</th>
            <th>Nom responsable</th>
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
                <FaEdit
                  className="icon edit-icon"
                  title="Modifier"
                  onClick={() =>
                    handleShowModal("Modifier", courrier, courrier.id_sortant)
                  }
                />
                <FaTrash
                  className="icon delete-icon"
                  title="Supprimer"
                  onClick={() => handleShowAlertModal(courrier.id_sortant)}
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
              <Form.Label>Numéro du courrier</Form.Label>
              <Form.Control
                as="select"
                value={currentCourrier.numero_courrier}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    numero_courrier: e.target.value,
                  })
                }
              >
                <option value="">
                  -- Sélectionnez un numéro de courrier --
                </option>
                {courrierEntrants.map((courrier) => (
                  <option
                    key={courrier.id_entrant}
                    value={courrier.numero_courrier}
                  >
                    {courrier.numero_courrier}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Date de sortie</Form.Label>
              <Form.Control
                type="date"
                value={currentCourrier.date_sortie}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    date_sortie: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Observation</Form.Label>
              <Form.Control
                as="textarea"
                value={currentCourrier.observation}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    observation: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nom et prénom</Form.Label>
              <Form.Control
                type="text"
                value={currentCourrier.nom_prenom}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    nom_prenom: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nom responsable</Form.Label>
              <Form.Control
                type="text"
                value={currentCourrier.nom_responsable}
                onChange={(e) =>
                  setCurrentCourrier({
                    ...currentCourrier,
                    nom_responsable: e.target.value,
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

export default CourrierSortant;
