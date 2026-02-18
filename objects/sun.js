import * as THREE from 'three';
import Sphere from '../components/Sphere.js';

export function createSun() {
  const sun = new Sphere(6, '/assets/images/sun.jpg');

  // Emissive pour "briller"
  sun.material.emissive = new THREE.Color(0xffffff);
  sun.material.emissiveIntensity = 1.2;

  return sun;
}
