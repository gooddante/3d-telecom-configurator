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
    const folderPath = 'assets/';

    // Fetch the list of models from models.json
    fetch(`${folderPath}models.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch models.json');
            }
            return response.json();
        })
        .then(files => {
            // Populate the dropdown menu with the list of files
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = folderPath + file;
                option.textContent = file;
                selectElement.appendChild(option);
            });

            // Load the first model by default
            if (files.length > 0) {
                loadModel(folderPath + files[0]);
            }
        })
        .catch(error => {
            console.error('Error loading models:', error);
        });

    // Add event listener for dropdown changes
    selectElement.addEventListener('change', (event) => {
        const selectedUrl = event.target.value;
        loadModel(selectedUrl);
    });

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
