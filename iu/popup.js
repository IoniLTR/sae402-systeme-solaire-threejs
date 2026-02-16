import * as THREE from 'three'; 
// On importe la bibliothèque Three.js, utilisée pour gérer la 3D dans le navigateur

export default function setupPopup(camera, clickablePlanets, controls, pauseControl) {
  // Cette fonction crée une fenêtre popup et un panneau latéral pour afficher les infos d'une planète cliquée
  // camera : la caméra 3D
  // clickablePlanets : liste des planètes sur lesquelles on peut cliquer
  // controls : les contrôles pour déplacer la caméra
  // pauseControl : contrôle pour mettre en pause l'animation (ex : bouton pause)

  // Création d'une fenêtre popup qui apparaîtra près de la planète sélectionnée
  const popup = document.createElement('div');
  popup.style.position = 'fixed'; // position fixe sur l'écran
  popup.style.background = 'rgba(0, 0, 0, 0.8)'; // fond noir transparent
  popup.style.color = '#fff'; // texte blanc
  popup.style.padding = '10px'; // espace intérieur
  popup.style.borderRadius = '8px'; // coins arrondis
  popup.style.display = 'none'; // caché par défaut
  popup.style.zIndex = '100'; // affiché au-dessus d'autres éléments
  popup.style.pointerEvents = 'auto'; // popup peut recevoir des clics
  document.body.appendChild(popup); // ajout à la page

  // Création d'un panneau latéral pour afficher les détails quand la planète est agrandie
  const detailsPanel = document.createElement('div');
  detailsPanel.style.position = 'fixed';
  detailsPanel.style.top = '50%'; // centré verticalement
  detailsPanel.style.right = '20px'; // à droite de l'écran
  detailsPanel.style.transform = 'translateY(-50%)'; // ajuste pour un vrai centrage vertical
  detailsPanel.style.width = '250px';
  detailsPanel.style.background = 'rgba(0, 0, 0, 0.85)';
  detailsPanel.style.color = '#fff';
  detailsPanel.style.padding = '15px';
  detailsPanel.style.borderRadius = '8px';
  detailsPanel.style.display = 'none'; // caché au départ
  detailsPanel.style.zIndex = '101'; // au-dessus du popup
  document.body.appendChild(detailsPanel);

  // Contenu texte à l'intérieur du panneau latéral
  const infoContent = document.createElement('div');
  detailsPanel.appendChild(infoContent);

  // Bouton pour revenir à la vue d'ensemble dans le panneau latéral
  const backBtn = document.createElement('button');
  backBtn.textContent = 'Retour à la vue d\'ensemble';
  backBtn.style.marginTop = '10px';
  detailsPanel.appendChild(backBtn);

  // Objet Three.js pour détecter où l'utilisateur clique dans la scène 3D
  const raycaster = new THREE.Raycaster();

  // Vecteur 2D qui représente la position de la souris dans l'écran normalisé (-1 à 1)
  const mouse = new THREE.Vector2();

  // Variables pour garder en mémoire la planète sélectionnée, sa taille originale, et si elle est agrandie
  let selectedPlanet = null;
  let originalScale = null;
  let enlarged = false;

  // Sauvegarde la position et la cible initiale de la caméra pour pouvoir y revenir
  const defaultCamPos = camera.position.clone();
  const defaultTarget = controls.target.clone();

  // Bouton pour agrandir la planète dans la popup
  const enlargeBtn = document.createElement('button');
  enlargeBtn.textContent = 'Agrandir';
  enlargeBtn.style.marginTop = '10px';

  // Bouton pour revenir à la vue normale dans la popup
  const returnBtn = document.createElement('button');
  returnBtn.textContent = 'Retour';
  returnBtn.style.marginTop = '10px';
  returnBtn.style.marginLeft = '10px';

  // Ajoute ces boutons dans la popup
  popup.appendChild(enlargeBtn);
  popup.appendChild(returnBtn);

  // Fonction qui remet la vue et la scène à l'état initial (avant sélection ou agrandissement)
  function resetView() {
    if (selectedPlanet && originalScale && enlarged) {
      // Remet la taille originale si la planète est agrandie
      selectedPlanet.scale.copy(originalScale);
      enlarged = false;
      enlargeBtn.textContent = 'Agrandir'; // remet le texte du bouton
    }

    // Rendre toutes les planètes visibles à nouveau
    clickablePlanets.forEach(obj => obj.visible = true);

    // Remet la caméra et sa cible à leur position de départ
    camera.position.copy(defaultCamPos);
    controls.target.copy(defaultTarget);
    controls.update();

    // Relance l'animation si elle avait été mise en pause
    pauseControl.setPaused?.(false);

    // Cache les panneaux
    popup.style.display = 'none';
    detailsPanel.style.display = 'none';

    // Réinitialise la planète sélectionnée
    selectedPlanet = null;
  }

  // Quand on clique sur le bouton "Agrandir" dans la popup
  enlargeBtn.addEventListener('click', () => {
    if (!selectedPlanet) return; // si aucune planète sélectionnée, on ne fait rien

    // Récupère la position dans le monde 3D de la planète sélectionnée
    const worldPosition = selectedPlanet.getWorldPosition(new THREE.Vector3());

    if (!enlarged) {
      // Si la planète n'est pas encore agrandie

      // On garde sa taille originale en mémoire
      originalScale = selectedPlanet.scale.clone();

      // On agrandit la planète (4 fois sa taille)
      selectedPlanet.scale.setScalar(originalScale.x * 4);

      // On cache toutes les autres planètes pour se concentrer sur celle-ci
      clickablePlanets.forEach(obj => {
        if (obj !== selectedPlanet) obj.visible = false;
      });

      // On place la caméra un peu sur la gauche de la planète agrandie
      const offset = new THREE.Vector3(-6, 0, 0);
      const newCameraPos = worldPosition.clone().add(offset);
      camera.position.copy(newCameraPos);

      // La caméra regarde la planète agrandie
      controls.target.copy(worldPosition);
      controls.update();

      // On met l'animation en pause
      pauseControl.setPaused?.(true);

      // Change le texte du bouton pour permettre de réduire la planète
      enlargeBtn.textContent = 'Réduire';

      // Affiche les infos de la planète dans le panneau latéral
      const data = selectedPlanet.userData;
      infoContent.innerHTML = `
        <strong>${data.name}</strong><br><br>
        ${data.description}<br><br>
        ${data.temperature}<br>
        ${data.moons}<br>
        ${data.composition}<br>
      `;
      detailsPanel.style.display = 'block'; // affiche le panneau latéral
      popup.style.display = 'none'; // cache la popup simple

    } else {
      // Si la planète est déjà agrandie et qu'on veut la réduire

      // On remet la taille d'origine
      selectedPlanet.scale.copy(originalScale);
      enlargeBtn.textContent = 'Agrandir';

      // On rend visibles toutes les autres planètes
      clickablePlanets.forEach(obj => {
        if (obj !== selectedPlanet) obj.visible = true;
      });

      // Cache le panneau latéral et affiche la popup
      detailsPanel.style.display = 'none';
      popup.style.display = 'block';
    }

    // On inverse l'état 'enlarged' (vrai/faux)
    enlarged = !enlarged;
  });

  // Quand on clique sur "Retour" dans la popup, on réinitialise la vue
  returnBtn.addEventListener('click', resetView);
  // Même chose pour le bouton "Retour à la vue d'ensemble" dans le panneau latéral
  backBtn.addEventListener('click', resetView);

  // Met à jour la position de la popup pour qu'elle suive la planète sélectionnée à l'écran
  function updatePopupPosition() {
    if (!selectedPlanet) return;

    // Transforme la position locale de la planète en coordonnées mondiales
    const vector = selectedPlanet.position.clone();
    selectedPlanet.parent.localToWorld(vector);

    // Projette cette position dans l'espace 2D de la caméra (coordonnées écran normalisées)
    vector.project(camera);

    // Convertit ces coordonnées (-1 à 1) en pixels sur la fenêtre du navigateur
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

    // Place la popup un peu décalée par rapport à la position calculée
    popup.style.left = `${x + 10}px`;
    popup.style.top = `${y + 10}px`;
  }

  // Fonction déclenchée quand on clique quelque part sur la fenêtre
  function onClick(event) {
    // Calcule la position de la souris en coordonnées normalisées (-1 à 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Configure le rayon pour détecter ce qui est sous la souris dans la scène 3D
    raycaster.setFromCamera(mouse, camera);

    // Cherche tous les objets cliquables sous le pointeur de la souris
    const intersects = raycaster.intersectObjects(clickablePlanets);

    if (intersects.length > 0) {
      // Si on a cliqué sur une planète

      // Récupère la planète sélectionnée
      selectedPlanet = intersects[0].object;

      // Récupère ses données (nom, description, etc)
      const data = selectedPlanet.userData;

      // Remplit la popup avec les infos de la planète
      popup.innerHTML = `
        <strong>${data.name}</strong><br>
        ${data.description}<br>
        ${data.temperature}<br>
        ${data.moons}<br>
        ${data.composition}<br>
      `;

      // Ajoute les boutons dans la popup
      popup.appendChild(enlargeBtn);
      popup.appendChild(returnBtn);

      // Définit le texte du bouton agrandir/réduire selon l'état
      enlargeBtn.textContent = enlarged ? 'Réduire' : 'Agrandir';

      // Affiche la popup
      popup.style.display = 'block';

      // Positionne correctement la popup près de la planète
      updatePopupPosition();
    } else {
      // Si on clique ailleurs (hors planète)

      // Si une planète était agrandie, on la remet à la taille normale
      if (selectedPlanet && originalScale && enlarged) {
        selectedPlanet.scale.copy(originalScale);
        enlarged = false;
      }

      // On désélectionne la planète
      selectedPlanet = null;

      // On cache les panneaux
      popup.style.display = 'none';
      detailsPanel.style.display = 'none';
    }
  }

  // Ajoute un écouteur d'événement pour détecter les clics sur la fenêtre
  window.addEventListener('click', onClick);

  // Cette fonction sera appelée régulièrement dans la boucle de rendu pour mettre à jour la position de la popup
  return {
    update: () => {
      if (selectedPlanet && !enlarged) updatePopupPosition();
    }
  };
}
