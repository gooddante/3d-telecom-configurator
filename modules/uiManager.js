/**
 * UI Manager Module
 * Handles DOM manipulation and UI updates for the product configurator
 */

/**
 * Update product display information
 * @param {Object} product - Product data object
 */
export function updateProductDisplay(product) {
  if (!product) {
    console.error('No product data provided to updateProductDisplay');
    return;
  }

  // Update product name
  const productNameElement = document.getElementById('product-name');
  if (productNameElement) {
    productNameElement.textContent = product.name || 'Product Name';
  }

  // Update product description
  const productDescElement = document.getElementById('product-description');
  if (productDescElement) {
    productDescElement.textContent = product.description || 'Product description not available.';
  }

  // Update product image if available
  const productImageElement = document.getElementById('product-image');
  if (productImageElement && product.image) {
    productImageElement.src = product.image;
    productImageElement.alt = product.name || 'Product Image';
  }

  console.log(`Product display updated for: ${product.name}`);
}

/**
 * Update specifications table
 * @param {Object} product - Product object containing specifications
 */
export function updateSpecifications(product) {
  const specsContainer = document.getElementById('specs-list');
  if (!specsContainer) {
    console.warn('Specifications container (#specs-list) not found');
    return;
  }

  // Clear existing specifications
  specsContainer.innerHTML = '';

  if (!product || !product.specifications || Object.keys(product.specifications).length === 0) {
    specsContainer.innerHTML = '<div class="spec-item">No specifications available</div>';
    return;
  }

  // Add each specification
  Object.entries(product.specifications).forEach(([key, value]) => {
    const specItem = document.createElement('div');
    specItem.className = 'spec-item';
    specItem.innerHTML = `<strong>${key}:</strong> <span>${value}</span>`;
    specsContainer.appendChild(specItem);
  });

  console.log('Specifications updated');
}

/**
 * Show loading state
 * @param {string} message - Loading message to display
 */
export function showLoadingState(message = 'Loading...') {
  const loadingElement = document.getElementById('loading-indicator');
  if (loadingElement) {
    loadingElement.textContent = message;
    loadingElement.style.display = 'block';
  }

  // Disable interactive elements during loading
  const interactiveElements = document.querySelectorAll('button, select, input');
  interactiveElements.forEach(element => {
    element.disabled = true;
  });
}

/**
 * Hide loading state
 */
export function hideLoadingState() {
  const loadingElement = document.getElementById('loading-indicator');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }

  // Re-enable interactive elements
  const interactiveElements = document.querySelectorAll('button, select, input');
  interactiveElements.forEach(element => {
    element.disabled = false;
  });
}

/**
 * Update UI for iframe mode
 */
export function optimizeForIframe() {
  // Add iframe-specific CSS class
  document.body.classList.add('iframe-mode');
  
  // Hide elements that shouldn't appear in iframe
  const elementsToHide = [
    'header',
    'navigation',
    'footer',
    '.breadcrumb'
  ];
  
  elementsToHide.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = 'none';
    }
  });

  // Optimize layout for compact view
  const mainContainer = document.querySelector('.container');
  if (mainContainer) {
    mainContainer.classList.add('compact-layout');
  }

  console.log('UI optimized for iframe display');
}

/**
 * Check if running in iframe
 * @returns {boolean} True if in iframe
 */
export function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

/**
 * Initialize UI based on context (iframe vs standalone)
 */
export function initializeUI() {
  if (isInIframe()) {
    optimizeForIframe();
  }
  
  // Set up responsive behavior
  setupResponsiveLayout();
  
  console.log('UI initialized');
}

/**
 * Setup responsive layout adjustments
 */
function setupResponsiveLayout() {
  // Add viewport meta tag if not present
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(viewport);
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    // Trigger Three.js renderer resize if needed
    const event = new CustomEvent('windowResize');
    window.dispatchEvent(event);
  });
}

/**
 * Show error message in UI
 * @param {string} message - Error message to display
 * @param {string} type - Error type ('error', 'warning', 'info')
 */
export function showMessage(message, type = 'info') {
  // Create or update message container
  let messageContainer = document.getElementById('message-container');
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';
    messageContainer.className = 'message-container';
    document.body.appendChild(messageContainer);
  }

  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `message message-${type}`;
  messageElement.textContent = message;

  // Add to container
  messageContainer.appendChild(messageElement);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }, 5000);
}

/**
 * Clear all messages
 */
export function clearMessages() {
  const messageContainer = document.getElementById('message-container');
  if (messageContainer) {
    messageContainer.innerHTML = '';
  }
}

/**
 * Show error message in UI
 * @param {string} message - Error message to display
 */
export function showError(message) {
  // Show error in loading overlay
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingProgress = document.getElementById('loading-progress');
  
  if (loadingOverlay && loadingProgress) {
    loadingProgress.textContent = `Error: ${message}`;
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
  }
  
  // Also show in console
  console.error('UI Error:', message);
} 