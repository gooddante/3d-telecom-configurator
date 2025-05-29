/**
 * Animation Loop Module
 */

import { updateControls } from '@modules/orbitControls.js';

let animationId = null;
let isAnimating = false;

/**
 * Start the animation loop
 * @param {THREE.Scene} scene - Three.js scene
 * @param {THREE.Camera} camera - Three.js camera
 * @param {THREE.WebGLRenderer} renderer - Three.js renderer
 * @param {OrbitControls} controls - Orbit controls instance
 */
export function startAnimation(scene, camera, renderer, controls) {
    if (isAnimating) {
        return;
    }
    
    isAnimating = true;
    
    function animate() {
        if (!isAnimating) return;
        
        animationId = requestAnimationFrame(animate);
        updateControls(controls);
        renderer.render(scene, camera);
    }
    
    animate();
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
}
