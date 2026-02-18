// Ce fichier crée le Soleil dans la scène

import Sphere from '../components/sphere'; // Import de la fonction pour créer une sphère texturée

export default function createSun(scene, clickablePlanets) {
  // On crée une grosse sphère pour représenter le Soleil
  // Rayon = 2, texture = image du Soleil, le dernier paramètre 'true' peut activer un effet spécial (ex: auto-illumination)
  const sun = new Sphere(2, 'assets/images/sun.jpg', true);

  sun.castShadow = false; // Le Soleil ne projette pas d'ombre (car il est la source de lumière)

  // On ajoute des informations sur le Soleil dans userData pour l'afficher dans l'interface quand on clique dessus
  sun.userData = {
    name: 'Soleil',
    description: 'Étoile centrale du système solaire.',
    temperature: 'Température : environ 5 500 °C',
    moons: 'Nombre de lunes : 0',
    composition: 'Composition : Gazeuse'
  };

  clickablePlanets.push(sun); // On ajoute le Soleil à la liste des objets cliquables

  scene.add(sun); // On ajoute le Soleil à la scène 3D pour qu'il soit visible

  return sun; // On retourne le Soleil créé (utile pour le manipuler après)
}
