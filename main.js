/**
 * Main Application Entry Point
 * 3D Product Configurator for ExpertCN
 * URL-based single product loader with iframe compatibility
 */

import * as THREE from 'three';
import { initializeScene } from './modules/scene.js';
import { initializeCamera } from './modules/camera.js';
import { initializeRenderer } from './modules/renderer.js';
import { initializeLights } from './modules/light.js';
import { initializeControls } from './modules/orbitControls.js';
import { startAnimation } from './modules/animate.js';
import { loadModel } from './modules/model.js';
import { getProductIdFromUrl, updateUrlWithProduct } from './modules/urlManager.js';
import { updateProductDisplay, updateSpecifications, showError } from './modules/uiManager.js';
import { loadCatalogue, findProductById } from './modules/productLoader.js';
import { handleError } from './modules/errorHandler.js';

// Global variables
let scene, camera, renderer, controls;
let currentProduct = null;
let catalogue = null;

/**
 * Initialize the 3D configurator
 */
async function init() {
    try {
        console.log('🚀 Initializing 3D Product Configurator...');
        
        // Initialize Three.js components
        scene = initializeScene();
        camera = initializeCamera();
        renderer = initializeRenderer();
        initializeLights(scene);
        controls = initializeControls(camera, renderer);
        
        // Start animation loop
        startAnimation(scene, camera, renderer);
        
        // Load product catalogue
        catalogue = await loadCatalogue();
        console.log('📦 Product catalogue loaded:', catalogue);
        
        // Get product ID from URL
        const productId = getProductIdFromUrl();
        console.log('🔗 Product ID from URL:', productId);
        
        // Load initial product
        if (productId) {
            await loadProductById(productId);
        } else {
            // Load default product (first in catalogue)
            if (catalogue && catalogue.length > 0) {
                await loadProductById(catalogue[0].id);
            }
        }
        
        console.log('✅ 3D Product Configurator initialized successfully');
        
    } catch (error) {
        handleError('Failed to initialize 3D configurator', error);
        showError('Failed to load the 3D configurator. Please refresh the page.');
    }
}

/**
 * Load a product by its ID
 * @param {string} productId - The product ID to load
 */
async function loadProductById(productId) {
    try {
        console.log('🔄 Loading product:', productId);
        
        // Find product in catalogue
        const product = findProductById(catalogue, productId);
        if (!product) {
            throw new Error(`Product not found: ${productId}`);
        }
        
        currentProduct = product;
        
        // Update URL
        updateUrlWithProduct(productId);
        
        // Update UI
        updateProductDisplay(product);
        updateSpecifications(product);
        
        // Load 3D model
        if (product.model_url) {
            await loadModel(scene, product.model_url);
            console.log('✅ Product loaded successfully:', product.name);
        } else {
            console.warn('⚠️ No model URL found for product:', product.name);
        }
        
    } catch (error) {
        handleError(`Failed to load product: ${productId}`, error);
        showError(`Failed to load product. Please try again.`);
    }
}

/**
 * Handle window resize
 */
function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Event listeners
window.addEventListener('resize', onWindowResize);

// Handle browser back/forward navigation
window.addEventListener('popstate', async (event) => {
    const productId = getProductIdFromUrl();
    if (productId && productId !== currentProduct?.id) {
        await loadProductById(productId);
    }
});

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.configurator = {
    scene,
    camera,
    renderer,
    controls,
    currentProduct,
    catalogue,
    loadProductById
};
