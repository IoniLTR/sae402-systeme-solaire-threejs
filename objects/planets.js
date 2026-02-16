// Ce fichier ajoute toutes les planètes dans la scène avec leurs caractéristiques et anneaux éventuels

import * as THREE from 'three';               // On importe tout Three.js
import createPlanet from './createPlanet.js'; // Fonction pour créer une planète
import createRings from './createRings.js';   // Fonction pour créer des anneaux autour d’une planète

export default function addPlanets(scene, clickablePlanets, objects) {
  const planets = []; // Tableau pour garder toutes les planètes créées

  // Liste de données pour chaque planète : taille, distance, vitesse, texture, rotation, inclinaison, infos...
  const data = [
    {
      radius: 0.3, distance: 2.5, speed: 0.01, texture: 'assets/images/mercury.jpg', rot: 0.1 / 1407.5, tilt: 0.03,
      info: {
        name: 'Mercure', description: 'Planète la plus proche du Soleil.',
        temperature: 'Température moyenne : 167 °C', moons: 'Nombre de lunes : 0', composition: 'Surface rocheuse'
      }
    },
    {
      radius: 0.4, distance: 3.5, speed: 0.0075, texture: 'assets/images/venus.jpg', rot: -0.1 / 5832.5, tilt: 177.4,
      info: {
        name: 'Vénus', description: 'Planète la plus chaude du système solaire.',
        temperature: 'Température moyenne : 462 °C', moons: 'Nombre de lunes : 0', composition: 'Surface rocheuse'
      }
    },
    {
      radius: 0.5, distance: 5, speed: 0.005, texture: 'assets/images/earth.jpg', rot: 0.1 / 24, tilt: 23.44,
      info: {
        name: 'Terre', description: 'Notre planète bleue.',
        temperature: 'Température moyenne : 15 °C', moons: 'Nombre de lunes : 1', composition: 'Surface rocheuse'
      }
    },
    {
      radius: 0.45, distance: 6.5, speed: 0.004, texture: 'assets/images/mars.jpg', rot: 0.1 / 24.6, tilt: 25.19,
      info: {
        name: 'Mars', description: 'La planète rouge.',
        temperature: 'Température moyenne : -60 °C', moons: 'Nombre de lunes : 2', composition: 'Surface rocheuse'
      }
    },
    {
      radius: 0.9, distance: 8, speed: 0.0025, texture: 'assets/images/jupiter.jpg', rot: 0.1 / 9.9, tilt: 3.13,
      info: {
        name: 'Jupiter', description: 'La plus grosse planète du système solaire.',
        temperature: 'Température moyenne : -108 °C', moons: 'Nombre de lunes : 79', composition: 'Planète gazeuse'
      }
    },
    {
      radius: 0.8, distance: 9, speed: 0.0015, texture: 'assets/images/saturn.jpg', rot: 0.1 / 10.7, tilt: 26.73,
      info: {
        name: 'Saturne', description: 'Connue pour ses anneaux magnifiques.',
        temperature: 'Température moyenne : -139 °C', moons: 'Nombre de lunes : 82', composition: 'Planète gazeuse'
      },
      rings: { inner: 0.85, outer: 1.2, texture: 'assets/images/saturn_ring.png' } // Anneaux spécifiques à Saturne
    },
    {
      radius: 0.7, distance: 10, speed: 0.001, texture: 'assets/images/uranus.jpg', rot: -0.1 / 17.2, tilt: 43.77,
      info: {
        name: 'Uranus', description: 'Planète gazeuse bleutée.',
        temperature: 'Température moyenne : -195 °C', moons: 'Nombre de lunes : 27', composition: 'Planète gazeuse'
      }
    },
    {
      radius: 0.7, distance: 11, speed: 0.0005, texture: 'assets/images/neptune.jpg', rot: 0.1 / 16.1, tilt: 28.32,
      info: {
        name: 'Neptune', description: 'Planète la plus éloignée du Soleil.',
        temperature: 'Température moyenne : -200 °C', moons: 'Nombre de lunes : 14', composition: 'Planète gazeuse'
      }
    }
  ];

  // On parcourt chaque planète dans la liste de données
  for (const planet of data) {
    // Création de la planète avec ses propriétés (rayon, distance, vitesse, texture, rotation, inclinaison, infos)
    const created = createPlanet(
      scene,
      clickablePlanets,
      objects,
      planet.radius,
      planet.distance,
      planet.speed,
      planet.texture,
      planet.rot,
      planet.tilt,
      planet.info
    );

    // Calcul de l’inclinaison en radians (degrés convertis en radians)
    const tiltRadians = THREE.MathUtils.degToRad(planet.tilt);

    // Positionnement de la planète selon sa distance sur l’axe X
    created.planet.position.x = planet.distance;

    // Positionnement en hauteur (axe Y) selon l’inclinaison (tilt)
    created.planet.position.y = Math.sin(tiltRadians) * planet.distance;

    // Si la planète a des anneaux (ex: Saturne), on les crée et on les ajoute à la planète
    if (planet.rings) {
      createRings(
        created.planet,
        planet.rings.inner,
        planet.rings.outer,
        planet.rings.texture
      );
    }

    // On ajoute la planète créée dans le tableau des planètes
    planets.push(created);
  }

  // On retourne la liste complète des planètes créées (avec leurs pivots et sphères)
  return planets;
}
