import * as THREE from 'three';
import Sphere from '../components/Sphere.js';
import { createRings } from './createRings.js';

export function createPlanet({
  name,
  size,
  texture,
  distance,
  orbitSpeed = 0.001,
  ring = null,
}) {
  const planet = new Sphere(size, texture);
  planet.name = name;

  // Groupe d’orbite
  const orbit = new THREE.Group();
  orbit.add(planet);

  planet.position.x = distance;

  planet.userData.orbit = orbit;
  planet.userData.orbitSpeed = orbitSpeed;

  // Anneaux (Saturne)
  if (ring) {
    const rings = createRings(ring);
    planet.add(rings);
  }

  return { planet, orbit };
}
