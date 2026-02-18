// On importe les modules principaux de Three.js, ainsi que plusieurs fichiers spécifiques à notre projet
import * as THREE from 'three';

import sphere from './components/sphere.js';                 // Composant sphère 3D
import createLight from './systems/light.js';                 // Fonction pour créer l'éclairage
import createBackground from './systems/background.js';       // Fonction pour créer un fond visuel
import init from './systems/init.js';                         // Fonction d'initialisation de la scène (caméra, renderer, etc.)
import createBackgroundSound from './systems/sound.js';       // Fonction pour ajouter un son d’ambiance

import createPlanet from './objects/createPlanet.js';          // Fonction pour créer une planète
import createMoon from './objects/moon.js';                    // Fonction pour créer une lune
import createSun from './objects/sun.js';                      // Fonction pour créer le soleil
import addPlanets from './objects/planets.js';                 // Fonction pour ajouter plusieurs planètes

import setupPopup from './iu/popup.js';                         // Configuration d’une fenêtre popup (interface utilisateur)
import setupPauseButton from './iu/pauseButton.js';            // Configuration d’un bouton pause (interface utilisateur)

import createLightSpeedEffect from './effects/lightSpeed.js';  // Animation de l’effet "vitesse lumière"

// Import des outils de post-traitement (effets visuels après rendu)
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

console.log("Start main.js");  // Message dans la console pour dire que le script démarre

// INITIALISATION DE LA SCÈNE
// La fonction init() renvoie plusieurs éléments nécessaires pour démarrer : caméra, rendu, scène, contrôles, etc.
const [camera, renderer, scene, controls, baseCamPos, baseCamTarget] = init();

// On applique un fond visuel à la scène (par exemple un ciel étoilé)
scene.background = createBackground();

// On désactive temporairement les contrôles utilisateur sur la caméra
controls.enabled = false;
controls.update(); // Mise à jour des contrôles (pour qu’ils prennent effet)

// LUMIÈRE
// On crée un groupe de lumières qui sera ajouté à la scène
const lightGroup = createLight();
scene.add(lightGroup);

// POST-PROCESSING : EFFET BLOOM (halo lumineux autour des objets brillants)
// On crée un "composer" pour appliquer plusieurs effets après le rendu normal
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera)); // Premier passage : rendu normal de la scène

// Création d'un effet de bloom avec paramètres pour intensité, rayon, seuil, etc.
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, 0.4, 0.85
);
bloomPass.threshold = 0;   // Seuil de luminosité pour l’effet
bloomPass.strength = 0.2;  // Force de l’effet bloom (plus fort = plus visible)
bloomPass.radius = 0.01;   // Rayon de diffusion de la lumière
composer.addPass(bloomPass);  // Ajout de l’effet au composer

// OBJETS DU SYSTÈME SOLAIRE
const objects = [];            // Liste de tous les objets 3D à animer ou manipuler
const clickablePlanets = [];   // Liste des planètes cliquables dans l’interface utilisateur

// Création du soleil et ajout à la scène + à la liste des objets cliquables
const sun = createSun(scene, clickablePlanets);

// Ajout des planètes à la scène, et récupération de leurs objets (pour animation par exemple)
const allPlanets = addPlanets(scene, clickablePlanets, objects);

// Création de la lune autour de la troisième planète (index 2)
createMoon(allPlanets[2].planet, scene, clickablePlanets, objects);

// UI : Configuration des éléments d'interface utilisateur
const pauseControl = setupPauseButton();    // Bouton pause
const popup = setupPopup(camera, clickablePlanets, controls, pauseControl);  // Fenêtre popup d’infos

// SON D'AMBIANCE
let backgroundSound = null;  // Variable qui contiendra notre son de fond quand il sera prêt

// On écoute le premier clic de souris sur la page pour lancer le son d’ambiance
document.addEventListener('click', () => {
  if (!backgroundSound) {   // Si le son n’a pas encore été créé
    createBackgroundSound(camera).then((sound) => {  // Charge et crée le son en fond
      backgroundSound = sound;
      backgroundSound.play();          // Lance la lecture du son
      console.log('Lecture du son lancée');
    }).catch((err) => {
      console.error('Erreur lors de la préparation du son :', err);
    });
  }
});

// EFFET DE VITESSE LUMIÈRE
// On crée une fonction d’animation qui gère l’effet spécial et l’actualisation de la scène
const animate = createLightSpeedEffect(
  camera,
  scene,
  baseCamPos,
  baseCamTarget,
  controls,
  composer,
  objects,
  sun,
  popup,
  pauseControl
);

// LANCEMENT
document.body.appendChild(renderer.domElement); // On ajoute la zone de rendu (canvas) dans la page HTML
console.log("Start animation");                 // Message console pour signaler le début de l’animation
animate();                                       // On lance la boucle d’animation
