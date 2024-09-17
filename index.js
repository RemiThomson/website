import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg') });

// Set renderer size and pixel ratio for better performance on high-DPI screens
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Load the GLB model using GLTFLoader
const loader = new GLTFLoader();
loader.load(
  '/earth_cartoon2.glb',  // Path to your .glb file
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('An error occurred loading the model: ', error);
  }
);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(ambientLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // You can rotate or animate your model here if needed
  scene.rotation.x += 0.01;
  scene.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Helper function to get the element by ID
function getById(id) {
  return document.getElementById(id);
}


// Function to update the content and face text based on the current face
function updateFaceContent(currentFaceIndex) {
  // Hide all content sections
  document.querySelectorAll('.content').forEach(content => {
    content.classList.add('hidden');
    content.classList.remove('visible');
  });

  // Show the content for the current face
  const faceId = `content-face${currentFaceIndex + 1}`;
  document.getElementById(faceId).classList.remove('hidden');
  document.getElementById(faceId).classList.add('visible');

  // Update the current face text
  const faceTexts = [
    'Welcome to my Online Portfolio', 
    '', 
    '', 
    '', 
    ''
  ];
  const currentFace = document.getElementById('current-face');
  currentFace.innerText = faceTexts[currentFaceIndex];
  currentFace.classList.add('page-title-style'); // Ensure this class is applied

  // Show or hide the title based on the current face index
  const titleElement = document.getElementById('page-title');
  if (currentFaceIndex === 0) {
    titleElement.style.display = 'block'; // Show title on page 1
  } else {
    titleElement.style.display = 'none'; // Hide title on other pages
  }
}

// Initialize the face index
let faceIndex = 0;
updateFaceContent(faceIndex);

// Function to rotate the pentagon
function rotatePentagon(direction) {
  // Update the face index based on the direction
  if (direction === 'left') {
    faceIndex = (faceIndex - 1 + 5) % 5; // Rotate left
  } else if (direction === 'right') {
    faceIndex = (faceIndex + 1) % 5; // Rotate right
  }

  // Update the content and text for the new face
  updateFaceContent(faceIndex);
}

// Event listener for keydown events to rotate the pentagon
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    rotatePentagon('right');
  } else if (event.key === 'ArrowRight') {
    rotatePentagon('left');
  }
});
