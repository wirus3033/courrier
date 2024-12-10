import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner, Modal } from "react-bootstrap";
import "../assets/style/MonProfil.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

function MonProfil() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const [directions, setDirections] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");

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

  const getUser = async () => {
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : "";
      const response = await fetch("http://localhost:4000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des informations utilisateur."
        );
      }

      const data = await response.json();
      setUser(data[0]);
      setEditedUser(data[0]); // Initialize editedUser
      setError(null);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur :",
        err
      );
      setError(err.message);
      setUser({});
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : "";
      const response = await fetch("http://localhost:4000/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom_util: editedUser.nom_util,
          prenom_util: editedUser.prenom_util,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des informations.");
      }

      const data = await response.json();
      setUser(data);
      setEditedUser(data);
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour des informations :", err);
      setError("Une erreur s'est produite lors de la sauvegarde.");
    }
  };

  const getDirectionName = (id) => {
    const direction = directions.find((dir) => dir.id_direction === id);
    return direction ? direction.nom_direction : "Non renseigné";
  };

  const handlePasswordSubmit = async () => {
    // Password strength validation
    const passwordStrength =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!passwordStrength) {
      setPasswordError(
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : "";
      const response = await fetch(`http://localhost:4000/api/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: password }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors du changement de mot de passe.");
      }

      setPasswordError("");
      setShowPasswordModal(false);
      logout();
    } catch (err) {
      console.error("Erreur lors du changement de mot de passe :", err);
      setPasswordError("Une erreur s'est produite.");
    }
  };

  const checkPasswordStrength = (password) => {
    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordStrength({
      hasLength: lengthCheck,
      hasUppercase: uppercaseCheck,
      hasLowercase: lowercaseCheck,
      hasNumber: numberCheck,
      hasSpecialChar: specialCharCheck,
      isValid:
        lengthCheck &&
        uppercaseCheck &&
        lowercaseCheck &&
        numberCheck &&
        specialCharCheck,
    });
  };

  useEffect(() => {
    getUser();
    loadDirections();
  }, []);

  return (
    <div className="full-screen-container">
      <div className="profile-wrapper">
        {loading && (
          <div className="loading-spinner">
            <Spinner animation="border" role="status">
              <span className="sr-only">Chargement...</span>
            </Spinner>
          </div>
        )}
        {!loading && error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <>
            <div className="profile-header">
              {!isEditing ? (
                <>
                  <Button
                    variant="info"
                    onClick={handleEditToggle}
                    className="edit-button"
                  >
                    Éditer mon profil
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => setShowPasswordModal(true)}
                    className="password-button"
                  >
                    Changer mot de passe
                  </Button>
                </>
              ) : (
                <Button
                  variant="success"
                  onClick={handleSaveChanges}
                  className="save-button"
                >
                  Sauvegarder
                </Button>
              )}
            </div>

            <Form className="profile-info">
              {/* User form fields */}
              <Form.Group>
                <Form.Label>Numéro d'utilisateur :</Form.Label>
                <Form.Control
                  type="text"
                  value={user.id_utilisateur || "Non renseigné"}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Nom :</Form.Label>
                <Form.Control
                  type="text"
                  value={isEditing ? editedUser.nom_util : user.nom_util || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, nom_util: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Prénom :</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    isEditing ? editedUser.prenom_util : user.prenom_util || ""
                  }
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      prenom_util: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Matricule :</Form.Label>
                <Form.Control
                  type="text"
                  value={user.matricule_util || "Non renseigné"}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Direction :</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    getDirectionName(user.direction_util) || "Non renseigné"
                  }
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Fonction :</Form.Label>
                <Form.Control
                  type="text"
                  value={user.fonction_util || "Non renseigné"}
                  readOnly
                />
              </Form.Group>
            </Form>

            {/* Password Change Modal */}
            <Modal
              show={showPasswordModal}
              onHide={() => setShowPasswordModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Changer le mot de passe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <div className="mt-3">
                    <p>
                      <strong>Exigences du mot de passe :</strong>
                    </p>
                    <ul>
                      <li
                        style={{
                          color: passwordStrength.hasLength ? "green" : "red",
                        }}
                      >
                        Au moins 8 caractères
                      </li>
                      <li
                        style={{
                          color: passwordStrength.hasUppercase
                            ? "green"
                            : "red",
                        }}
                      >
                        Une lettre majuscule
                      </li>
                      <li
                        style={{
                          color: passwordStrength.hasLowercase
                            ? "green"
                            : "red",
                        }}
                      >
                        Une lettre minuscule
                      </li>
                      <li
                        style={{
                          color: passwordStrength.hasNumber ? "green" : "red",
                        }}
                      >
                        Un chiffre
                      </li>
                      <li
                        style={{
                          color: passwordStrength.hasSpecialChar
                            ? "green"
                            : "red",
                        }}
                      >
                        Un caractère spécial (@, #, $, etc.)
                      </li>
                    </ul>
                  </div>

                  <Form.Group>
                    <Form.Label>Nouveau mot de passe :</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          checkPasswordStrength(e.target.value);
                        }}
                      />
                      <span
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </span>
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Confirmer le mot de passe :</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </span>
                    </div>
                  </Form.Group>

                  {passwordError && (
                    <Alert variant="danger" className="mt-2">
                      {passwordError}
                    </Alert>
                  )}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePasswordSubmit}
                  disabled={
                    !passwordStrength.isValid || password !== confirmPassword
                  }
                >
                  Enregistrer
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}

export default MonProfil;
