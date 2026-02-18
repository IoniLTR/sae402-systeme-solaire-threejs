import * as THREE from 'three';

export function createBackground(scene) {
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/assets/images/sky.jpg');
  scene.background = texture;
}
