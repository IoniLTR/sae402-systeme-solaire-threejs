// Ce fichier initialise les éléments de base pour une scène 3D avec Three.js :
// caméra, rendu, scène, contrôles, et quelques paramètres utiles pour plus tard.

import {
  WebGLRenderer,         // Permet d'afficher la scène dans le navigateur
  PerspectiveCamera,     // Caméra avec effet de perspective (comme un œil humain)
  Scene,                 // Conteneur principal pour tous les objets 3D
  PCFSoftShadowMap,      // Type d'ombre douce (pour un meilleur rendu)
  Vector3                // Classe pour gérer des coordonnées en 3D (x, y, z)
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
// Contrôles pour faire tourner/zoomer autour de la scène avec la souris

export default function init() {
  // Création de la caméra : FOV = 75°, ratio écran, profondeur de vue de 0.1 à 1000 unités
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Positionner la caméra au-dessus du système solaire
  camera.position.set(0, 19, 0); // x = 0, y = 19 (hauteur), z = 0
  camera.lookAt(0, 0, 0);        // La caméra regarde le centre de la scène (origine)

  // Création du moteur de rendu WebGL
  const renderer = new WebGLRenderer({ antialias: true }); // antialias pour lisser les bords
  renderer.setSize(window.innerWidth, window.innerHeight); // taille = plein écran

  // Activer les ombres dans la scène
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // type d'ombre douce

  // Création de la scène (le monde 3D où on ajoute tous les objets)
  const scene = new Scene();

  // Ajout de contrôles pour déplacer la caméra avec la souris
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = false; // désactivé au début (peut être activé plus tard)
  controls.update();        // on applique les paramètres

  // On enregistre la position et la cible de la caméra (utile pour revenir à cette vue plus tard)
  const baseCamPos = camera.position.clone();         // copie de la position actuelle
  const baseCamTarget = new Vector3(0, 0, 0);          // on regarde le centre de la scène

  // On retourne tout ce qui sera utile pour construire la scène
  return [camera, renderer, scene, controls, baseCamPos, baseCamTarget];
}
