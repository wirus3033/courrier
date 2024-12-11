import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:4000/api';

function GestionCourrier() {
  const [courriers, setCourriers] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [currentCourrier, setCurrentCourrier] = useState({});
  const [selectedCourrierId, setSelectedCourrierId] = useState(null);

  useEffect(() => {
    fetchCourriers();
    fetchUtilisateurs();
  }, []);

  const fetchCourriers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courriers`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des courriers.');
      const data = await response.json();
      setCourriers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUtilisateurs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs.');
      const data = await response.json();
      setUtilisateurs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowModal = (action, courrier = {}) => {
    setModalAction(action);
    setCurrentCourrier({
      date_arrivee: courrier.date_arrivee || '',
      date_pre_reference: courrier.date_pre_reference || '',
      pre_reference: courrier.pre_reference || '',
      origin: courrier.origin || '',
      reference: courrier.reference || '',
      objet: courrier.objet || '',
      classement: courrier.classement || '',
      status: courrier.status || '',
      utilisateur: courrier.utilisateur || '',
      modifier_par: courrier.modifier_par || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCourrier({});
  };

  const handleShowAlertModal = (id) => {
    setSelectedCourrierId(id);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleSave = async () => {
    try {
      const method = modalAction === 'Ajouter' ? 'POST' : 'PUT';
      const url =
        modalAction === 'Ajouter'
          ? `${API_BASE_URL}/courriers`
          : `${API_BASE_URL}/courriers/${selectedCourrierId}`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCourrier),
      });
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde du courrier.');
      fetchCourriers();
    } catch (error) {
      console.error(error);
    }
    handleCloseModal();
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courriers/${selectedCourrierId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression du courrier.');
      fetchCourriers();
    } catch (error) {
      console.error(error);
    }
    handleCloseAlertModal();
  };

  return (
    <div className="gestion-container">
      <div className="header">
        <button className="btn btn-primary" onClick={() => handleShowModal('Ajouter')}>
          Nouveau courrier
        </button>
        <input
          type="text"
          placeholder="Rechercher un courrier"
          className="search-input"
        />
      </div>
      <table className="direction-table">
        <thead>
          <tr>
            <th>Date d'arrivée</th>
            <th>Préférence</th>
            <th>Référence</th>
            <th>Objet</th>
            <th>Classement</th>
            <th>Status</th>
            <th>Utilisateur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courriers.map((courrier) => (
            <tr key={courrier.id_courrier}>
              <td>{courrier.date_arrivee}</td>
              <td>{courrier.pre_reference}</td>
              <td>{courrier.reference}</td>
              <td>{courrier.objet}</td>
              <td>{courrier.classement}</td>
              <td>{courrier.status}</td>
              <td>{courrier.utilisateur}</td>
              <td>
                <FaEdit
                  className="icon edit-icon"
                  title="Modifier"
                  onClick={() => handleShowModal('Modifier', courrier)}
                />
                <FaTrash
                  className="icon delete-icon"
                  title="Supprimer"
                  onClick={() => handleShowAlertModal(courrier.id_courrier)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    {/* Modal d'ajout/modification */}
    <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalAction} un courrier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              {Object.keys(currentCourrier).map((field, index) => (
                <Col md={6} key={index} className="mb-3">
                  <Form.Group>
                    <Form.Label>{field.replace('_', ' ')}</Form.Label>
                    {field === 'status' ? (
                      <Form.Control
                        as="select"
                        value={currentCourrier[field] || ''}
                        onChange={(e) =>
                          setCurrentCourrier({ ...currentCourrier, [field]: e.target.value })
                        }
                      >
                        <option value="">Choisir...</option>
                        <option value="INTERNE">INTERNE</option>
                        <option value="EXTERNE">EXTERNE</option>
                      </Form.Control>
                    ) : field === 'utilisateur' ? (
                      <Form.Control
                        as="select"
                        value={currentCourrier[field] || ''}
                        onChange={(e) =>
                          setCurrentCourrier({ ...currentCourrier, [field]: e.target.value })
                        }
                      >
                        <option value="">Choisir un utilisateur...</option>
                        {utilisateurs.map((user) => (
                          <option key={user.id} value={user.nom_utilisateur}>
                            {user.nom_utilisateur}
                          </option>
                        ))}
                      </Form.Control>
                    ) : (
                      <Form.Control
                        type={field.includes('date') ? 'date' : 'text'}
                        value={currentCourrier[field] || ''}
                        onChange={(e) =>
                          setCurrentCourrier({ ...currentCourrier, [field]: e.target.value })
                        }
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer        >
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {modalAction}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal d'alerte pour suppression */}
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

export default GestionCourrier;
