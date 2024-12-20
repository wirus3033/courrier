import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

function GestionCourrier() {
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalAction, setModalAction] = useState(''); // "Ajouter" ou "Modifier"
  const [currentCourrier, setCurrentCourrier] = useState({
    num_courrier: '',
    date_arrive: '',
    preference: '',
    datepreference: '',
    origine: '',
    reference: '',
    datecourrier: '',
    objet: '',
    classement: '',
    date_traitement: '',
  });
  const [selectedCourrierId, setSelectedCourrierId] = useState(null);

  const handleShowModal = (action, courrier = {}) => {
    setModalAction(action);
    setCurrentCourrier({
      num_courrier: courrier.num_courrier || '',
      date_arrive: courrier.date_arrive || '',
      preference: courrier.preference || '',
      datepreference: courrier.datepreference || '',
      origine: courrier.origine || '',
      reference: courrier.reference || '',
      datecourrier: courrier.datecourrier || '',
      objet: courrier.objet || '',
      classement: courrier.classement || '',
      date_traitement: courrier.date_traitement || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCourrier({
      num_courrier: '',
      date_arrive: '',
      preference: '',
      datepreference: '',
      origine: '',
      reference: '',
      datecourrier: '',
      objet: '',
      classement: '',
      date_traitement: '',
    });
  };

  const handleShowAlertModal = (id) => {
    setSelectedCourrierId(id);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleSave = () => {
    if (modalAction === 'Ajouter') {
      console.log('Nouveau courrier ajouté :', currentCourrier);
    } else if (modalAction === 'Modifier') {
      console.log('Courrier modifié :', currentCourrier);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    console.log('Courrier supprimé : ID', selectedCourrierId);
    setShowAlertModal(false);
  };

  const courriers = [
    {
      id: 1,
      num_courrier: 'C001',
      date_arrive: '2024-11-01',
      preference: 'Urgent',
      datepreference: '2024-11-05',
      origine: 'Direction RH',
      reference: 'REF123',
      datecourrier: '2024-11-02',
      objet: 'Demande de congé',
      classement: 'Important',
      date_traitement: '2024-11-10',
    },
    {
      id: 2,
      num_courrier: 'C002',
      date_arrive: '2024-11-03',
      preference: 'Normal',
      datepreference: '2024-11-08',
      origine: 'Direction DSI',
      reference: 'REF456',
      datecourrier: '2024-11-04',
      objet: 'Mise à jour de projet',
      classement: 'Normal',
      date_traitement: '2024-11-12',
    },
  ];

  return (
    <div className="gestion-container">
      <div className="header">
        <input
          type="text"
          placeholder="Rechercher un courrier"
          className="search-input"
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Date d'arrivée</th>
            <th>Préférence</th>
            <th>Date de préférence</th>
            <th>Origine</th>
            <th>Référence</th>
            <th>Date courrier</th>
            <th>Objet</th>
            <th>Classement</th>
            <th>Date de traitement</th>

          </tr>
        </thead>
        <tbody>
          {courriers.map((courrier) => (
            <tr key={courrier.id}>
              <td>{courrier.num_courrier}</td>
              <td>{courrier.date_arrive}</td>
              <td>{courrier.preference}</td>
              <td>{courrier.datepreference}</td>
              <td>{courrier.origine}</td>
              <td>{courrier.reference}</td>
              <td>{courrier.datecourrier}</td>
              <td>{courrier.objet}</td>
              <td>{courrier.classement}</td>
              <td>{courrier.date_traitement}</td>

            </tr>
          ))}
        </tbody>
      </table>

   
    </div>
  );
}

export default GestionCourrier;
