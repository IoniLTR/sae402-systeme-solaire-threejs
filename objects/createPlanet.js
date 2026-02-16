// Ce fichier crée une planète 3D avec rotation et orbite autour d’un point

import { Object3D, MathUtils } from 'three'; // On importe des outils de Three.js
import Sphere from '../components/Sphere';   // On importe un composant "Sphere" qui crée une sphère 3D

export default function createPlanet(
  scene,            // La scène 3D où on ajoute la planète
  clickablePlanets,  // Tableau pour garder les planètes cliquables
  objects,          // Tableau pour garder les objets à animer (avec leur fonction tick)
  radius,           // Rayon de la planète
  distance,         // Distance à laquelle la planète sera placée (par rapport au pivot/orbite)
  speed,            // Vitesse de rotation de la planète autour du pivot (orbite)
  texturePath,      // Chemin vers la texture (image) à appliquer sur la planète
  selfRotationSpeed = 0.05, // Vitesse de rotation de la planète sur elle-même (par défaut 0.05)
  axialTilt = 0,           // Inclinaison de la planète (axe x), en degrés (par défaut 0)
  data = {}                // Données supplémentaires associées à la planète (nom, description...)
) {
  // On crée un "pivot", un objet vide qui servira de centre pour l’orbite de la planète
  const pivot = new Object3D();

  // On crée la sphère représentant la planète avec le rayon et la texture fournis
  const planet = new Sphere(radius, texturePath);

  // On place la planète à la bonne distance sur l’axe X (c’est la position par rapport au pivot)
  planet.position.x = distance;

  // On incline la planète selon l’angle axialTilt (converti en radians)
  planet.rotation.x = MathUtils.degToRad(axialTilt);

  // On stocke les données supplémentaires dans la planète (ex : nom, description)
  planet.userData = data;

  // On ajoute cette planète à la liste des planètes cliquables (pour détecter les clics plus tard)
  clickablePlanets.push(planet);

  // On attache la planète au pivot (qui sera celui qui tourne pour simuler l’orbite)
  pivot.add(planet);

  // On ajoute le pivot à la scène, il devient visible dans le rendu
  scene.add(pivot);

  // On ajoute un objet à la liste "objects" qui sera animé à chaque frame via sa méthode tick()
  objects.push({
    tick: () => {
      pivot.rotation.y += speed;            // Fait tourner le pivot sur lui-même (orbite)
      planet.rotation.y += selfRotationSpeed; // Fait tourner la planète sur elle-même
    },
    tickSelfRotation: () => {
      planet.rotation.y += selfRotationSpeed; // Permet aussi de faire tourner la planète seule
    }
  });

  // On retourne le pivot et la planète pour pouvoir les manipuler depuis l’extérieur si besoin
  return { pivot, planet };
}
