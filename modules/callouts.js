import * as THREE from 'three';
import scene from './scene.js';
import camera from './camera.js';
import renderer from './renderer.js';
import { toScreenPosition } from '../scripts/utils.js';

const callouts = document.getElementById('callouts');

function createCallouts(model) {
    // Example callout
    createCallout('Feature 1', { x: 1, y: 1, z: 1 });
}

function createCallout(text, position) {
    const callout = document.createElement('div');
    callout.className = 'callout';
    callout.innerText = text;
    callouts.appendChild(callout);

    const vector = new THREE.Vector3(position.x, position.y, position.z);
    const canvasPosition = toScreenPosition(vector, camera);

    callout.style.left = `${canvasPosition.x}px`;
    callout.style.top = `${canvasPosition.y}px`;
}

export { createCallouts };
