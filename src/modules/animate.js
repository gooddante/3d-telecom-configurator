/**
 * Animation Loop Module
 */

import { updateControls } from '@modules/orbitControls.js';
import { updateAnimations } from '@modules/model.js';

let animationId = null;
let isAnimating = false;
let lastTime = 0;

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
    lastTime = performance.now();
    
    function animate() {
        if (!isAnimating) return;
        
        animationId = requestAnimationFrame(animate);
        
        // Calculate delta time
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        lastTime = currentTime;
        
        // Update animations
        updateAnimations(deltaTime);
        
        // Update controls and render
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
