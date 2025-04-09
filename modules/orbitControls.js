import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import camera from './camera.js';
import renderer from './renderer.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);  // Set the target to the center of the scene
controls.update();

function updateControls() {
    controls.update();
}

export { updateControls };
