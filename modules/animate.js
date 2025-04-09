import renderer from './renderer.js';
import scene from './scene.js';
import camera from './camera.js';
import { updateControls } from './orbitControls.js';

function animate() {
    requestAnimationFrame(animate);

    updateControls();  // Update OrbitControls

    renderer.render(scene, camera);
}

animate();
