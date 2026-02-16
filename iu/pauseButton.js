// Ce fichier crée un bouton "Pause" pour contrôler l'animation des orbites

export default function setupPauseButton() {
  // Variable qui indique si l'animation est en pause ou non (false = en marche, true = en pause)
  let paused = false;

  // Création d'un élément bouton HTML
  const pauseBtn = document.createElement('button');

  // Positionnement du bouton en haut à gauche de la page, avec un ordre d'affichage au-dessus des autres éléments
  pauseBtn.style.position = 'fixed'; // bouton fixé à l'écran même quand on scroll
  pauseBtn.style.top = '10px';       // 10 pixels depuis le haut de la fenêtre
  pauseBtn.style.left = '10px';      // 10 pixels depuis la gauche
  pauseBtn.style.zIndex = '10';      // place le bouton au-dessus d'autres éléments

  // Texte initial du bouton
  pauseBtn.textContent = 'Pause orbites';

  // Ajoute le bouton à la page web, dans le corps du document
  document.body.appendChild(pauseBtn);

  // Fonction qui met à jour le texte du bouton en fonction de l'état pause/non-pause
  function updateButtonText() {
    // Si 'paused' est vrai, on affiche "Reprendre orbites", sinon "Pause orbites"
    pauseBtn.textContent = paused ? 'Reprendre orbites' : 'Pause orbites';
  }

  // Ajoute un écouteur d'événement sur le bouton pour réagir au clic
  pauseBtn.addEventListener('click', () => {
    // Inverse l'état de 'paused' (si c'était false, ça devient true, et vice versa)
    paused = !paused;

    // Met à jour le texte du bouton pour refléter ce changement
    updateButtonText();
  });

  // On retourne un objet avec deux fonctions pour contrôler ou savoir si l'animation est en pause
  return {
    // Fonction pour savoir si on est en pause
    isPaused: () => paused,

    // Fonction pour mettre à jour manuellement l'état pause (avec mise à jour du texte)
    setPaused: (state) => {
      paused = state;
      updateButtonText();
    }
  };
}
