// Ce fichier crée et configure l'éclairage de la scène 3D

// On importe trois types de lumières et un groupe pour les contenir
import { PointLight, AmbientLight, DirectionalLight, Group } from 'three';

export default function createLight() {
  // On crée un groupe pour regrouper les lumières, plus facile à gérer dans la scène
  const group = new Group();

  // --- Lumière ponctuelle (comme une ampoule) ---
  const pointLight = new PointLight(0xffffff, 3); // lumière blanche avec intensité 3
  pointLight.position.set(0, 0, 0); // placée au centre de la scène (au niveau du Soleil)
  pointLight.castShadow = false; // cette lumière ne projette pas d'ombres (économise des ressources)

  // Paramètres d'ombre (au cas où on activerait castShadow = true plus tard)
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 100;

  // --- Lumière ambiante (éclaire tout légèrement de manière uniforme) ---
  const ambientLight = new AmbientLight(0x404040, 0.1); // lumière douce, très faible
  // Elle permet d’éviter que certaines parties de la scène soient complètement noires

  // --- Lumière directionnelle (comme le Soleil vu de loin) ---
  const directionalLight = new DirectionalLight(0xffffff, 0.05); // lumière blanche faible
  directionalLight.position.set(100, 100, 0); // vient d’en haut à droite

  // On ajoute toutes les lumières au groupe
  group.add(pointLight, ambientLight, directionalLight);

  // Et on retourne ce groupe pour l'ajouter à la scène principale
  return group;
}
