import renderer from '../modules/renderer.js';

function toScreenPosition(vector, camera) {
    if (!renderer || !renderer.domElement) {
        console.warn("Renderer not ready");
        return { x: 0, y: 0 };
    }

    const widthHalf = 0.5 * renderer.domElement.width;
    const heightHalf = 0.5 * renderer.domElement.height;

    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
}

export { toScreenPosition };
