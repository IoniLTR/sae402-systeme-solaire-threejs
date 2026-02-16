// On importe tout Three.js
import * as THREE from 'three';

// Fonction principale qui gère l'effet de vitesse lumière
export default function createLightSpeedEffect(
  camera,         // La caméra de la scène
  scene,          // La scène principale
  baseCamPos,     // Position de base de la caméra (après l'animation)
  baseCamTarget,  // Point que la caméra regarde normalement
  controls,       // Contrôles orbitaux (type OrbitControls)
  composer,       // Le moteur de post-processing
  objects,        // Les objets animés (planètes, lunes, etc.)
  sun,            // Le soleil (objet 3D)
  popup,          // Interface d'information (popup)
  pauseControl    // Contrôle pour mettre en pause les animations
) {
  // Dimensions du cylindre (effet visuel de "saut spatial")
  const CYLINDER_HEIGHT = 40;
  const CYLINDER_RADIUS = 3;

  // Chargement de la texture de vitesse lumière
  const textureLoader = new THREE.TextureLoader();
  const speedTexture = textureLoader.load('assets/images/vitesse-lumiere.jpg', (tex) => {
    // Répétition de la texture verticalement (effet de défilement)
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 5);
  });

  // Position verticale du centre du cylindre
  const cylinderPosY = baseCamPos.y + CYLINDER_HEIGHT / 2;

  // Création du cylindre avec texture semi-transparente
  const speedCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT, 32, 1, true),
    new THREE.MeshPhongMaterial({
      map: speedTexture,         // Texture appliquée
      side: THREE.DoubleSide,    // Visible de l’intérieur et l’extérieur
      transparent: true,
      opacity: 0.8,
    })
  );
  speedCylinder.position.set(0, cylinderPosY, 0);  // Position au centre de la scène
  scene.add(speedCylinder);

  // Ajout d'une lumière blanche à l'intérieur du cylindre
  const cylinderLight = new THREE.PointLight(0xffffff, 1, 50); // Intensité = 1, portée = 50
  cylinderLight.position.copy(speedCylinder.position);
  scene.add(cylinderLight);

  // Départ (haut du cylindre) et fin (position normale) de la caméra
  const camStartPos = new THREE.Vector3(0, cylinderPosY + CYLINDER_HEIGHT / 2, 0);
  const camEndPos = baseCamPos.clone();

  // Variables de l'animation
  let animationStartTime = null;
  const animationDuration = 10000; // Durée : 10 secondes
  let animationPhase = 0; // 0 = animation de descente, 1 = vue normale

  // Fonction récursive d'animation
  function animate(time = 0) {
    if (!animationStartTime) animationStartTime = time;
    const elapsed = time - animationStartTime;

    if (animationPhase === 0) {
      // Phase de descente dans le cylindre
      const t = Math.min(elapsed / animationDuration, 1); // Normalisation [0, 1]

      // Animation de la texture (effet de mouvement vertical)
      if (speedTexture) speedTexture.offset.y = 1 - t * 5;

      // Interpolation linéaire de la position de la caméra
      camera.position.lerpVectors(camStartPos, camEndPos, t);

      // La caméra regarde vers le bas
      camera.lookAt(0, camera.position.y - 5, 0);

      // Diminution progressive de l’intensité de la lumière
      cylinderLight.intensity = 1 - t;

      if (t === 1) {
        // Fin de l'effet "saut lumière"
        animationPhase = 1;
        animationStartTime = time;

        // Retirer les éléments de l’effet
        scene.remove(speedCylinder);
        scene.remove(cylinderLight);

        // Activer les contrôles orbitaux pour la suite
        controls.enabled = true;
        controls.update();

        // Replacer caméra et orientation au cas où
        camera.position.copy(baseCamPos);
        camera.lookAt(baseCamTarget);
      }
    } else {
      // Phase orbitale normale : rotation du soleil et des objets
      sun.rotation.y += 0.005;

      for (const obj of objects) {
        if (pauseControl.isPaused()) {
          // Si en pause, seuls certains objets tournent sur eux-mêmes
          if (obj.tickSelfRotation) obj.tickSelfRotation();
        } else {
          obj.tick(); // Sinon, animation complète
        }
      }

      // Mise à jour du popup si actif
      popup.update();
    }

    // Rendu de la scène avec post-processing
    composer.render();

    // Boucle d'animation (prochaine frame)
    requestAnimationFrame(animate);
  }

  // On retourne la fonction pour qu'elle soit appelée dans main.js
  return animate;
}
