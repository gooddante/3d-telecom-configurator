/**
 * Main Application Entry Point - Simplified
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
import { NavigationBuilder } from './modules/navigationBuilder.js';

// Global variables
let scene, camera, renderer, controls;
let currentProduct = null;
let catalogue = null;
let navigationBuilder = null;

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
        console.log(`📦 Catalogue loaded: ${catalogue.categories.length} categories`);
        
        // Initialize navigation builder
        navigationBuilder = new NavigationBuilder('navigation-container');
        navigationBuilder.buildNavigation(catalogue);
        
        // Listen for product selection events from navigation
        document.addEventListener('productSelected', async (event) => {
            const { productId } = event.detail;
            await loadProductById(productId);
        });
        
        // Get product ID from URL or use fallback
        const productId = getProductIdFromUrl() || 'connector-sc';
        console.log('🔗 Loading product:', productId);
        
        await loadProductById(productId);
        
        // Initialize navigation state
        navigationBuilder.initializeState();
        
        console.log('✅ 3D Product Configurator initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize 3D configurator:', error);
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
        
        const product = findProductById(catalogue, productId);
        if (!product) {
            console.error(`Product not found: ${productId}`);
            showError(`Product '${productId}' not found`);
            return;
        }
        
        currentProduct = product;
        updateUrlWithProduct(productId);
        updateProductDisplay(product);
        updateSpecifications(product);
        
        // Update navigation active state
        if (navigationBuilder) {
            navigationBuilder.setActiveProduct(productId);
        }
        
        if (product.model_url) {
            await loadModel(scene, product.model_url);
            console.log('✅ Product loaded successfully:', product.name);
        } else {
            console.warn('⚠️ No model URL found for product:', product.name);
        }
        
    } catch (error) {
        console.error(`Failed to load product: ${productId}`, error);
        showError('Failed to load product. Please try again.');
    }
}

/**
 * Handle window resize
 */
function onWindowResize() {
    if (camera && renderer) {
        const container = document.querySelector('.viewer-container');
        if (container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }
}

// Event listeners
window.addEventListener('resize', onWindowResize);

// Handle browser back/forward navigation
window.addEventListener('popstate', async (event) => {
    const productId = getProductIdFromUrl();
    if (productId && productId !== currentProduct?.id) {
        await loadProductById(productId);
        
        // Update navigation active state
        if (navigationBuilder) {
            navigationBuilder.setActiveProduct(productId);
        }
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
    navigationBuilder,
    loadProductById
};
