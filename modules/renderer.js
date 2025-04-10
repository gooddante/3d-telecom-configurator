import * as THREE from 'three';

// Create the renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    canvas: document.getElementById('viewer-canvas')
});

// Set the size to match the container
renderer.setSize(window.innerWidth, window.innerHeight);

console.log('Renderer initialized:', renderer);
console.log('Renderer canvas:', renderer.domElement);

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

export default renderer;
