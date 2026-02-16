// Ce fichier crée une Lune qui orbite autour de la planète Terre dans la scène 3D

import { Object3D } from 'three';     // Import d’un conteneur vide 3D pour créer un pivot
import Sphere from '../components/Sphere'; // Import du composant pour créer une sphère 3D

export default function createMoon(
  earthPlanet,       // La planète Terre autour de laquelle la Lune va tourner
  scene,             // La scène 3D principale (pas utilisée directement ici)
  clickablePlanets,  // Tableau pour garder les objets cliquables (ici la Lune)
  objects            // Tableau pour stocker les objets animés (avec leurs tick functions)
) {
  // Création d’un pivot vide qui servira de centre pour l’orbite de la Lune
  const moonPivot = new Object3D();

  // Création d’une sphère représentant la Lune, avec un rayon de 0.20 et une texture d’image
  const moon = new Sphere(0.20, 'assets/images/moon.jpg');

  // Positionnement de la Lune à 1 unité sur l’axe X par rapport à son pivot (distance orbitale)
  moon.position.x = 1;

  // Ajout d’informations sur la Lune qui pourront être affichées (nom, description, etc.)
  moon.userData = {
    name: 'Lune',
    description: 'Satellite naturel de la Terre.',
    temperature: 'Température moyenne : -53 °C',
    moons: 'Nombre de lunes : 0',
    composition: 'Surface rocheuse'
  };

  // On ajoute la Lune à la liste des objets cliquables pour pouvoir interagir avec elle
  clickablePlanets.push(moon);

  // On attache la Lune à son pivot (pivot qui va tourner pour simuler l’orbite)
  moonPivot.add(moon);

  // On attache le pivot de la Lune à la planète Terre, pour que la Lune orbite autour de la Terre
  earthPlanet.add(moonPivot);

  // On ajoute un objet à la liste "objects" pour animer la Lune à chaque frame
  objects.push({
    tick: () => {
      moonPivot.rotation.y += 0.005;  // Le pivot tourne doucement : la Lune fait son orbite autour de la Terre
      moon.rotation.y += 0.01;        // La Lune tourne sur elle-même (rotation propre)
    },
    tickSelfRotation: () => {
      moon.rotation.y += 0.01;        // Rotation propre seule (utile si on veut juste ça)
    }
  });
}
