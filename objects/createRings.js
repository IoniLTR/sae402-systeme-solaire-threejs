// Ce fichier crée un anneau autour d’une planète (comme les anneaux de Saturne)

import { RingGeometry, MeshBasicMaterial, Mesh, TextureLoader, DoubleSide } from 'three';

export default function createRings(
  planet,       // La planète autour de laquelle on ajoute les anneaux
  innerRadius,  // Rayon intérieur de l’anneau (le trou au milieu)
  outerRadius,  // Rayon extérieur de l’anneau (la bordure extérieure)
  texturePath   // Chemin vers l’image utilisée pour la texture de l’anneau
) {
  // On crée la géométrie d’un anneau avec le rayon intérieur, extérieur et 64 segments (pour lisser)
  const ringGeometry = new RingGeometry(innerRadius, outerRadius, 64);

  // On prépare un chargeur de textures pour importer l’image
  const textureLoader = new TextureLoader();

  // On charge la texture depuis le fichier (image)
  const ringTexture = textureLoader.load(texturePath);

  // On crée un matériau basique avec la texture chargée
  // - map : texture appliquée
  // - side : DoubleSide pour que l’anneau soit visible des deux côtés
  // - transparent : true pour supporter la transparence (pour rendre les trous dans la texture)
  const ringMaterial = new MeshBasicMaterial({
    map: ringTexture,
    side: DoubleSide,
    transparent: true,
  });

  // On crée un objet 3D (Mesh) combinant la géométrie de l’anneau et son matériau
  const ring = new Mesh(ringGeometry, ringMaterial);

  // On fait pivoter l’anneau de 90° sur l’axe X pour qu’il soit horizontal autour de la planète
  ring.rotation.x = Math.PI / 2;

  // On ajoute cet anneau à la planète (il bougera donc avec elle)
  planet.add(ring);
}
