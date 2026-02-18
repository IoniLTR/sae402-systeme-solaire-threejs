import {
  SphereGeometry,
  MeshStandardMaterial,
  Mesh,
  TextureLoader,
} from 'three';

export default class Sphere extends Mesh {
  constructor(radius, texturePath) {
    const geometry = new SphereGeometry(radius, 64, 64);

    const texture = texturePath
      ? new TextureLoader().load(texturePath)
      : null;

    const material = new MeshStandardMaterial({
      map: texture || null,
      roughness: 1,
      metalness: 0,
    });

    super(geometry, material);
  }
}
