import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import "../assets/style/GestionCourrier.css";

const API_BASE_URL = "http://localhost:4000/api";

function GestionCourrier() {
  const [courriers, setCourriers] = useState([]);
  const [directions, setDirections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [courrierType, setCourrierType] = useState("Entrant");
  const [currentCourrier, setCurrentCourrier] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchCourriers();
    fetchDirections();
  }, [courrierType]);

  const showFeedback = (message, type) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const fetchCourriers = async () => {
    try {
      const endpoint = `${API_BASE_URL}/${
        courrierType === "Entrant" ? "entrant" : "sortant"
      }`;
      const response = await fetch(endpoint);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des courriers");
      const data = await response.json();
      setCourriers(data);
    } catch (error) {
      console.error(error);
      showFeedback("Erreur lors de la récupération des courriers", "danger");
    }
  };

  const fetchDirections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/directions`);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des directions");
      const data = await response.json();
      setDirections(data);
    } catch (error) {
      console.error(error);
      showFeedback("Erreur lors de la récupération des directions", "danger");
    }
  };

  const validateForm = () => {
    if (courrierType === "Entrant") {
      return (
        currentCourrier.numero_courrier &&
        currentCourrier.date_entree &&
        currentCourrier.id_direction
      );
    } else {
      return (
        currentCourrier.id_entrant &&
        currentCourrier.date_sortie &&
        currentCourrier.nom_prenom &&
        currentCourrier.nom_responsable
      );
    }
  };

  const handleShowModal = (action, courrier = {}) => {
    setModalAction(action);
    setCurrentCourrier(courrier);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCourrier({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourrier({ ...currentCourrier, [name]: value });
  };

  const handleSave = async () => {
    try {
      const method = modalAction === "Modifier" ? "PUT" : "POST";
      const endpoint = `${API_BASE_URL}/${
        courrierType === "Entrant" ? "entrant" : "sortant"
      }`;
      const id =
        courrierType === "Entrant"
          ? currentCourrier.id_entrant
          : currentCourrier.id_sortant;

      const payload =
        courrierType === "Entrant"
          ? {
              numero_courrier: currentCourrier.numero_courrier,
              date_entree: currentCourrier.date_entree,
              id_direction: currentCourrier.id_direction,
              date_BE: currentCourrier.date_BE,
              numero_BE: currentCourrier.numero_BE,
              reference_courrier: currentCourrier.reference_courrier,
            }
          : {
              id_entrant: currentCourrier.id_entrant,
              date_sortie: currentCourrier.date_sortie,
              observation: currentCourrier.observation || null,
              nom_prenom: currentCourrier.nom_prenom,
              nom_responsable: currentCourrier.nom_responsable,
            };

      const url = method === "PUT" ? `${endpoint}/${id}` : endpoint;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

      showFeedback(
        `Courrier ${
          modalAction === "Modifier" ? "modifié" : "ajouté"
        } avec succès`,
        "success"
      );
      fetchCourriers();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showFeedback("Erreur lors de la sauvegarde", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce courrier ?")) {
      try {
        const endpoint = `${API_BASE_URL}/${
          courrierType === "Entrant" ? "entrant" : "sortant"
        }/${id}`;
        const response = await fetch(endpoint, { method: "DELETE" });

        if (!response.ok) throw new Error("Erreur lors de la suppression");

        showFeedback("Courrier supprimé avec succès", "success");
        fetchCourriers();
      } catch (error) {
        console.error(error);
        showFeedback("Erreur lors de la suppression", "danger");
      }
    }
  };

  const filteredCourriers = courriers.filter((courrier) =>
    courrier.numero_courrier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="gestion-container">
      {feedback.message && (
        <div className={`alert alert-${feedback.type}`}>{feedback.message}</div>
      )}

      <div className="header d-flex align-items-center mb-3">
        <button
          className="btn btn-primary me-3"
          onClick={() => handleShowModal("Ajouter")}
        >
          Nouveau courrier
        </button>
        <Dropdown className="me-3">
          <Dropdown.Toggle variant="secondary" id="dropdown-courrier-type">
            {courrierType}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setCourrierType("Entrant")}>
              Entrant
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setCourrierType("Sortant")}>
              Sortant
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher un courrier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            {courrierType === "Entrant" ? (
              <>
                <th>Numéro du courrier</th>
                <th>Date d'entrée</th>
                <th>Direction du courrier</th>
                <th>Date du BE</th>
                <th>Numéro du BE</th>
                <th>Référence du courrier</th>
              </>
            ) : (
              <>
                <th>Numéro du courrier</th>
                <th>Date de sortie</th>
                <th>Observation</th>
                <th>Nom et prénom</th>
                <th>Nom responsable</th>
              </>
            )}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredCourriers.map((courrier) => (
            <tr key={courrier.id_entrant}>
              {courrierType === "Entrant" ? (
                <>
                  <td>{courrier.numero_courrier}</td>
                  <td>{courrier.date_entree}</td>
                  <td>{courrier.id_direction}</td>
                  <td>{courrier.date_BE}</td>
                  <td>{courrier.numero_BE}</td>
                  <td>{courrier.reference_courrier}</td>
                </>
              ) : (
                <>
                  <td>{courrier.numero_courrier}</td>
                  <td>{courrier.date_sortie}</td>
                  <td>{courrier.observation}</td>
                  <td>{courrier.nom_prenom}</td>
                  <td>{courrier.nom_responsable}</td>
                </>
              )}
              <td>
                <FaEdit
                  className="icon edit-icon"
                  title="Modifier"
                  onClick={() => handleShowModal("Modifier", courrier)}
                />
                <FaTrash
                  className="icon delete-icon"
                  title="Supprimer"
                  onClick={() => handleDelete(courrier.id_entrant)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction} un courrier {courrierType}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {courrierType === "Entrant" ? (
              <>
                <Form.Group className="mb-3" controlId="numCourrier">
                  <Form.Label>Numéro du courrier *</Form.Label>
                  <Form.Control
                    type="text"
                    name="num_courrier"
                    value={currentCourrier.num_courrier || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="dateEntree">
                  <Form.Label>Date d'entrée *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_entrant"
                    value={currentCourrier.date_entrant || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="direction">
                  <Form.Label>Direction du courrier *</Form.Label>
                  <Form.Control
                    as="select"
                    name="direction_courrier"
                    value={currentCourrier.direction_courrier || ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionnez une direction</option>
                    {directions.map((direction) => (
                      <option
                        key={direction.id_direction}
                        value={direction.id_direction}
                      >
                        {direction.nom_direction}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="dateBE">
                  <Form.Label>Date du BE</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_BE"
                    value={currentCourrier.date_BE || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="numBE">
                  <Form.Label>Numéro du BE</Form.Label>
                  <Form.Control
                    type="text"
                    name="num_BE"
                    value={currentCourrier.num_BE || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="referenceCourrier">
                  <Form.Label>Référence du courrier</Form.Label>
                  <Form.Control
                    type="text"
                    name="reference_courrier"
                    value={currentCourrier.reference_courrier || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group className="mb-3" controlId="numCourrierSortant">
                  <Form.Label>Numéro du courrier entrant *</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_entrant"
                    value={currentCourrier.id_entrant || ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionnez un courrier entrant</option>
                    {courriers.map((courrier) => (
                      <option
                        key={courrier.id_entrant}
                        value={courrier.id_entrant}
                      >
                        {courrier.numero_courrier}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="dateSortie">
                  <Form.Label>Date de sortie *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_sortie"
                    value={currentCourrier.date_sortie || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="observation">
                  <Form.Label>Observation</Form.Label>
                  <Form.Control
                    type="text"
                    name="observation"
                    value={currentCourrier.observation || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="nomPrenom">
                  <Form.Label>Nom et prénom *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom_prenom"
                    value={currentCourrier.nom_prenom || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="nomResponsable">
                  <Form.Label>Nom responsable *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom_responsable"
                    value={currentCourrier.nom_responsable || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!validateForm()}
          >
            {modalAction}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionCourrier;
