import * as THREE from 'three';

export function createLightSpeedEffect(scene, camera) {
  let enabled = false;

  // Texture overlay
  const loader = new THREE.TextureLoader();
  const tex = loader.load('/assets/images/vitesse-lumiere.jpg');

  const geometry = new THREE.PlaneGeometry(200, 200);
  const material = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });

  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, -80);
  plane.renderOrder = 999;

  camera.add(plane);

  function toggleLightSpeed() {
    enabled = !enabled;
  }

  function updateLightSpeed() {
    const targetOpacity = enabled ? 0.35 : 0;
    material.opacity += (targetOpacity - material.opacity) * 0.08;
  }

  return { toggleLightSpeed, updateLightSpeed };
}
