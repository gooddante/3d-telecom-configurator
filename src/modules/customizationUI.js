// customizationUI.js
// Dynamically builds dropdowns for product customization

export function buildCustomizationUI(product, onChange, containerId = 'customization-container') {
  if (!product.customization || !product.customization.enabled) return;
  const parameters = product.customization.parameters;
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  Object.entries(parameters).forEach(([paramId, param]) => {
    const label = document.createElement('label');
    label.textContent = param.label || paramId;
    label.htmlFor = `customization-${paramId}`;

    const select = document.createElement('select');
    select.id = `customization-${paramId}`;
    select.name = paramId;
    param.options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.value === param.default) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener('change', e => {
      onChange(paramId, e.target.value);
    });

    container.appendChild(label);
    container.appendChild(select);
    container.appendChild(document.createElement('br'));
  });
} 