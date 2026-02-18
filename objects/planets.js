import { createPlanet } from './createPlanet.js';

export function createPlanets() {
  const planetsData = [
    {
      name: 'Mercury',
      size: 1,
      texture: '/assets/images/mercury.jpg',
      distance: 10,
      orbitSpeed: 0.01,
    },
    {
      name: 'Venus',
      size: 1.5,
      texture: '/assets/images/venus.jpg',
      distance: 14,
      orbitSpeed: 0.008,
    },
    {
      name: 'Earth',
      size: 1.6,
      texture: '/assets/images/earth.jpg',
      distance: 18,
      orbitSpeed: 0.006,
    },
    {
      name: 'Mars',
      size: 1.2,
      texture: '/assets/images/mars.jpg',
      distance: 22,
      orbitSpeed: 0.005,
    },
    {
      name: 'Jupiter',
      size: 3.5,
      texture: '/assets/images/jupiter.jpg',
      distance: 28,
      orbitSpeed: 0.003,
    },
    {
      name: 'Saturn',
      size: 3,
      texture: '/assets/images/saturn.jpg',
      distance: 36,
      orbitSpeed: 0.0025,
      ring: {
        innerRadius: 3.4,
        outerRadius: 5.2,
        texture: '/assets/images/rocky_trail_02.webp',
      },
    },
    {
      name: 'Uranus',
      size: 2.4,
      texture: '/assets/images/uranus.jpg',
      distance: 44,
      orbitSpeed: 0.002,
    },
    {
      name: 'Neptune',
      size: 2.3,
      texture: '/assets/images/neptune.jpg',
      distance: 52,
      orbitSpeed: 0.0016,
    },
  ];

  const planets = [];

  planetsData.forEach((data) => {
    const { planet, orbit } = createPlanet(data);
    planets.push(planet);
    planets.push(orbit); // important : l’orbite tourne
  });

  // On ne garde que les Mesh "planètes" à retourner si tu préfères,
  // mais ici on renvoie tout pour l’ajout à la scène.
  return planets;
}
