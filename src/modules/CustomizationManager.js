// CustomizationManager.js
// Manages mesh visibility for product customization in 3D viewer

export class CustomizationManager {
  constructor(model, product) {
    this.model = model;
    this.product = product;
    this.parameters = (product.customization && product.customization.parameters) || {};
  }

  updateParameter(parameterId, value) {
    const param = this.parameters[parameterId];
    if (!param || !param.visibility_rules) return;
    const rules = param.visibility_rules[value];
    if (!rules) return;

    // Hide meshes
    if (rules.hide) {
      rules.hide.forEach(meshName => {
        const mesh = this.model.getObjectByName(meshName);
        if (mesh) mesh.visible = false;
      });
    }
    // Show meshes
    if (rules.show) {
      rules.show.forEach(meshName => {
        const mesh = this.model.getObjectByName(meshName);
        if (mesh) mesh.visible = true;
      });
    }
  }
} 