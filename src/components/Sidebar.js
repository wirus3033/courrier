import React, { useState } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DraftsIcon from "@mui/icons-material/Drafts";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import {
  Modal,
  Button,
} from "react-bootstrap"; 

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    console.log("Déconnexion effectuée");
    setModalOpen(false);
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/MonProfil", label: "Mon Profil", icon: <AccountCircleIcon /> },
    {
      path: "/GestionCourrier",
      label: "Gestion de Courrier",
      icon: <MailOutlineIcon />,
      roles: [1],
    },
    {
      path: "/Courrier",
      label: "Courrier",
      icon: <DraftsIcon />,
      roles: [2, 3],
    },
    {
      path: "/GestionDirection",
      label: "Gestion de Direction",
      icon: <BusinessIcon />,
      roles: [1],
    },
    {
      path: "/GestionUtilisateur",
      label: "Gestion d'Utilisateur",
      icon: <GroupIcon />,
      roles: [1],
    },
    { path: "/Apropos", label: "À Propos", icon: <InfoIcon /> },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles?.includes(user?.role)
  );

  return (
    <div
      style={{
        width: open ? "200px" : "60px",
        background: "#129bc0",
        height: "100vh",
        position: "fixed",
        transition: "width 0.3s",
        color: "#fff",
      }}
    >
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem
            button="true"
            component={Link}
            to={item.path}
            key={item.label}
          >
            <ListItemIcon style={{ color: "#fff" }}>
              {open
                ? item.icon
                : React.cloneElement(item.icon, { fontSize: "small" })}
            </ListItemIcon>
            {open && (
              <ListItemText primary={item.label} style={{ color: "#fff" }} />
            )}
          </ListItem>
        ))}
        <ListItem button="true" onClick={() => setModalOpen(true)}>
          <ListItemIcon style={{ color: "#fff" }}>
            <LogoutIcon />
          </ListItemIcon>
          {open && (
            <ListItemText primary="Déconnecter" style={{ color: "#fff" }} />
          )}
        </ListItem>
      </List>

            {/* Modal de déconnexion */}
            <Modal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de déconnexion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir vous déconnecter ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Déconnecter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;
