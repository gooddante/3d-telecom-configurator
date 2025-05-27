import { updateControls } from './orbitControls.js';

let animationId = null;
let isAnimating = false;

/**
 * Start the animation loop
 * @param {THREE.Scene} scene - Three.js scene
 * @param {THREE.Camera} camera - Three.js camera
 * @param {THREE.WebGLRenderer} renderer - Three.js renderer
 */
export function startAnimation(scene, camera, renderer) {
    if (isAnimating) {
        console.warn('Animation already running');
        return;
    }
    
    isAnimating = true;
    
    function animate() {
        if (!isAnimating) return;
        
        animationId = requestAnimationFrame(animate);
        updateControls();
        renderer.render(scene, camera);
    }
    
    animate();
    console.log('🎬 Animation loop started');
}

/**
 * Stop the animation loop
 */
export function stopAnimation() {
    isAnimating = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    console.log('⏹️ Animation loop stopped');
}
