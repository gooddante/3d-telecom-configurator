# 🧠 Project Context: 3D Product Configurator for ExpertCN

---

## 🧭 Overview

This is a modular 3D product configurator designed for **ExpertCN**, embedded via `<iframe>` inside WordPress product pages.

- Each product page includes the configurator
- Products are loaded using **SEO-friendly French URLs**:
  ```
  /produits/jarretiere-optique
  /produits/connecteurs/connecteur-sc
  /produits/accessoires/adaptateur-sc-lc
  ```
- The URL slug determines which product to display
- A fallback legacy support (`?product=...`) is still available for backward compatibility
- The system allows users to **visualize**, **customize**, and **request a quote** for telecom products

---

## 🔍 Functionality

### ✅ Core Features
- **SEO-friendly product loading via slugs**
- **Product-specific filters** loaded from `productCustomization.js`
- **3D product visualization** with Three.js
- **Quotation request** with downloadable `.txt` or `.pdf`
- **Iframe-compatible** for seamless embedding on WordPress product pages

---

## ⚙️ Customization & URL Logic

- URLs follow a clean structure: `/produits/{slug}` or `/produits/{category}/{slug}`
- Each product entry in `models.json` contains:
  - `id`, `name`, `slug` (for SEO), `filename`, and `seo` metadata (title, description, keywords)
- Slugs are either predefined or generated from the French product name
- Product data is resolved via a `findProductBySlug()` utility

---

## 📤 Quotation CTA

- A “Request a Quote” button generates a downloadable specification file
- The file includes:
  - Product name and category
  - Selected customization options
  - Optional timestamp/contact info
- Future backend integration may allow automatic submission to sales team

---

## 🧰 Codebase Structure

```
3d_product_configurator/
├── main.js                        # App entry point (being refactored)
├── context.md                     # This file
├── modules/
│   ├── model.js                   # 3D model loader
│   ├── productCustomization.js    # Product-specific filter logic
│   ├── urlManager.js              # URL parsing and slug matching
│   ├── scene.js, camera.js, renderer.js, etc.
│   └── selectionManager.js        # 🔴 Legacy catalogue logic (deprecated)
├── utils/
│   └── slugGenerator.js           # Generates SEO slugs from French product names
├── styles/
│   └── style.css
├── assets/
│   ├── models.json                # Product data with SEO slugs
│   ├── *.glb, *.hdr, *.jpeg       # 3D models and assets
```

---

## 📐 Dev Philosophy

> Clarity before complexity.  
> Build a tool that is SEO-friendly, scalable, and understandable even after weeks of inactivity.  
> Prioritize ease of use, readability, and maintainability.

---

## ✅ Best Practices

- Use French product slugs for URL paths
- No direct DOM manipulation
- Modularize logic only when necessary
- Avoid one-size-fits-all logic — product filters must be specific
- Keep `models.json` the single source of truth for product data

---

## 🚫 Anti-Patterns

- ❌ Catalogue UI (we use URL-based single-product routing)
- ❌ Hardcoded product logic in `main.js`
- ❌ Missing or duplicate slugs
- ❌ Over-abstraction that hides critical logic

---

## 🧪 Known Limitations

- No backend quote submission yet
- `main.js` still needs cleanup
- Admin dashboard for product URL/SEO management is not yet implemented

---

## 🛠 Current Priorities

1. Refactor `main.js` to remove catalogue logic and support SEO URLs
2. Update all product entries in `models.json` with slugs and `seo` metadata
3. Implement slug fallback for old `?product=` URLs
4. Validate all slugs for uniqueness and readability
5. Test product loading and quotation generation end-to-end

---

## 🔍 Local Testing

Use the following local URLs:
```
http://localhost:5173/produits/jarretiere-optique
http://localhost:5173/produits/accessoires/adaptateur-sc-lc
```

For iframe test:
```html
<iframe src="/produits/jarretiere-optique" width="100%" height="600"></iframe>
```

---

## 🇫🇷 SEO Strategy Summary

- URLs are in French, clean, and indexed
- Each product includes metadata for SEO (title, description, keywords)
- Category slugs are supported
- Backward compatibility with query parameters ensures smooth transition

