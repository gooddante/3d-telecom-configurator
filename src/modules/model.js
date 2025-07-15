import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { updateControlsTarget } from '@modules/orbitControls.js';

// Initialize loaders with Draco support
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

// Configure Draco decoder
dracoLoader.setDecoderPath('/3d-telecom-configurator/draco/'); // Path to the decoder files in public folder
dracoLoader.setDecoderConfig({ type: 'js' }); // Use JS fallback initially, will auto-detect WASM

// Set up Draco loader with GLTFLoader
loader.setDRACOLoader(dracoLoader);

let model;
let currentScene = null;
let mixer = null; // Animation mixer

console.log('✅ GLTF Loader initialized with Draco compression support');

// Create a default geometry for when models fail to load
function createDefaultModel(type = 'connector') {
    let geometry;
    let material;

    if (type === 'connector') {
        // Create a simple connector-like geometry
        geometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
        material = new THREE.MeshStandardMaterial({ 
            color: 0x4287f5,
            metalness: 0.5,
            roughness: 0.5
        });
    } else if (type === 'cable') {
        // Create a simple cable-like geometry
        geometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
        material = new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50,
            metalness: 0.3,
            roughness: 0.7
        });
    } else {
        // Default fallback
        geometry = new THREE.BoxGeometry(1, 1, 1);
        material = new THREE.MeshStandardMaterial({ 
            color: 0x808080,
            metalness: 0.5,
            roughness: 0.5
        });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    return mesh;
}

/**
 * Load a 3D model into the scene
 * @param {THREE.Scene} scene - Three.js scene to add the model to
 * @param {string} url - URL/path to the model file
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<THREE.Object3D>} Promise that resolves with the loaded model
 */
function loadModel(scene, url, onProgress) {
    console.log(`Loading model from URL: ${url}`);
    
    // Store scene reference
    currentScene = scene;
    
    return new Promise((resolve, reject) => {
        // Show loading state
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingProgress = document.getElementById('loading-progress');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }

        // Remove existing model if any
        if (model && currentScene) {
            currentScene.remove(model);
            // Clean up animation mixer
            if (mixer) {
                mixer.stopAllAction();
                mixer = null;
            }
            model.traverse((child) => {
                if (child.isMesh) {
                    if (child.material) {
                        child.material.dispose();
                    }
                    if (child.geometry) {
                        child.geometry.dispose();
                    }
                }
            });
            model = null;
        }

        // Try to load the model
        loader.load(
            url,
            function (gltf) {
                model = gltf.scene;

                if (!model) {
                    console.warn('Model is empty or undefined, trying fallback model');
                    tryFallbackModel(url, resolve);
                    return;
                }

                // Handle animations if they exist
                if (gltf.animations && gltf.animations.length > 0) {
                    console.log(`Found ${gltf.animations.length} animations in the model`);
                    mixer = new THREE.AnimationMixer(model);
                    
                    // Play all animations
                    gltf.animations.forEach((animation, index) => {
                        console.log(`Setting up animation: ${animation.name || `Animation ${index + 1}`}`);
                        const action = mixer.clipAction(animation);
                        action.setLoop(THREE.LoopOnce);
                        action.clampWhenFinished = true;
                        action.play();
                    });
                }

                // Enable shadows and optimize materials
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = false;
                        child.receiveShadow = false;
                        
                        // Ensure material is MeshStandardMaterial with optimized settings
                        if (!(child.material instanceof THREE.MeshStandardMaterial)) {
                            const color = child.material.color ? child.material.color.getHex() : 0x808080;
                            child.material = new THREE.MeshStandardMaterial({
                                color: color,
                                metalness: 0.3,
                                roughness: 0.7,
                                envMapIntensity: 1.0
                            });
                        }
                    }
                });

                // Compute the bounding box
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                // Volume-based scaling for consistent visual impact
                const volume = size.x * size.y * size.z;
                const targetVolume = 30; // Adjust this value to make objects bigger/smaller
                const scale = Math.pow(targetVolume / volume, 1/3);

                model.scale.set(scale, scale, scale);

                // Center the model
                model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

                // Set initial rotation
                model.rotation.set(0, 0, 0);

                // Add to scene
                currentScene.add(model);
                console.log('Model added to scene:', model);

                // Update camera and controls
                updateControlsTarget(new THREE.Vector3(0, 0, 0));

                // Hide loading overlay
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }

                resolve(model);
            },
            function (xhr) {
                if (onProgress && xhr.lengthComputable) {
                    const percentComplete = (xhr.loaded / xhr.total) * 100;
                    if (loadingProgress) {
                        loadingProgress.textContent = `Chargement... ${Math.round(percentComplete)}%`;
                    }
                    onProgress(percentComplete);
                }
            },
            function (error) {
                console.warn('Error loading model:', error);
                tryFallbackModel(url, resolve);
            }
        );
    });
}

function tryFallbackModel(originalUrl, resolve) {
    // Extract the model number from the original URL
    const modelNumber = originalUrl.match(/model(\d+)\.glb/);
    if (modelNumber) {
        // Try to load the model directly from the assets folder
        const modelPath = `/3d-telecom-configurator/assets/model${modelNumber[1]}.glb`;
        console.log('Trying to load model from:', modelPath);
        
        loader.load(
            modelPath,
            function (gltf) {
                handleSuccessfulLoad(gltf.scene, resolve);
            },
            undefined,
            function (error) {
                console.warn('Model failed to load:', error);
                createDefaultModelForUrl(originalUrl, resolve);
            }
        );
    } else {
        createDefaultModelForUrl(originalUrl, resolve);
    }
}

function createDefaultModelForUrl(url, resolve) {
    // Determine the type based on the URL or filename
    let type = 'default';
    if (url.includes('connector')) type = 'connector';
    else if (url.includes('cable')) type = 'cable';
    
    model = createDefaultModel(type);
    if (currentScene) {
        currentScene.add(model);
    }
    
    updateControlsTarget();
    
    resolve(model);
}

function handleSuccessfulLoad(loadedModel, resolve) {
    model = loadedModel;

    // Enable shadows and update materials
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            
            // Ensure material is MeshStandardMaterial
            if (!(child.material instanceof THREE.MeshStandardMaterial)) {
                child.material = new THREE.MeshStandardMaterial({
                    color: child.material.color || 0x808080,
                    metalness: 0.5,
                    roughness: 0.5
                });
            }
        }
    });

    // Compute the bounding box
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Scale the model
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 2 / maxDim : 1;
    model.scale.set(scale, scale, scale);

    // Recenter the model
    box.setFromObject(model);
    box.getCenter(center);
    model.position.set(-center.x, -center.y, -center.z);

    // Add to scene
    if (currentScene) {
        currentScene.add(model);
    }

    // Update controls
    updateControlsTarget(center);

    resolve(model);
}

export { model, loadModel };

/**
 * Cleanup function to dispose of Draco loader resources
 * Call this when the application is shutting down
 */
export function cleanup() {
    if (dracoLoader) {
        dracoLoader.dispose();
        console.log('🧹 Draco loader disposed');
    }
}

// Function to update animations (to be called in animation loop)
export function updateAnimations(deltaTime) {
    if (mixer) {
        mixer.update(deltaTime);
    }
}
