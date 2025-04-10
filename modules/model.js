import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import scene from './scene.js';
import camera from './camera.js';
import { updateControlsTarget } from './orbitControls.js';

const loader = new GLTFLoader();
let model;

function loadModel(url) {
    console.log(`Loading model from URL: ${url}`);

    loader.load(
        url,  // Load the selected model
        function (gltf) {
            if (model) {
                scene.remove(model);
            }
            model = gltf.scene;

            if (!model) {
                console.warn('Model is empty or undefined.');
                return;
            }

            // Compute the bounding box of the model
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Calculate the max dimension and scale the model to fit within the viewer frame
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = maxDim > 0 ? 2 / maxDim : 1;  // Adjust the scale factor as needed
            model.scale.set(scale, scale, scale);

            // Recompute the bounding box after scaling
            box.setFromObject(model);
            box.getCenter(center);
            box.getSize(size);

            // Center the model
            model.position.set(-center.x, -center.y, -center.z);

            // Set initial orientation
            model.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0));

            scene.add(model);
            console.log('Model added to scene:', model);
            
            // Update camera to focus on the model
            updateCameraForModel(box);
            
            // Update orbit controls target to the center of the model
            updateControlsTarget();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading GLB:', error);
        }
    );
}

function updateCameraForModel(box) {
    // Calculate the size of the bounding box
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // Calculate the distance needed to view the entire model
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 2;
    
    // Position the camera to view the entire model
    camera.position.set(0, 0, distance);
    camera.lookAt(center);
    
    // Update the camera's near and far planes
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
}

export { model, loadModel };
