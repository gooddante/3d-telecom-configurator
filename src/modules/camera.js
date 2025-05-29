import * as THREE from 'three';

/**
 * Initialize and configure the perspective camera
 * @returns {THREE.PerspectiveCamera} Configured camera
 */
export function initializeCamera() {
    // Get container dimensions for aspect ratio
    const container = document.querySelector('.viewer-container');
    let aspect = 4/3; // Default aspect ratio
    
    if (container) {
        aspect = container.clientWidth / container.clientHeight;
    }

    // Create perspective camera with optimized settings
    const camera = new THREE.PerspectiveCamera(
        35, // Reduced FOV for less distortion
        aspect, // Aspect ratio
        0.1, // Near plane
        1000 // Far plane
    );

    // Set initial camera position for better default view
    camera.position.set(10, 7, 10);
    camera.lookAt(0, 0, 0);

    console.log('Camera initialized');
    return camera;
}

// Create default instance for backward compatibility
const defaultCamera = initializeCamera();

// Handle window resize for default instance
function updateCameraAspect() {
    const container = document.querySelector('.viewer-container');
    if (container) {
        defaultCamera.aspect = container.clientWidth / container.clientHeight;
        defaultCamera.updateProjectionMatrix();
    }
}

// Update camera aspect ratio on window resize
window.addEventListener('resize', updateCameraAspect);

// Initialize camera when DOM is loaded
document.addEventListener('DOMContentLoaded', updateCameraAspect);

export default defaultCamera;
