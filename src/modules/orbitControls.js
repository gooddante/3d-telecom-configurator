import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let globalControls = null;

/**
 * Initialize and configure orbit controls
 * @param {THREE.Camera} camera - Three.js camera
 * @param {THREE.WebGLRenderer} renderer - Three.js renderer
 * @returns {OrbitControls} Configured orbit controls
 */
export function initializeControls(camera, renderer) {
    // Create orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Configure controls
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI;  // Allow full rotation
    controls.minPolarAngle = 0;        // Allow looking from below

    // Store reference for global functions
    globalControls = controls;

    console.log('Orbit controls initialized');
    return controls;
}

// Update controls target
export function updateControlsTarget(target = new THREE.Vector3(0, 0, 0)) {
    if (globalControls) {
        globalControls.target.copy(target);
        globalControls.update();
    }
}

// Update controls in animation loop
export function updateControls() {
    if (globalControls) {
        globalControls.update();
    }
}

// Create default instance for backward compatibility
import camera from '@modules/camera.js';
import renderer from '@modules/renderer.js';

const defaultControls = initializeControls(camera, renderer);

export default defaultControls;
