import * as THREE from 'three';

export function createSound(camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

  audioLoader.load('/assets/audio/space.mp3', (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.4);
  });

  function togglePlay() {
    if (!sound.buffer) return;
    if (sound.isPlaying) sound.pause();
    else sound.play();
  }

  return { togglePlay, sound };
}
