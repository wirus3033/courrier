import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import '../assets/style/GestionDirection.css';

function GestionDirection() {
  return (
    <div className="gestion-container">
      <div className="header">
      <button className="btn btn-primary">Nouvelle direction</button>
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
              <FaEdit className="icon edit-icon" title="Modifier" />
              <FaTrash className="icon delete-icon" title="Supprimer" />
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>DRH</td>
            <td>
              <FaEdit className="icon edit-icon" title="Modifier" />
              <FaTrash className="icon delete-icon" title="Supprimer" />
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>DTI</td>
            <td>
              <FaEdit className="icon edit-icon" title="Modifier" />
              <FaTrash className="icon delete-icon" title="Supprimer" />
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>SG</td>
            <td>
              <FaEdit className="icon edit-icon" title="Modifier" />
              <FaTrash className="icon delete-icon" title="Supprimer" />
            </td>
          </tr>
          <tr>
            <td>5</td>
            <td>DG</td>
            <td>
              <FaEdit className="icon edit-icon" title="Modifier" />
              <FaTrash className="icon delete-icon" title="Supprimer" />
            </td>
          </tr>
          <tr>
            <td>6</td>
            <td>DM</td>
            <td>
              <FaEdit className="icon edit-icon" title="Modifier" />
              <FaTrash className="icon delete-icon" title="Supprimer" />
            </td>
          </tr>
          <tr>
            <td>7</td>
            <td>DRC</td>
            <td>
              <FaEdit className="icon edit-icon" title="Modifier" />
              <FaTrash className="icon delete-icon" title="Supprimer" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default GestionDirection;
