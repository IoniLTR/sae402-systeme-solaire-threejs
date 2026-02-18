import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Sphere from './components/Sphere.js';

import { createSun } from './objects/sun.js';
import { createMoon } from './objects/moon.js';
import { createPlanets } from './objects/planets.js';

import { createBackground } from './systems/background.js';
import { createSound } from './systems/sound.js';

import { createLightSpeedEffect } from './effects/lightSpeed.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(0, 15, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lumières
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(10, 20, 10);
scene.add(dir);

// Background (texture sky)
createBackground(scene);

// Soleil + Lune + Planètes
const sun = createSun();
scene.add(sun);

const moon = createMoon();
scene.add(moon);

const planets = createPlanets();
planets.forEach((p) => scene.add(p));

// Son
const { togglePlay } = createSound(camera);

// Effet vitesse lumière
const { updateLightSpeed, toggleLightSpeed } = createLightSpeedEffect(scene, camera);

// UI (bouton pause / popup si tu en as)
const pauseButton = document.getElementById('pauseButton');
if (pauseButton) pauseButton.addEventListener('click', togglePlay);

const speedButton = document.getElementById('speedButton');
if (speedButton) speedButton.addEventListener('click', toggleLightSpeed);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  // Animations simples
  sun.rotation.y += 0.001;
  moon.rotation.y += 0.003;

  planets.forEach((p) => {
    if (p.userData?.orbit) p.userData.orbit.rotation.y += p.userData.orbitSpeed || 0.001;
    p.rotation.y += 0.002;
  });

  updateLightSpeed();

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
