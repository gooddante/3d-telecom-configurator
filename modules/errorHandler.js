/**
 * Simple Error Handler - Simplified for MVP
 */

// Simple error handler - just log and show basic message
export function handleError(message, error) {
  console.error(`Error: ${message}`, error);
  return error;
}

// Simple error handlers for compatibility
export const ErrorHandlers = {
  productNotFound(productId) {
    console.error(`Product not found: ${productId}`);
  },
  
  modelLoadingFailed(modelPath, error) {
    console.error(`Model loading failed: ${modelPath}`, error);
  },
  
  networkError(url, error) {
    console.error(`Network error: ${url}`, error);
  },
  
  urlParsingError(url) {
    console.error(`URL parsing error: ${url}`);
  },
  
  threeJsError(operation, error) {
    console.error(`Three.js error during ${operation}`, error);
  }
};

// Remove all the over-engineered complexity
// Just export what's needed for compatibility 