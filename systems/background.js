// Ce fichier sert à charger l'image qui sera utilisée comme fond (background) dans la scène 3D

import { TextureLoader } from 'three'; // On importe l'outil qui permet de charger des textures (images)

export default function createBackground() {
  // On charge une image à partir du dossier "assets/images"
  const texture = new TextureLoader().load('assets/images/sky.jpg');

  // On retourne la texture chargée pour qu'elle puisse être utilisée ailleurs dans le projet
  return texture;
}
