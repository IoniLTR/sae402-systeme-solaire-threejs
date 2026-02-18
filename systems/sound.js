// Ce fichier permet d'ajouter un fond sonore à une scène 3D en utilisant la bibliothèque Three.js

// On importe les classes nécessaires depuis la bibliothèque Three.js pour gérer l'audio
import {
  AudioListener,  // Ecouteur audio qui capte les sons dans la scène 3D
  Audio,          // Objet sonore qui va jouer un son
  AudioLoader     // Utilisé pour charger un fichier audio depuis un chemin
} from 'three';

// Fonction principale qui crée un son de fond associé à une caméra 3D
export default function createBackgroundSound(camera) {
  // Crée un écouteur audio (c'est comme une "oreille") qui doit être attaché à la caméra,
  // pour que le son soit entendu à partir de la position de la caméra dans la scène
  const listener = new AudioListener();
  camera.add(listener);  // On attache cet écouteur à la caméra

  // Crée un nouvel objet sonore qui utilisera cet écouteur pour jouer le son
  const sound = new Audio(listener);

  // Crée un chargeur audio qui va permettre de récupérer le fichier son
  const audioLoader = new AudioLoader();

  // On retourne une promesse, c’est-à-dire une opération asynchrone qui sera terminée plus tard,
  // quand le son sera chargé. Cela permet de gérer le chargement sans bloquer le reste du code.
  return new Promise((resolve, reject) => {
    // audioLoader.load charge le fichier audio (ici 'assets/audio/space.mp3')
    audioLoader.load(
      'assets/audio/space.mp3',

      // Cette fonction est appelée quand le fichier audio est chargé avec succès
      function (buffer) {
        // On assigne le son chargé (buffer) à notre objet sonore
        sound.setBuffer(buffer);

        // On fait en sorte que le son se répète en boucle
        sound.setLoop(true);

        // On règle le volume du son (ici à 30% du volume maximal)
        sound.setVolume(0.3);

        console.log('Son chargé avec succès');

        // On "résout" la promesse en retournant l’objet son prêt à être joué
        resolve(sound);
      },

      // Ici, on peut passer une fonction pour suivre la progression du chargement (non utilisée)
      undefined,

      // Cette fonction est appelée si une erreur arrive pendant le chargement du son
      function (err) {
        console.error('Erreur lors du chargement de la musique :', err);

        // On rejette la promesse pour signaler l’erreur
        reject(err);
      }
    );
  });
}
