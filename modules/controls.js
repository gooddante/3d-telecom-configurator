import * as THREE from 'three';
import scene from './scene.js';
import camera from './camera.js';

document.getElementById('bgColor').addEventListener('input', (event) => {
    scene.background = new THREE.Color(event.target.value);
});

document.getElementById('cameraZ').addEventListener('input', (event) => {
    camera.position.z = parseFloat(event.target.value);
});

export {};
