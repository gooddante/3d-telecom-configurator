import * as THREE from 'three';
import camera from './camera.js';

// Create WebGL renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: document.getElementById('viewer-canvas')
});

// Set renderer properties
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.querySelector('.viewer-container');
    if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
});

// Initialize renderer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.viewer-container');
    if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
    }
});

console.log('Renderer initialized:', renderer);
console.log('Renderer canvas:', renderer.domElement);

export default renderer;
