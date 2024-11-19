import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import DraftsIcon from '@mui/icons-material/Drafts';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  const [open, setOpen] = useState(true); 

  const handleLogout = () => {
    console.log('Déconnexion effectuée');
  };

  return (
    <div
      style={{
        width: open ? '200px' : '60px',
        background: '#129bc0', 
        height: '100vh',
        position: 'fixed',
        transition: 'width 0.3s',
        color: '#fff' 
      }}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon style={{ color: '#fff' }}>{open ? <DashboardIcon /> : <DashboardIcon fontSize="small" />}</ListItemIcon>
          {open && <ListItemText primary="Dashboard" style={{ color: '#fff' }} />}
        </ListItem>
        <ListItem button component={Link} to="/MonProfil">
          <ListItemIcon style={{ color: '#fff' }}>{open ? <AccountCircleIcon /> : <AccountCircleIcon fontSize="small" />}</ListItemIcon>
          {open && <ListItemText primary="Mon Profil" style={{ color: '#fff' }} />}
        </ListItem>
        <ListItem button component={Link} to="/GestionCourrier">
          <ListItemIcon style={{ color: '#fff' }}>{open ? <MailOutlineIcon /> : <MailOutlineIcon fontSize="small" />}</ListItemIcon>
          {open && <ListItemText primary="Gestion de Courrier" style={{ color: '#fff' }} />}
        </ListItem>
        <ListItem button component={Link} to="/Courrier">
          <ListItemIcon style={{ color: '#fff' }}>{open ? <DraftsIcon /> : <DraftsIcon fontSize="small" />}</ListItemIcon>
          {open && <ListItemText primary="Courrier" style={{ color: '#fff' }} />}
        </ListItem>
        <ListItem button component={Link} to="/GestionDirection">
          <ListItemIcon style={{ color: '#fff' }}>{open ? <BusinessIcon /> : <BusinessIcon fontSize="small" />}</ListItemIcon>
          {open && <ListItemText primary="Gestion de Direction" style={{ color: '#fff' }} />}
        </ListItem>
        <ListItem button component={Link} to="/GestionUtilisateur">
          <ListItemIcon style={{ color: '#fff' }}>{open ? <GroupIcon /> : <GroupIcon fontSize="small" />}</ListItemIcon>
          {open && <ListItemText primary="Gestion d'Utilisateur" style={{ color: '#fff' }} />}
        </ListItem>
        <ListItem button component={Link} to="/Apropos">
          <ListItemIcon style={{ color: '#fff' }}>{open ? <InfoIcon /> : <InfoIcon fontSize="small" />}</ListItemIcon>
          {open && <ListItemText primary="À Propos" style={{ color: '#fff' }} />}
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon style={{ color: '#fff' }}>{open ? <LogoutIcon /> : <LogoutIcon fontSize="small" />}</ListItemIcon>
          {open && <ListItemText primary="Déconnecter" style={{ color: '#fff' }} />}
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
