/**
 * Product Loader - Simplified
 */

let catalogueData = null;

/**
 * Load the product catalogue from JSON file
 * @returns {Promise<Object>} Catalogue data
 */
export async function loadCatalogue() {
  if (catalogueData) return catalogueData;
  
  try {
    const response = await fetch('/3d-telecom-configurator/assets/models.json');
    if (!response.ok) {
      throw new Error(`Failed to load catalogue: ${response.status} ${response.statusText}`);
    }
    
    catalogueData = await response.json();
    console.log('✅ Catalogue loaded successfully');
    return catalogueData;
  } catch (error) {
    console.error('Failed to load catalogue:', error);
    throw error;
  }
}

/**
 * Find a product by ID in the catalogue
 * @param {Object} catalogue - Catalogue data containing categories
 * @param {string} productId - Product ID to find
 * @returns {Object|null} Product data or null if not found
 */
export function findProductById(catalogue, productId) {
  if (!catalogue?.categories || !productId) return null;
  
  for (const category of catalogue.categories) {
    // Check main products
    if (category.products) {
      const product = category.products.find(p => p.id === productId);
      if (product) {
        return {
          ...product,
          category: { id: category.id, name: category.name },
          model_url: product.filename ? `/3d-telecom-configurator/assets/${product.filename}` : null
        };
      }
    }
    
    // Check subcategory products
    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        if (subcategory.products) {
          const product = subcategory.products.find(p => p.id === productId);
          if (product) {
            return {
              ...product,
              category: { id: category.id, name: category.name },
              subcategory: { id: subcategory.id, name: subcategory.name },
              model_url: product.filename ? `/3d-telecom-configurator/assets/${product.filename}` : null
            };
          }
        }
      }
    }
  }
  
  return null;
}

/**
 * Get product data with validation
 * @param {string} productId - Product ID to load
 * @returns {Promise<Object>} Product data
 * @throws {Error} If product not found
 */
export async function getProduct(productId) {
  if (!productId) {
    throw new Error('Product ID is required');
  }

  const product = await findProductById(catalogueData, productId);
  
  if (!product) {
    throw new Error(`Product '${productId}' not found`);
  }

  console.log(`Product loaded: ${product.name} (${product.id})`);
  return product;
}

/**
 * Get all products from catalogue (for development/testing)
 * @returns {Promise<Array>} Array of all products
 */
export async function getAllProducts() {
  try {
    const catalogue = await loadCatalogue();
    const allProducts = [];
    
    catalogue.categories.forEach(category => {
      category.products.forEach(product => {
        allProducts.push({
          ...product,
          category: {
            id: category.id,
            name: category.name
          }
        });
      });
    });
    
    return allProducts;
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
}

/**
 * Get products by category
 * @param {string} categoryId - Category ID
 * @returns {Promise<Array>} Array of products in category
 */
export async function getProductsByCategory(categoryId) {
  try {
    const catalogue = await loadCatalogue();
    const category = catalogue.categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return [];
    }
    
    return category.products.map(product => ({
      ...product,
      category: {
        id: category.id,
        name: category.name
      }
    }));
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
}

/**
 * Validate product data structure
 * @param {Object} product - Product data to validate
 * @returns {boolean} True if valid
 */
export function validateProduct(product) {
  if (!product || typeof product !== 'object') {
    return false;
  }

  const requiredFields = ['id', 'name', 'filename'];
  const hasRequiredFields = requiredFields.every(field => 
    product.hasOwnProperty(field) && product[field]
  );

  if (!hasRequiredFields) {
    console.warn('Product missing required fields:', product);
    return false;
  }

  return true;
}

/**
 * Get model file path for a product
 * @param {Object} product - Product data
 * @returns {string} Full path to model file
 */
export function getModelPath(product) {
  if (!product || !product.filename) {
    throw new Error('Invalid product or missing filename');
  }
  
  return `/3d-telecom-configurator/assets/${product.filename}`;
}

/**
 * Get available property options for a product
 * @param {Object} product - Product data
 * @returns {Object} Property options organized by property type
 */
export function getProductProperties(product) {
  if (!product || !product.properties) {
    return {};
  }
  
  return { ...product.properties };
}

/**
 * Get product specifications
 * @param {Object} product - Product data
 * @returns {Object} Product specifications
 */
export function getProductSpecifications(product) {
  if (!product || !product.specifications) {
    return {};
  }
  
  return { ...product.specifications };
}

/**
 * Create a product summary for logging/debugging
 * @param {Object} product - Product data
 * @returns {string} Product summary
 */
export function getProductSummary(product) {
  if (!product) {
    return 'No product data';
  }
  
  const category = product.category ? ` (${product.category.name})` : '';
  const propertiesCount = product.properties ? Object.keys(product.properties).length : 0;
  
  return `${product.name}${category} - ${propertiesCount} customizable properties`;
} 