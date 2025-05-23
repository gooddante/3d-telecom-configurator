import { loadModel } from './model.js';

function setupSelection() {
    console.log("Setting up selection...");
    const objectSelect = document.getElementById('objectSelect');
    
    // Check if objectSelect element exists
    if (!objectSelect) {
        console.warn("Object select element not found in the DOM");
        return;
    }
    
    console.log("Dropdown:", objectSelect);

    objectSelect.addEventListener('change', (event) => {
        const selectedModel = event.target.value;
        console.log("Selected model:", selectedModel);
        loadModel(selectedModel);
    });

    // Load the initial model
    console.log("Initial model:", objectSelect.value);
    loadModel(objectSelect.value);
}

export { setupSelection };
