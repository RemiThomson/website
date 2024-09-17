import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 50);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(25, 25, 25);
scene.add(pointLight);

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(50, 50, 50);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 500;
sun.shadow.camera.left = -50;
sun.shadow.camera.right = 50;
sun.shadow.camera.top = 50;
sun.shadow.camera.bottom = -50;
sun.shadow.bias = -0.005;
scene.add(sun);

// Create a group to hold the globe and text planes
const group = new THREE.Group();
scene.add(group);

// Function to create a texture with text from HTML elements
function createTextTextureFromHTML(elementId) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const text = document.getElementById(elementId).innerText;
  context.fillStyle = '#ff0000';
  context.font = '30px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  return new THREE.CanvasTexture(canvas);
}

// Create planes with text textures for each face
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const materials = [
  new THREE.MeshStandardMaterial({ map: createTextTextureFromHTML('face1-text'), visible: false, side: THREE.DoubleSide }),
  new THREE.MeshStandardMaterial({ map: createTextTextureFromHTML('face2-text'), visible: false, side: THREE.DoubleSide }),
  new THREE.MeshStandardMaterial({ map: createTextTextureFromHTML('face3-text'), visible: false, side: THREE.DoubleSide }),
  new THREE.MeshStandardMaterial({ map: createTextTextureFromHTML('face4-text'), visible: false, side: THREE.DoubleSide }),
  new THREE.MeshStandardMaterial({ map: createTextTextureFromHTML('face5-text'), visible: false, side: THREE.DoubleSide })
];

// Position the planes in a pentagon formation
const radius = 20;
const angles = [0, Math.PI * 2 / 5, Math.PI * 4 / 5, Math.PI * 6 / 5, Math.PI * 8 / 5];

angles.forEach((angle, index) => {
  const plane = new THREE.Mesh(planeGeometry, materials[index]);
  plane.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
  plane.rotation.y = angle - Math.PI / 2;

  if (index === 0) {
    plane.rotation.x = Math.PI / 2;
  }

  group.add(plane);
});

// Initialize GLTFLoader
const loader = new GLTFLoader();
let model;

loader.load(
  '/earth_cartoon2.glb',
  (gltf) => {
    model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(0, 0, 0);
    group.add(model);
    model.rotation.y += Math.PI / 2;
    console.log('Model loaded successfully');
  },
  undefined,
  (error) => {
    console.error('An error happened while loading the model', error);
  }
);


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
