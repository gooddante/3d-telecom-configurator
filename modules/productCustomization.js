/**
 * Product Customization Manager
 * Handles all product-specific filters, properties, and customization logic
 * Manages data for quotation generation
 */

// Define all available property types
export const PROPERTY_TYPES = {
  select: {
    component: 'select',
    validation: (value, options) => options.includes(value)
  },
  multiSelect: {
    component: 'checkbox-group',
    validation: (values, options) => values.every(v => options.includes(v))
  },
  range: {
    component: 'range-slider',
    validation: (value, min, max) => value >= min && value <= max
  },
  color: {
    component: 'color-picker',
    validation: (value, options) => options.includes(value)
  },
  text: {
    component: 'text-input',
    validation: (value, pattern) => new RegExp(pattern).test(value)
  }
};

// Product-specific customization definitions
export const PRODUCT_CUSTOMIZATIONS = {
  'jarretieres-optiques': {
    name: 'Jarretières Optiques',
    properties: {
      type: {
        label: 'Type',
        type: 'select',
        options: ['Simplex', 'Duplex'],
        default: 'Simplex',
        required: true
      },
      fiber_type: {
        label: 'Type de Fibre',
        type: 'select',
        options: ['G657A2', 'G652D', 'OM1', 'OM2', 'OM3', 'OM4'],
        default: 'G652D',
        required: true
      },
      connector_start: {
        label: 'Connecteur Début',
        type: 'select',
        options: ['LCU', 'SCU', 'LCA', 'SCA', 'FCA', 'FCU', 'STU', 'E2A', 'E2U', 'MUU'],
        default: 'LCU',
        required: true
      },
      connector_end: {
        label: 'Connecteur Fin',
        type: 'select',
        options: ['LCU', 'SCU', 'LCA', 'SCA', 'FCA', 'FCU', 'STU', 'E2A', 'E2U', 'MUU'],
        default: 'LCU',
        required: true
      },
      length: {
        label: 'Longueur (m)',
        type: 'range',
        min: 0.5,
        max: 100,
        step: 0.5,
        default: 2,
        unit: 'm'
      },
      color: {
        label: 'Couleur',
        type: 'color',
        options: ['Bleu', 'Rouge', 'Vert', 'Jaune', 'Orange', 'Violet'],
        default: 'Bleu'
      }
    }
  },
  
  // Future products can be added here
  'pigtails': {
    name: 'Pigtails',
    properties: {
      fiber_type: {
        label: 'Type de Fibre',
        type: 'select',
        options: ['G657A2', 'G652D', 'OM1', 'OM2', 'OM3', 'OM4'],
        default: 'G652D',
        required: true
      },
      connector: {
        label: 'Connecteur',
        type: 'select',
        options: ['LCU', 'SCU', 'LCA', 'SCA', 'FCA', 'FCU', 'STU'],
        default: 'LCU',
        required: true
      },
      length: {
        label: 'Longueur (m)',
        type: 'range',
        min: 0.5,
        max: 50,
        step: 0.5,
        default: 1.5,
        unit: 'm'
      }
    }
  }
};

/**
 * Product Customization Manager Class
 */
export class ProductCustomizationManager {
  constructor(productId) {
    this.productId = productId;
    this.config = PRODUCT_CUSTOMIZATIONS[productId];
    this.values = {};
    this.listeners = [];
    
    if (!this.config) {
      throw new Error(`No customization config found for product: ${productId}`);
    }
    
    this.initializeDefaults();
  }
  
  /**
   * Initialize default values
   */
  initializeDefaults() {
    Object.entries(this.config.properties).forEach(([key, property]) => {
      this.values[key] = property.default;
    });
  }
  
  /**
   * Get property configuration
   */
  getProperty(key) {
    return this.config.properties[key];
  }
  
  /**
   * Get all properties
   */
  getAllProperties() {
    return this.config.properties;
  }
  
  /**
   * Set property value with validation
   */
  setValue(key, value) {
    const property = this.getProperty(key);
    if (!property) {
      throw new Error(`Property ${key} not found`);
    }
    
    if (this.validateValue(key, value)) {
      this.values[key] = value;
      this.notifyListeners(key, value);
      return true;
    }
    
    return false;
  }
  
  /**
   * Get property value
   */
  getValue(key) {
    return this.values[key];
  }
  
  /**
   * Get all values
   */
  getAllValues() {
    return { ...this.values };
  }
  
  /**
   * Validate property value
   */
  validateValue(key, value) {
    const property = this.getProperty(key);
    const propertyType = PROPERTY_TYPES[property.type];
    
    if (!propertyType) return false;
    
    switch (property.type) {
      case 'select':
      case 'color':
        return propertyType.validation(value, property.options);
      case 'range':
        return propertyType.validation(value, property.min, property.max);
      case 'text':
        return propertyType.validation(value, property.pattern);
      default:
        return true;
    }
  }
  
  /**
   * Add change listener
   */
  addListener(callback) {
    this.listeners.push(callback);
  }
  
  /**
   * Notify listeners of changes
   */
  notifyListeners(key, value) {
    this.listeners.forEach(callback => {
      callback(key, value, this.getAllValues());
    });
  }
  
  /**
   * Generate quotation data
   */
  generateQuotationData() {
    return {
      productId: this.productId,
      productName: this.config.name,
      customizations: this.getAllValues(),
      timestamp: new Date().toISOString(),
      summary: this.generateSummary()
    };
  }
  
  /**
   * Generate human-readable summary
   */
  generateSummary() {
    const summary = [];
    
    Object.entries(this.values).forEach(([key, value]) => {
      const property = this.getProperty(key);
      const unit = property.unit || '';
      summary.push(`${property.label}: ${value}${unit}`);
    });
    
    return summary.join('\n');
  }
  
  /**
   * Reset to defaults
   */
  reset() {
    this.initializeDefaults();
    this.notifyListeners('reset', null);
  }
  
  /**
   * Check if all required fields are filled
   */
  isValid() {
    return Object.entries(this.config.properties)
      .filter(([key, property]) => property.required)
      .every(([key]) => this.values[key] !== undefined && this.values[key] !== '');
  }
}

/**
 * Utility function to get available products
 */
export function getAvailableProducts() {
  return Object.keys(PRODUCT_CUSTOMIZATIONS);
}

/**
 * Utility function to check if product has customizations
 */
export function hasCustomizations(productId) {
  return PRODUCT_CUSTOMIZATIONS.hasOwnProperty(productId);
}

/**
 * Utility function to create customization manager
 */
export function createCustomizationManager(productId) {
  try {
    return new ProductCustomizationManager(productId);
  } catch (error) {
    console.error('Failed to create customization manager:', error);
    return null;
  }
} 