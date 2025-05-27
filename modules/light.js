import * as THREE from 'three';

/**
 * Initialize and add lights to the scene
 * @param {THREE.Scene} scene - Three.js scene to add lights to
 * @returns {Object} Object containing all light references
 */
export function initializeLights(scene) {
    // Key Light (main light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = false;  // Disabled shadow casting
    scene.add(keyLight);

    // Fill Light (softer, no shadow)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.75);
    fillLight.position.set(-5, 5, 5);
    fillLight.castShadow = false;  // Disabled shadow casting
    scene.add(fillLight);

    // Back Light (rim light, no shadow)
    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(0, 5, -5);
    backLight.castShadow = false;  // Disabled shadow casting
    scene.add(backLight);

    // Softbox Geometry and Material
    const softboxGeometry = new THREE.PlaneGeometry(2, 2);
    const softboxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    // Key Light Softbox
    const keySoftbox = new THREE.Mesh(softboxGeometry, softboxMaterial);
    keySoftbox.position.copy(keyLight.position);
    keySoftbox.lookAt(0, 0, 0);
    keySoftbox.visible = false;  // Make the softbox invisible to the camera
    scene.add(keySoftbox);

    // Fill Light Softbox
    const fillSoftbox = new THREE.Mesh(softboxGeometry, softboxMaterial);
    fillSoftbox.position.copy(fillLight.position);
    fillSoftbox.lookAt(0, 0, 0);
    fillSoftbox.visible = false;  // Make the softbox invisible to the camera
    scene.add(fillSoftbox);

    // Back Light Softbox
    const backSoftbox = new THREE.Mesh(softboxGeometry, softboxMaterial);
    backSoftbox.position.copy(backLight.position);
    backSoftbox.lookAt(0, 0, 0);
    backSoftbox.visible = false;  // Make the softbox invisible to the camera
    scene.add(backSoftbox);

    console.log('Lights initialized and added to scene');

    return {
        keyLight,
        fillLight,
        backLight,
        keySoftbox,
        fillSoftbox,
        backSoftbox
    };
}

// Export individual lights for backward compatibility
export { initializeLights as default };
