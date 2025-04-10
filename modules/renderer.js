import * as THREE from 'three';
import camera from './camera.js';

// Create the renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    canvas: document.getElementById('viewer-canvas')
});

// Set the size to match the container
function updateRendererSize() {
    const container = document.querySelector('.viewer-container');
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Update renderer size
    renderer.setSize(width, height);
    
    // Update camera aspect ratio
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Initial size setup
updateRendererSize();

// Handle window resize
window.addEventListener('resize', updateRendererSize);

console.log('Renderer initialized:', renderer);
console.log('Renderer canvas:', renderer.domElement);

export default renderer;
