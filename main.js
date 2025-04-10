import './modules/scene.js';
import './modules/camera.js';
import './modules/renderer.js'; // Ensure this sets the renderer
import './modules/light.js';
import './modules/orbitControls.js';

import { loadModel } from './modules/model.js';
import renderer from './modules/renderer.js';
import scene from './modules/scene.js';
import camera from './modules/camera.js';
import { updateControls } from './modules/orbitControls.js';

// Ensure everything is ready before loading the model
document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.getElementById('fileSelect');
    const viewerContainer = document.querySelector('.viewer-container');

    console.log('Dropdown element:', selectElement); // Should not be null
    console.log('Viewer container:', viewerContainer); // Should not be null

    if (!selectElement || !viewerContainer) {
        console.error('Required DOM elements are missing!');
        return;
    }

    const folderPath = 'assets/';

    // Fetch the list of models from models.json
    fetch(`${folderPath}models.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch models.json');
            }
            console.log('models.json response:', response); // Debugging
            return response.json();
        })
        .then(files => {
            console.log('Models loaded:', files); // Debugging
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

    animate();
});

function animate() {
    console.log('Rendering frame...');
    requestAnimationFrame(animate);
    updateControls();
    renderer.render(scene, camera);
}
