import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import '../assets/style/GestionDirection.css';

function GestionDirection() {
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // "Ajouter" ou "Modifier"
  const [currentDirection, setCurrentDirection] = useState('');
  const [selectedDirectionId, setSelectedDirectionId] = useState(null);

  const handleShowModal = (action, direction = '', id = null) => {
    setModalAction(action);
    setCurrentDirection(direction);
    setSelectedDirectionId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDirection('');
  };

  const handleShowAlertModal = (id) => {
    setSelectedDirectionId(id);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleSave = () => {
    if (modalAction === 'Ajouter') {
      console.log('Nouvelle direction ajoutée :', currentDirection);
    } else if (modalAction === 'Modifier') {
      console.log('Direction modifiée :', currentDirection, 'ID :', selectedDirectionId);
    }
    setCurrentDirection('');
    setShowModal(false);
  };

  const handleDelete = () => {
    console.log('Direction supprimée : ID', selectedDirectionId);
    setShowAlertModal(false);
  };

  return (
    <div className="gestion-container">
      <div className="header">
        <button className="btn btn-primary" onClick={() => handleShowModal('Ajouter')}>
          Nouvelle direction
        </button>
        <input
          type="text"
          placeholder="Rechercher une direction"
          className="search-input"
        />
      </div>
      <table className="direction-table">
        <thead>
          <tr>
            <th>Identification</th>
            <th>Direction</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>DSI</td>
            <td>
              <FaEdit
                className="icon edit-icon"
                title="Modifier"
                onClick={() => handleShowModal('Modifier', 'DSI', 1)}
              />
              <FaTrash
                className="icon delete-icon"
                title="Supprimer"
                onClick={() => handleShowAlertModal(1)}
              />
            </td>
          </tr>
          {/* Ajoutez plus de lignes ici */}
        </tbody>
      </table>

      {/* Modal d'édition/ajout */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered // Centrage horizontal et vertical
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalAction} une direction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom de la direction</Form.Label>
              <Form.Control
                type="text"
                value={currentDirection}
                onChange={(e) => setCurrentDirection(e.target.value)}
                placeholder="Entrez le nom de la direction"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {modalAction}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal d'alerte pour suppression */}
      <Modal
        show={showAlertModal}
        onHide={handleCloseAlertModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cette direction ?
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

export default GestionDirection;
