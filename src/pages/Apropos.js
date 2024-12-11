import React from 'react';

function Apropos() {
  return (
    <div 
      className="container-fluid" 
      style={{ 
        // backgroundImage: "url('https://www.bhmagazine.fr/wp-content/uploads/courriers-a-envoyer.png')", 
        // backgroundSize: 'cover', 
        // backgroundPosition: 'center', 
        // backgroundRepeat: 'no-repeat', 
        // height: '100vh',
        // width: '100vw',
        // margin: '0',
        // padding: '0',
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center'
      }}
    >
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title text-center">À Propos de l'Application</h3>
            </div>
            <div className="card-body">
              <p className="card-text">
                Bienvenue sur notre application de gestion de courrier ! Cette application a été conçue pour vous aider à
                organiser, suivre et gérer efficacement tous vos courriers professionnels et personnels. Notre objectif est
                de simplifier vos processus et d'améliorer votre productivité.
              </p>
              <h5 className="mt-4">Fonctionnalités principales :</h5>
              <ul>
                <li>Suivi des courriers entrants et sortants.</li>
                <li>Organisation par catégories et priorités.</li>
                <li>Recherche rapide et intuitive.</li>
                <li>Notifications pour les tâches importantes.</li>
              </ul>
              <p className="mt-4">
                Nous espérons que cette application répondra à vos besoins et facilitera la gestion de vos correspondances.
                Merci de nous faire confiance !
              </p>
            </div>
            <div className="card-footer text-center">
              <small className="text-muted">Version 1.0.0 - Développé par [Votre Nom]</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Apropos;
