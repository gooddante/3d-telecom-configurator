import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

console.log('Renderer initialized:', renderer);
console.log('Renderer DOM element:', renderer.domElement);

document.addEventListener('DOMContentLoaded', () => {
    const viewerContainer = document.querySelector('.viewer-container');
    console.log('Viewer container in renderer.js:', viewerContainer); // Debugging

    if (!viewerContainer) {
        throw new Error('Viewer container not found!');
    }

    viewerContainer.appendChild(renderer.domElement);
    console.log('Renderer DOM element:', renderer.domElement);
});

export default renderer;
