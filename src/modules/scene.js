import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * Initialize and configure the Three.js scene
 * @returns {THREE.Scene} Configured scene
 */
export function initializeScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5); // Lighter background

    // Add ambient light with optimized intensity
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    // scene.add(ambientLight);

    // Add key light (main directional light)
    // const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    // keyLight.position.set(5, 8, 5);
    // keyLight.castShadow = false;
    // scene.add(keyLight);

    // Add fill light
    // const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    // fillLight.position.set(-5, 3, -5);
    // fillLight.castShadow = false;
    // scene.add(fillLight);

    // Add rim light for better edge definition
    // const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    // rimLight.position.set(0, 5, -10);
    // scene.add(rimLight);

    // Add hemisphere light for better ambient illumination
    // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    // hemiLight.position.set(0, 20, 0);
    // scene.add(hemiLight);

    // Set up the HDRI environment with error handling
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/assets/studio.hdr', 
        (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture; // Use HDRI only for environment lighting
        },
        undefined,
        (error) => {
            console.warn('Failed to load HDRI environment:', error);
            // Fallback environment
            scene.environment = null;
        }
    );

    // Load the radial gradient image as the background
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/assets/radialGradient.jpeg', (texture) => {
        scene.background = texture; // Set the image as the background
    });

    console.log('Scene initialized');
    return scene;
}

// Export default for backward compatibility
export default initializeScene();
