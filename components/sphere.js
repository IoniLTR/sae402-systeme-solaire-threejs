// On importe les classes nécessaires depuis Three.js
import {
  SphereGeometry,         // Pour créer une géométrie de sphère
  MeshStandardMaterial,   // Matériau réaliste réagissant à la lumière
  Mesh,                   // Classe de base pour les objets 3D
  TextureLoader,          // Permet de charger des textures
} from 'three';

// On exporte une classe Sphere qui hérite de Mesh
export default class Sphere extends Mesh {
  /**
   * @param {number} radius - Le rayon de la sphère
   * @param {string|null} texturePath - Le chemin vers l'image de texture (optionnel)
   * @param {boolean} emissive - Si true, la sphère émettra de la lumière (comme le Soleil)
   */
  constructor(radius, texturePath = null, emissive = false) {
    // Création de la géométrie sphérique avec 32 segments pour la finesse
    const geometry = new SphereGeometry(radius, 32, 32);

    let material;

    // Si une texture est fournie
    if (texturePath) {
      const textureLoader = new TextureLoader();   // Créateur de textures
      const texture = textureLoader.load(texturePath);  // On charge la texture

      // Si la sphère doit émettre de la lumière
      if (emissive) {
        material = new MeshStandardMaterial({
          map: texture,                 // Texture de surface
          emissiveMap: texture,         // Même texture pour la lumière émise
          emissive: 0xffffff,           // Couleur blanche pour l'émission
          emissiveIntensity: 1.5,       // Intensité de l'émission lumineuse
        });
      } else {
        // Matériau standard avec juste une texture
        material = new MeshStandardMaterial({ map: texture });
      }
    } else {
      // Si aucune texture n'est fournie, on utilise une couleur jaune par défaut
      material = new MeshStandardMaterial({ color: 0xffff00 });
    }

    // Appel du constructeur de la classe Mesh avec la géométrie et le matériau
    super(geometry, material);

    // La sphère peut projeter une ombre sur d'autres objets
    this.castShadow = true;

    // La sphère peut aussi recevoir des ombres projetées par d'autres objets
    this.receiveShadow = true;
  }
}
