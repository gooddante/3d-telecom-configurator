# 🧠 Project Context: 3D Product Configurator for ExpertCN

---

## 🧭 Overview

This is a modular 3D product configurator tailored for **ExpertCN**, embedded via `<iframe>` on **WordPress product pages**.

- Each WordPress product page includes the configurator
- The product page’s **URL parameter** or `postMessage` tells it which product to load
- The goal is to let users **visualize, customize**, and **request a quote** for telecom products

---

## 🔍 Functionality

### ✅ Product Loading
- Loads product data and 3D model by parsing a `?product=` param or via iframe message
- Uses simplified GLB model loading logic with fallback error handling
- Catalogue data is fetched from `assets/models.json`
- File structure has been greatly simplified for maintainability

### ⚙️ Customization (Temporarily Removed)
- Previous overengineered `productCustomization.js` was removed
- Will be reintroduced in a **modular and optional** way, specific to products that require it

### 📤 Quotation CTA
- Prepares a downloadable spec sheet (planned)
- Will allow users to send config details to sales team manually or via future backend integration

---

## 🧰 Current Architecture

### 🗂 Simplified File Structure

```
3d_product_configurator/
├── main.js                      # Application entry point - simplified
├── modules/
│   ├── model.js                 # 3D model loader (centralized)
│   ├── uiManager.js            # DOM updates for product info and specs
│   ├── productLoader.js        # Fetch and parse models.json
│   ├── errorHandler.js         # Unified error logging
│   └── urlManager.js           # URL param logic
├── assets/
│   ├── models.json              # Product definitions
│   └── *.glb                    # 3D models
├── styles/
│   └── style.css                # Simplified styling
```

---

## 📐 Simplification Summary

| File                | Old Lines | New Lines | Reduction |
|---------------------|-----------|-----------|-----------|
| errorHandler.js     | 247       | 30        | 88%       |
| productLoader.js    | 223       | 58        | 74%       |
| uiManager.js        | 237       | 54        | 77%       |
| productCustomization.js | 293   | 12 (stub) | 96%       |
| main.js             | 144       | 120       | 17%       |

---

## ✅ Completed Refactor Tasks

- ✅ Removed catalogue view logic
- ✅ Replaced product loading with URL + message-based method
- ✅ Simplified error handling
- ✅ Cleaned UI update logic
- ✅ Removed unused files (`selectionManager.js`, `callouts.js`, etc.)
- ✅ Created a clear fallback path if product not found
- ✅ Draco compression path planned

---

## 🔁 Next Refactor Steps

### **Phase 2: Add Iframe Messaging**
- Listen for `window.postMessage` to dynamically load product from WordPress
- Send back `threejs-ready` event to parent

### **Phase 3: Dynamic Model Reloading**
- Replace current model without reloading the page
- Clean up scene and dispose memory properly

### **Phase 4: Reintroduce Customization (Clean)**
- Create lightweight, per-product config system
- Only render filters that are defined in `models.json`

### **Phase 5: Generate Spec Sheet**
- Downloadable `.txt` or `.pdf` file containing selected product info
- Hooked to the "Request Quotation" CTA

### **Phase 6: Optimize Model Performance**
- Add DRACO loader support
- Compress models and test load times

---

## 🧠 Development Philosophy

> The project prioritizes **clarity**, **modularity**, and **MVP-first logic**.  
> Unused abstractions and bloated utilities have been removed to make the code maintainable and transparent.  
> The goal is a stable, understandable product viewer that integrates cleanly into ExpertCN’s sales workflow and website.

