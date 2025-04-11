import * as THREE from 'three';

// Create perspective camera with optimized settings
const camera = new THREE.PerspectiveCamera(
    35, // Reduced FOV for less distortion
    window.innerWidth * 0.75 / window.innerHeight, // Aspect ratio (75% of window width)
    0.1, // Near plane
    1000 // Far plane
);

// Set initial camera position for better default view
camera.position.set(10, 7, 10);
camera.lookAt(0, 0, 0);

// Handle window resize
function updateCameraAspect() {
    const container = document.querySelector('.viewer-container');
    if (container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    }
}

// Update camera aspect ratio on window resize
window.addEventListener('resize', updateCameraAspect);

// Initialize camera when DOM is loaded
document.addEventListener('DOMContentLoaded', updateCameraAspect);

console.log('Camera initialized:', camera);

export default camera;
