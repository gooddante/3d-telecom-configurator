import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import camera from './camera.js';
import renderer from './renderer.js';
import { model } from './model.js';

// Create orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Configure controls
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2;

// Update controls target
export function updateControlsTarget(target = new THREE.Vector3(0, 0, 0)) {
    controls.target.copy(target);
    controls.update();
}

// Update controls in animation loop
export function updateControls() {
    controls.update();
}

export default controls;
