import * as THREE from 'three';
import scene from './scene.js';

// Key Light
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);
keyLight.castShadow = true;
scene.add(keyLight);

// Fill Light
const fillLight = new THREE.DirectionalLight(0xffffff, 0.75);
fillLight.position.set(-5, 5, 5);
fillLight.castShadow = true;
scene.add(fillLight);

// Back Light
const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 5, -5);
backLight.castShadow = true;
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

export { keyLight, fillLight, backLight, keySoftbox, fillSoftbox, backSoftbox };
