import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import '../assets/style/GestionDirection.css';

function GestionDirection() {
  const [directions, setDirections] = useState([]);
  const [filteredDirections, setFilteredDirections] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // État pour la recherche
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // "Ajouter" ou "Modifier"
  const [currentDirection, setCurrentDirection] = useState('');
  const [selectedDirectionId, setSelectedDirectionId] = useState(null);

  // Charger les données au chargement du composant
  useEffect(() => {
    fetchDirections();
  }, []);

  useEffect(() => {
    filterDirections();
  }, [searchTerm, directions]);

  const fetchDirections = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/directions'); // Remplacez par votre URL
      const data = await response.json();
      setDirections(data);
      setFilteredDirections(data); // Initialiser les données filtrées
    } catch (error) {
      console.error('Erreur lors du chargement des directions :', error);
    }
  };

  const filterDirections = () => {
    const filtered = directions.filter((direction) =>
      direction.nom_direction.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDirections(filtered);
  };

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

  const handleSave = async () => {
    try {
      if (modalAction === 'Ajouter') {
        const response = await fetch('http://localhost:4000/api/directions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom_direction: currentDirection }),
        });
        if (response.ok) {
          fetchDirections();
        }
      } else if (modalAction === 'Modifier') {
        const response = await fetch(`http://localhost:4000/api/directions/${selectedDirectionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom_direction: currentDirection }),
        });
        if (response.ok) {
          fetchDirections();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la direction :', error);
    }
    setCurrentDirection('');
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/directions/${selectedDirectionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchDirections();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la direction :', error);
    }
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          {filteredDirections.map((direction) => (
            <tr key={direction.id_direction}>
              <td>{direction.id_direction}</td>
              <td>{direction.nom_direction}</td>
              <td>
                <FaEdit
                  className="icon edit-icon"
                  title="Modifier"
                  onClick={() => handleShowModal('Modifier', direction.nom_direction, direction.id_direction)}
                />
                <FaTrash
                  className="icon delete-icon"
                  title="Supprimer"
                  onClick={() => handleShowAlertModal(direction.id_direction)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal d'édition/ajout */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
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
