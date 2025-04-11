import './modules/scene.js';
import './modules/camera.js';
import './modules/renderer.js';
import './modules/light.js';
import './modules/orbitControls.js';

import { loadModel, updateModelProperty } from './modules/model.js';
import renderer from './modules/renderer.js';
import scene from './modules/scene.js';
import camera from './modules/camera.js';
import { updateControls } from './modules/orbitControls.js';

// Global variables to store current model data
let currentModelData = null;
let currentModelProperties = {};

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const categorySelect = document.getElementById('category-select');
    const productSelect = document.getElementById('product-select');
    const productName = document.getElementById('product-name');
    const productDescription = document.getElementById('product-description');
    const specsList = document.getElementById('specs-list');
    const propertiesList = document.getElementById('properties-list');
    const downloadSpecs = document.getElementById('download-specs');
    const requestQuote = document.getElementById('request-quote');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingProgress = document.getElementById('loading-progress');

    // Validate required elements
    if (!categorySelect || !productSelect) {
        console.error('Required selection elements are missing!');
        return;
    }

    // Fetch the product data
    fetch('assets/models.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch models.json');
            }
            return response.json();
        })
        .then(data => {
            // Store the data for later use
            currentModelData = data;

            // Populate category dropdown
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });

            // Initialize with first category if available
            if (data.categories.length > 0) {
                populateProducts(data.categories[0].id);
            }
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            showError('Failed to load product data');
        });

    // Category selection change handler
    categorySelect.addEventListener('change', (event) => {
        const selectedCategoryId = event.target.value;
        populateProducts(selectedCategoryId);
    });

    // Product selection change handler
    productSelect.addEventListener('change', (event) => {
        const selectedProductId = event.target.value;
        const selectedCategoryId = categorySelect.value;
        
        const category = currentModelData.categories.find(cat => cat.id === selectedCategoryId);
        if (category) {
            const product = category.products.find(prod => prod.id === selectedProductId);
            if (product) {
                updateProductDisplay(product);
            }
        }
    });

    function showError(message) {
        console.error(message);
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        // You could add UI error handling here
    }

    function updateProductDisplay(product) {
        // Update product info
        productName.textContent = product.name;
        productDescription.textContent = product.description;

        // Show loading overlay
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }

        // Construct the correct model path
        const modelPath = `assets/${product.filename}`;
        console.log('Loading model from:', modelPath);

        // Load the 3D model
        loadModel(modelPath)
            .then(() => {
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error loading model:', error);
                showError('Failed to load 3D model');
            });

        // Update specifications
        updateSpecifications(product.specifications);

        // Update configurable properties
        updateProperties(product.properties);
    }

    function updateSpecifications(specifications) {
        if (!specsList) return;

        specsList.innerHTML = '';
        
        Object.entries(specifications).forEach(([key, value]) => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            
            const label = document.createElement('span');
            label.className = 'spec-label';
            label.textContent = formatLabel(key);
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'spec-value';
            valueSpan.textContent = value;
            
            specItem.appendChild(label);
            specItem.appendChild(valueSpan);
            specsList.appendChild(specItem);
        });
    }

    function updateProperties(properties) {
        if (!propertiesList) return;

        propertiesList.innerHTML = '';
        currentModelProperties = {};

        Object.entries(properties).forEach(([key, values]) => {
            const propertyGroup = document.createElement('div');
            propertyGroup.className = 'property-group';

            const label = document.createElement('label');
            label.textContent = formatLabel(key);

            const select = document.createElement('select');
            select.className = 'property-select';

            values.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });

            select.addEventListener('change', (event) => {
                currentModelProperties[key] = event.target.value;
                updateModelProperty(key, event.target.value);
            });

            propertyGroup.appendChild(label);
            propertyGroup.appendChild(select);
            propertiesList.appendChild(propertyGroup);
        });
    }

    function populateProducts(categoryId) {
        productSelect.innerHTML = '<option value="">Sélectionnez un produit</option>';
        
        const category = currentModelData.categories.find(cat => cat.id === categoryId);
        if (category) {
            category.products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                productSelect.appendChild(option);
            });
        }
    }

    function formatLabel(key) {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Start animation loop
    animate();
});

function animate() {
    requestAnimationFrame(animate);
    updateControls();
    renderer.render(scene, camera);
}
