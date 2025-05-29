/**
 * Navigation Builder Module
 * Dynamically generates product navigation from models.json
 */

export class NavigationBuilder {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Navigation container '${containerId}' not found`);
    }
  }

  /**
   * Build navigation from categories data
   * @param {Object} data - Categories data from models.json
   */
  buildNavigation(data) {
    if (!data.categories || !Array.isArray(data.categories)) {
      console.error('Invalid categories data provided to NavigationBuilder');
      return;
    }

    // Clear existing content
    this.container.innerHTML = '';

    // Build each category section
    data.categories.forEach(category => {
      const categorySection = this.createCategorySection(category);
      this.container.appendChild(categorySection);
    });
  }

  /**
   * Create a category section with its products
   * @param {Object} category - Category object with id, name, and products
   * @returns {HTMLElement} - Category section element
   */
  createCategorySection(category) {
    const section = document.createElement('div');
    section.className = 'category-section';

    // Category title
    const title = document.createElement('h3');
    title.textContent = category.name;
    section.appendChild(title);

    // Product buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'product-buttons';

    // Create button for each product
    category.products.forEach(product => {
      const button = this.createProductButton(product);
      buttonsContainer.appendChild(button);
    });

    section.appendChild(buttonsContainer);
    return section;
  }

  /**
   * Create a product navigation button
   * @param {Object} product - Product object with id and name
   * @returns {HTMLElement} - Product button element
   */
  createProductButton(product) {
    const button = document.createElement('a');
    button.href = `?product=${product.id}`;
    button.className = 'product-button';
    button.textContent = product.name;
    
    // Add click handler for SPA-like behavior (optional)
    button.addEventListener('click', (e) => {
      this.handleProductClick(e, product.id);
    });

    return button;
  }

  /**
   * Handle product button click
   * @param {Event} event - Click event
   * @param {string} productId - Product ID
   */
  handleProductClick(event, productId) {
    // Mark current button as active
    this.setActiveProduct(productId);
    
    // Emit custom event for product selection
    const productSelectedEvent = new CustomEvent('productSelected', {
      detail: { productId }
    });
    document.dispatchEvent(productSelectedEvent);
  }

  /**
   * Set active state for the selected product
   * @param {string} productId - Product ID to mark as active
   */
  setActiveProduct(productId) {
    // Remove active class from all buttons
    this.container.querySelectorAll('.product-button').forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to current button
    const currentButton = this.container.querySelector(`a[href="?product=${productId}"]`);
    if (currentButton) {
      currentButton.classList.add('active');
    }
  }

  /**
   * Get current product ID from URL or set default
   * @returns {string|null} - Current product ID
   */
  getCurrentProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('product');
  }

  /**
   * Initialize navigation with current product state
   */
  initializeState() {
    const currentProductId = this.getCurrentProductId();
    if (currentProductId) {
      this.setActiveProduct(currentProductId);
    }
  }
} 