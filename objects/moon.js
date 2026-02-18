import * as THREE from 'three';
import Sphere from '../components/Sphere.js';

export function createMoon() {
  const moon = new Sphere(1.2, '/assets/images/moon.jpg');

  // Position de base (à ajuster selon ton setup)
  moon.position.set(12, 0, 0);

  // Petit éclairage dédié
  const light = new THREE.PointLight(0xffffff, 0.6, 50);
  light.position.set(0, 0, 0);
  moon.add(light);

  return moon;
}
