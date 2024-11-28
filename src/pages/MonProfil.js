import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../assets/style/MonProfil.css';

function MonProfil() {
  const [user, setUser] = useState({
    numeroUtilisateur: '1',
    pseudo: 'admin',
    nom: 'RAZAFINDRAINIBE',
    prenom: 'Raphaël Benja Ny Nosy',
    matricule: '',
    direction: 'DG',
    fonction: 'Administrateur',
  });

  const handleEditProfile = () => {
    console.log('Édition du profil...');
  };

  const handleChangePassword = () => {
    console.log('Changement de mot de passe...');
  };

  return (
    <div className="full-screen-container">
      <div className="profile-wrapper">
        <div className="profile-header">
          <img
            src="https://via.placeholder.com/150"
            alt="Profil"
            className="profile-image"
          />
          <Button variant="info" onClick={handleEditProfile} className="edit-button">
            Éditer mon profil
          </Button>
        </div>

        <Form className="profile-info">
          <Form.Group>
            <Form.Label>Numéro d'utilisateur :</Form.Label>
            <Form.Control type="text" value={user.numeroUtilisateur} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nom :</Form.Label>
            <Form.Control type="text" value={user.nom} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Prénom :</Form.Label>
            <Form.Control type="text" value={user.prenom} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Matricule :</Form.Label>
            <Form.Control type="text" value={user.matricule} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Direction :</Form.Label>
            <Form.Control type="text" value={user.direction} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fonction :</Form.Label>
            <Form.Control type="text" value={user.fonction} readOnly />
          </Form.Group>
        </Form>

        <div className="password-section">
          <Button
            variant="info"
            onClick={handleChangePassword}
            className="password-button"
          >
            Changement de mot de passe
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MonProfil;
