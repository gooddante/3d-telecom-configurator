import './modules/scene.js';
import './modules/camera.js';
import './modules/renderer.js'; // Ensure this sets the renderer
import './modules/light.js';
import './modules/orbitControls.js';

import './modules/controls.js';

import { loadModel } from './modules/model.js';
import renderer from './modules/renderer.js';
import scene from './modules/scene.js';
import camera from './modules/camera.js';
import { updateControls } from './modules/orbitControls.js';

// Ensure everything is ready before loading the model
document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.getElementById('fileSelect');
    selectElement.addEventListener('change', (event) => {
        const selectedUrl = event.target.value;
        loadModel(selectedUrl);
    });

    // Load the initial model
    loadModel(selectElement.value);

    const bgColorInput = document.getElementById('bgColor');
    bgColorInput.addEventListener('input', (event) => {
        scene.background = new THREE.Color(event.target.value);
    });

    const cameraZInput = document.getElementById('cameraZ');
    cameraZInput.addEventListener('input', (event) => {
        camera.position.z = parseFloat(event.target.value);
    });

    animate();
});

function animate() {
    requestAnimationFrame(animate);
    updateControls();
    renderer.render(scene, camera);
}
