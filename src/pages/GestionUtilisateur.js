import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

function GestionUtilisateur() {
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // "Ajouter" ou "Modifier"
  const [currentUser, setCurrentUser] = useState({
    id: null,
    nom: '',
    prenom: '',
    matricule: '',
    direction: '',
    fonction: '',
  });
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleShowModal = (action, user = {}) => {
    setModalAction(action);
    setCurrentUser({
      id: user.id || null,
      nom: user.nom || '',
      prenom: user.prenom || '',
      matricule: user.matricule || '',
      direction: user.direction || '',
      fonction: user.fonction || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser({
      id: null,
      nom: '',
      prenom: '',
      matricule: '',
      direction: '',
      fonction: '',
    });
  };

  const handleShowAlertModal = (id) => {
    setSelectedUserId(id);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleSave = () => {
    if (modalAction === 'Ajouter') {
      console.log('Nouvel utilisateur ajouté :', currentUser);
    } else if (modalAction === 'Modifier') {
      console.log('Utilisateur modifié :', currentUser);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    console.log('Utilisateur supprimé : ID', selectedUserId);
    setShowAlertModal(false);
  };

  const utilisateurs = [
    { id: 1, nom: 'Doe', prenom: 'John', matricule: 'M123', direction: 'DSI', fonction: 'Développeur' },
    { id: 2, nom: 'Smith', prenom: 'Anna', matricule: 'M456', direction: 'RH', fonction: 'Manager' },
    // Ajoutez plus d'utilisateurs ici
  ];

  return (
    <div className="gestion-container">
      <div className="header">
        <button className="btn btn-primary" onClick={() => handleShowModal('Ajouter')}>
          Nouvel utilisateur
        </button>
        <input
          type="text"
          placeholder="Rechercher un utilisateur"
          className="search-input"
        />
      </div>
      <table className="direction-table">
        <thead>
          <tr>
            <th>Identification</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Matricule</th>
            <th>Direction</th>
            <th>Fonction</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.matricule}</td>
              <td>{user.direction}</td>
              <td>{user.fonction}</td>
              <td>
                <FaEdit
                  className="icon edit-icon"
                  title="Modifier"
                  onClick={() => handleShowModal('Modifier', user)}
                />
                <FaTrash
                  className="icon delete-icon"
                  title="Supprimer"
                  onClick={() => handleShowAlertModal(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal d'ajout/modification */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalAction} un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.nom}
                onChange={(e) => setCurrentUser({ ...currentUser, nom: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.prenom}
                onChange={(e) => setCurrentUser({ ...currentUser, prenom: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Matricule</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.matricule}
                onChange={(e) => setCurrentUser({ ...currentUser, matricule: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Direction</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.direction}
                onChange={(e) => setCurrentUser({ ...currentUser, direction: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fonction</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.fonction}
                onChange={(e) => setCurrentUser({ ...currentUser, fonction: e.target.value })}
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
      <Modal show={showAlertModal} onHide={handleCloseAlertModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
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

export default GestionUtilisateur;
