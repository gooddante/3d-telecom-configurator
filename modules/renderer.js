import * as THREE from 'three';

/**
 * Initialize and configure the WebGL renderer
 * @returns {THREE.WebGLRenderer} Configured renderer
 */
export function initializeRenderer() {
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

    // Initialize renderer size
    const container = document.querySelector('.viewer-container');
    if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
    } else {
        // Fallback size
        renderer.setSize(800, 600);
    }

    console.log('Renderer initialized');
    return renderer;
}

// Create default instance for backward compatibility
const defaultRenderer = initializeRenderer();

// Handle window resize for default instance
window.addEventListener('resize', () => {
    const container = document.querySelector('.viewer-container');
    if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        defaultRenderer.setSize(width, height);
    }
});

export default defaultRenderer;
