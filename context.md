# 🧠 Project Context: 3D Product Configurator for ExpertCN

---

## 🧭 Overview

This is a modular 3D product configurator tailored for **ExpertCN**, embedded via `<iframe>` on **WordPress product pages**.

- Each WordPress product page includes the configurator
- The product page’s **URL parameter** determines which product to load
- The goal is to let users **visualize, customize**, and **request a quote** for telecom products (e.g., jarretières, appareils de mesure)

---

## 🔍 Functionality

### ✅ Product-Specific Loading
- On page load, parse the URL to extract the product name (e.g., `?product=jarretiere-sm`)
- Load the appropriate **3D model** and **associated configuration options**
- Configuration filters vary depending on the product category

### ⚙️ Customization Logic
- Each product has **custom filters**:
  - e.g., Jarretières: fiber type, connector type, length
  - Appareils de mesure: test port, interface, range
- UI dynamically adapts to the selected product type

### 📤 Quotation CTA
- Users can click “**Request a Quote**”
- Generates a downloadable **specification file** (.txt or .pdf) that includes:
  - Product name & category
  - All selected configuration options
  - (Optional) Timestamp or contact information
- File can be:
  - Downloaded locally
  - Sent to sales team manually
  - Or emailed automatically via backend integration (future phase)

---

## 🧰 Architecture & Codebase

### 🗂 Directory Structure
```
src/
├── core/
│   ├── message.js        // Handles iframe communication
│   ├── state.js          // Central config/state store
│   └── loader.js         // Centralized loading logic
├── models/
│   ├── model.js          // Three.js model handling
│   └── options.js        // Product-specific option mapping
├── ui/
│   ├── controls.js       // Filter UI generation
│   └── indicators.js     // Loading + feedback UI
└── utils/
    ├── validation.js     // Option validation
    └── specSheet.js      // Spec sheet generation
```

### 🧠 Core Systems

- **Message System (iframe):** Cross-window communication
- **Central Loader:** One loading manager for all products
- **Dynamic UI:** Loads only applicable filters based on product
- **OrbitControls:** For 3D interaction

---

## 📐 Best Practices

### 🔹 Code Quality
- Avoid direct DOM manipulation; rely on controlled rendering
- Keep logic modular and scoped by responsibility
- Use named exports, avoid default unless required
- Comment non-obvious logic and edge cases
- Keep reusable utilities in `utils/`

### 🔹 Scalability
- Support plugin-style expansion for new product types
- Use consistent key names for filters (e.g., `connectorType`, `fiberType`)
- Group filters and models by product category
- Avoid hardcoding strings—use mappings or constants

### 🔹 Performance
- Cache models to avoid re-fetching across sessions
- Use lazy loading and lightweight placeholder animations
- Debounce filter change events where needed

---

## 🚫 Anti-Patterns to Avoid

- ❌ Hardcoded config in `main.js` (move to `productConfig.js`)
- ❌ Embedding product logic directly in viewer code
- ❌ One-size-fits-all filter UI — must be contextual

---

## 🧪 Current Known Limitations

- No backend integration for quote submission (manual download only)
- Some products still lack 3D models or complete option sets
- No automated testing setup yet

---

## ✅ Next Priorities

1. Refactor filter system to support product-specific logic
2. Centralize model loading & add visual loading feedback
3. Improve documentation and README
4. Implement better error handling + error boundary UI
5. Add developer hooks for backend quote submission
