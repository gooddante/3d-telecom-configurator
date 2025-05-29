/**
 * URL Manager Module
 * Handles URL parameter parsing and validation for single-product loading
 */

/**
 * Get product ID from URL parameter
 * @returns {string|null} Product ID or null if not found
 */
export function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  
  if (!productId) {
    console.warn('No product parameter found in URL');
    return null;
  }
  
  return productId.trim();
}

/**
 * Update URL with product parameter
 * @param {string} productId - Product ID to add to URL
 */
export function updateUrlWithProduct(productId) {
  if (!productId) {
    console.warn('No product ID provided to updateUrlWithProduct');
    return;
  }
  
  const url = new URL(window.location);
  url.searchParams.set('product', productId);
  
  // Update URL without reloading the page
  window.history.replaceState({}, '', url);
  console.log(`URL updated with product: ${productId}`);
}

/**
 * Get all URL parameters as an object
 * @returns {Object} Object containing all URL parameters
 */
export function getAllUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Check if we're in development mode (localhost)
 * @returns {boolean} True if in development mode
 */
export function isDevelopmentMode() {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
}

/**
 * Get fallback product for development
 * @returns {string} Default product ID for development
 */
export function getDevelopmentFallback() {
  return 'patch-cord'; // Using actual product ID from models.json
}

/**
 * Validate product ID format
 * @param {string} productId - Product ID to validate
 * @returns {boolean} True if valid format
 */
export function isValidProductId(productId) {
  if (!productId || typeof productId !== 'string') {
    return false;
  }
  
  // Product ID should be lowercase, alphanumeric with hyphens
  const validPattern = /^[a-z0-9-]+$/;
  return validPattern.test(productId) && productId.length > 0;
}

/**
 * Get product ID with fallbacks for development
 * @returns {string|null} Product ID or null if invalid
 */
export function getProductIdWithFallback() {
  let productId = getProductIdFromUrl();
  
  // If no product ID and in development, use fallback
  if (!productId && isDevelopmentMode()) {
    productId = getDevelopmentFallback();
    console.info(`Development mode: Using fallback product '${productId}'`);
  }
  
  // Validate the product ID
  if (productId && isValidProductId(productId)) {
    return productId;
  }
  
  return null;
} 