import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";

function GestionUtilisateur() {
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalAction, setModalAction] = useState(""); // "Ajouter" ou "Modifier"
  const [currentUser, setCurrentUser] = useState({
    id: null,
    nom: "",
    prenom: "",
    matricule: "",
    direction: null,
    fonction: "",
    acces: null,
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [directions, setDirections] = useState([]);
  const [fonctions, setFonctions] = useState([]);
  const loadDirections = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/directions", {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("user")
              ? JSON.parse(localStorage.getItem("user")).token
              : ""
          }`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des directions");
      }

      const data = await response.json();
      setDirections(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des directions :", error);
      setDirections([]);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users", {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("user")
              ? JSON.parse(localStorage.getItem("user")).token
              : ""
          }`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }

      const data = await response.json();
      setUtilisateurs(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      setUtilisateurs([]);
    }
  };
  useEffect(() => {
    setFonctions([
      {
        id_fonction: 1,
        nom_fonction: "administrateur",
      },
      {
        id_fonction: 2,
        nom_fonction: "sécretaire",
      },
      {
        id_fonction: 3,
        nom_fonction: "utilisateur",
      },
    ]);
    loadUsers();
    loadDirections();
  }, []);

  const handleShowModal = (action, user = {}) => {
    setModalAction(action);
    console.log(user, directions);
    setCurrentUser({
      id: user.id_utilisateur || null,
      nom: user.nom_util || "",
      prenom: user.prenom_util || "",
      matricule: user.matricule_util || "",
      direction: user.direction_util || null,
      fonction: user.fonction_util || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser({
      id: null,
      nom: "",
      prenom: "",
      matricule: "",
      direction: null,
      fonction: "",
    });
  };

  const handleShowAlertModal = (id) => {
    setSelectedUserId(id);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleSave = async () => {
    try {
      const url =
        modalAction === "Ajouter"
          ? "http://localhost:4000/api/register"
          : `http://localhost:4000/api/users/${currentUser.id}`;
      const method = modalAction === "Ajouter" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            localStorage.getItem("user")
              ? JSON.parse(localStorage.getItem("user")).token
              : ""
          }`,
        },
        body: JSON.stringify({
          pseudo: currentUser.matricule,
          passe: currentUser.passe || `${currentUser.matricule}.password`, // Temp password
          nom: currentUser.nom,
          prenom: currentUser.prenom,
          matricule: currentUser.matricule,
          direction: currentUser.direction,
          fonction: currentUser.fonction,
          acces: currentUser.acces,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout/modification de l'utilisateur");
      }
      loadUsers();
      setShowModal(false);
      alert("Utilisateur enregistré avec succès.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")).token
                : ""
            }`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur");
      }

      alert("Utilisateur supprimé avec succès.");
      setShowAlertModal(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const [utilisateurs, setUtilisateurs] = useState([]);

  return (
    <div className="gestion-container">
      <div className="header">
        <button
          className="btn btn-primary"
          onClick={() => handleShowModal("Ajouter")}
        >
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
            <tr key={user.id_utilisateur}>
              <td>{user.id_utilisateur}</td>
              <td>{user.nom_util}</td>
              <td>{user.prenom_util}</td>
              <td>{user.matricule_util}</td>
              <td>{user.direction_util || "-"}</td>
              <td>{user.fonction_util}</td>
              <td>
                <FaEdit
                  className="icon edit-icon"
                  title="Modifier"
                  onClick={() => handleShowModal("Modifier", user)}
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
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, nom: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.prenom}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, prenom: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Matricule</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.matricule}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, matricule: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Direction</Form.Label>
              <Form.Control
                as="select"
                value={currentUser.direction}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    direction: e.target.value,
                  })
                }
              >
                <option value="">Sélectionner une direction</option>
                {Array.isArray(directions) &&
                  directions.map((direction) => (
                    <option
                      key={direction.id_direction}
                      value={Number(direction.id_direction)}
                    >
                      {direction.nom_direction.charAt(0).toUpperCase() +
                        direction.nom_direction.slice(1)}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Fonction</Form.Label>
              <Form.Control
                as="select"
                value={currentUser.fonction}
                onChange={(e) => {
                  const selectedFonction = fonctions.find(
                    (fonction) => fonction.nom_fonction === e.target.value
                  );
                  setCurrentUser({
                    ...currentUser,
                    fonction: e.target.value,
                    acces: selectedFonction ? selectedFonction.id_fonction : 3,
                  });
                }}
              >
                <option value="">Sélectionner une fonction</option>
                {fonctions.map((fonction) => (
                  <option
                    key={fonction.id_fonction}
                    value={fonction.nom_fonction}
                  >
                    {fonction.nom_fonction.charAt(0).toUpperCase() +
                      fonction.nom_fonction.slice(1)}
                  </option>
                ))}
              </Form.Control>
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
