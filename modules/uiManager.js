/**
 * UI Manager - Simplified
 */

/**
 * Update product display information
 * @param {Object} product - Product data object
 */
export function updateProductDisplay(product) {
  if (!product) return;
  
  const nameEl = document.getElementById('product-name');
  const descEl = document.getElementById('product-description');
  
  if (nameEl) nameEl.textContent = product.name || 'Product Name';
  if (descEl) descEl.textContent = product.description || 'Product description not available.';
}

/**
 * Update specifications table
 * @param {Object} product - Product object containing specifications
 */
export function updateSpecifications(product) {
  const specsContainer = document.getElementById('specs-list');
  if (!specsContainer) return;
  
  specsContainer.innerHTML = '';
  
  if (!product?.specifications) {
    specsContainer.innerHTML = '<div class="spec-item">No specifications available</div>';
    return;
  }
  
  Object.entries(product.specifications).forEach(([key, value]) => {
    const specItem = document.createElement('div');
    specItem.className = 'spec-item';
    specItem.innerHTML = `<strong>${key}:</strong> <span>${value}</span>`;
    specsContainer.appendChild(specItem);
  });
}

/**
 * Show error message in UI
 * @param {string} message - Error message to display
 */
export function showError(message) {
  // Simple error display
  let errorEl = document.getElementById('error-message');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = 'error-message';
    errorEl.style.cssText = 'position:fixed;top:20px;right:20px;background:#f44336;color:white;padding:15px;border-radius:4px;z-index:1000;max-width:300px;';
    document.body.appendChild(errorEl);
  }
  
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 5000);
} 