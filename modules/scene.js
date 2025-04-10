import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const scene = new THREE.Scene();

// Set up the HDRI environment
const rgbeLoader = new RGBELoader();
rgbeLoader.load('assets/studio.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping; // Use for reflections
  scene.environment = texture; // Apply as environment map (lighting and reflections)
});

// Load the radial gradient image as the background
const textureLoader = new THREE.TextureLoader();
textureLoader.load('assets/radialGradient.jpeg', (texture) => {
  scene.background = texture; // Set the image as the background
});

console.log('Scene initialized:', scene);

export default scene;
