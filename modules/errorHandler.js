/**
 * Error Handler Module
 * Centralized error handling and logging for the product configurator
 */

import { showMessage } from './uiManager.js';

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  NETWORK: 'network',
  MODEL_LOADING: 'model_loading',
  URL_PARSING: 'url_parsing',
  PRODUCT_NOT_FOUND: 'product_not_found',
  VALIDATION: 'validation',
  THREE_JS: 'three_js',
  GENERAL: 'general'
};

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Handle and log errors with appropriate user feedback
 * @param {Error|string} error - Error object or message
 * @param {string} type - Error type from ErrorTypes
 * @param {string} severity - Error severity from ErrorSeverity
 * @param {Object} context - Additional context information
 */
export function handleError(error, type = ErrorTypes.GENERAL, severity = ErrorSeverity.MEDIUM, context = {}) {
  const errorInfo = {
    message: error instanceof Error ? error.message : error,
    type,
    severity,
    timestamp: new Date().toISOString(),
    context,
    stack: error instanceof Error ? error.stack : null
  };

  // Log to console with appropriate level
  logError(errorInfo);

  // Show user-friendly message
  showUserError(errorInfo);

  // Send to analytics/monitoring if in production
  if (isProduction()) {
    reportError(errorInfo);
  }

  return errorInfo;
}

/**
 * Log error to console with appropriate level
 * @param {Object} errorInfo - Error information object
 */
function logError(errorInfo) {
  const logMessage = `[${errorInfo.type.toUpperCase()}] ${errorInfo.message}`;
  
  switch (errorInfo.severity) {
    case ErrorSeverity.CRITICAL:
      console.error(logMessage, errorInfo);
      break;
    case ErrorSeverity.HIGH:
      console.error(logMessage, errorInfo);
      break;
    case ErrorSeverity.MEDIUM:
      console.warn(logMessage, errorInfo);
      break;
    case ErrorSeverity.LOW:
      console.info(logMessage, errorInfo);
      break;
    default:
      console.log(logMessage, errorInfo);
  }
}

/**
 * Show user-friendly error message
 * @param {Object} errorInfo - Error information object
 */
function showUserError(errorInfo) {
  const userMessages = {
    [ErrorTypes.NETWORK]: 'Network connection error. Please check your internet connection.',
    [ErrorTypes.MODEL_LOADING]: 'Failed to load 3D model. Please try refreshing the page.',
    [ErrorTypes.URL_PARSING]: 'Invalid URL parameters. Please check the product link.',
    [ErrorTypes.PRODUCT_NOT_FOUND]: 'Product not found. Please verify the product ID.',
    [ErrorTypes.VALIDATION]: 'Invalid input data. Please check your selections.',
    [ErrorTypes.THREE_JS]: '3D viewer error. Please try refreshing the page.',
    [ErrorTypes.GENERAL]: 'An unexpected error occurred. Please try again.'
  };

  const userMessage = userMessages[errorInfo.type] || userMessages[ErrorTypes.GENERAL];
  const messageType = errorInfo.severity === ErrorSeverity.CRITICAL || errorInfo.severity === ErrorSeverity.HIGH ? 'error' : 'warning';
  
  showMessage(userMessage, messageType);
}

/**
 * Report error to external monitoring service
 * @param {Object} errorInfo - Error information object
 */
function reportError(errorInfo) {
  // In a real application, this would send to a service like Sentry, LogRocket, etc.
  // For now, we'll just log that we would report it
  console.log('Would report error to monitoring service:', errorInfo);
}

/**
 * Check if running in production
 * @returns {boolean} True if in production
 */
function isProduction() {
  return window.location.hostname !== 'localhost' && 
         window.location.hostname !== '127.0.0.1' &&
         window.location.hostname !== '';
}

/**
 * Handle specific error types with predefined handling
 */
export const ErrorHandlers = {
  /**
   * Handle product not found error
   * @param {string} productId - Product ID that wasn't found
   */
  productNotFound(productId) {
    return handleError(
      `Product '${productId}' not found in catalogue`,
      ErrorTypes.PRODUCT_NOT_FOUND,
      ErrorSeverity.HIGH,
      { productId }
    );
  },

  /**
   * Handle model loading error
   * @param {string} modelPath - Path to model that failed to load
   * @param {Error} originalError - Original error from model loader
   */
  modelLoadingFailed(modelPath, originalError) {
    return handleError(
      `Failed to load 3D model: ${modelPath}`,
      ErrorTypes.MODEL_LOADING,
      ErrorSeverity.HIGH,
      { modelPath, originalError: originalError?.message }
    );
  },

  /**
   * Handle network error
   * @param {string} url - URL that failed to load
   * @param {Error} originalError - Original network error
   */
  networkError(url, originalError) {
    return handleError(
      `Network request failed: ${url}`,
      ErrorTypes.NETWORK,
      ErrorSeverity.MEDIUM,
      { url, originalError: originalError?.message }
    );
  },

  /**
   * Handle URL parsing error
   * @param {string} url - URL that failed to parse
   */
  urlParsingError(url) {
    return handleError(
      `Failed to parse URL parameters: ${url}`,
      ErrorTypes.URL_PARSING,
      ErrorSeverity.MEDIUM,
      { url }
    );
  },

  /**
   * Handle Three.js error
   * @param {string} operation - Three.js operation that failed
   * @param {Error} originalError - Original Three.js error
   */
  threeJsError(operation, originalError) {
    return handleError(
      `Three.js error during ${operation}`,
      ErrorTypes.THREE_JS,
      ErrorSeverity.HIGH,
      { operation, originalError: originalError?.message }
    );
  }
};

/**
 * Create a safe async wrapper that handles errors
 * @param {Function} asyncFunction - Async function to wrap
 * @param {string} errorType - Error type for categorization
 * @returns {Function} Wrapped function with error handling
 */
export function safeAsync(asyncFunction, errorType = ErrorTypes.GENERAL) {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      handleError(error, errorType, ErrorSeverity.MEDIUM, { args });
      throw error; // Re-throw so calling code can handle if needed
    }
  };
}

/**
 * Global error handler for unhandled errors
 */
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handleError(
      event.reason,
      ErrorTypes.GENERAL,
      ErrorSeverity.HIGH,
      { type: 'unhandledrejection' }
    );
  });

  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    handleError(
      event.error || event.message,
      ErrorTypes.GENERAL,
      ErrorSeverity.HIGH,
      { 
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  });

  console.log('Global error handling initialized');
} 