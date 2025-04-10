import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import camera from './camera.js';
import renderer from './renderer.js';
import { model } from './model.js';

// Create orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set initial target to origin
controls.target.set(0, 0, 0);

// Configure controls
controls.enableDamping = true; // Add smooth damping effect
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 0.5;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

// Update controls when model changes
function updateControlsTarget() {
    if (model) {
        // Get the center of the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        
        // Update controls target to the center of the model
        controls.target.copy(center);
        controls.update();
    }
}

function updateControls() {
    controls.update();
}

export { updateControls, updateControlsTarget };
