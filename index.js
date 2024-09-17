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

// Initialize variables for smooth transitions
const currentLookAt = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const lookAtSpeed = 0.1;

const currentRotation = { value: 0 };
const targetRotation = { value: 0 };
const rotationIncrement = 2 * Math.PI / 5;
const rotationSpeed = 0.05;

// Initialize a time variable for smooth sun movement
let sunAngle = 0;
const sunOrbitRadius = 50; // Radius of the sun's orbit
const sunHeight = 50;      // Height of the sun in its orbit

// Function to rotate the group based on the direction
function rotateGroup(direction) {
  const newTargetRotation = direction === 'left'
    ? currentRotation.value - rotationIncrement
    : currentRotation.value + rotationIncrement;

  targetRotation.value = THREE.MathUtils.euclideanModulo(newTargetRotation, Math.PI * 2);
}

// Function to update the rotation smoothly
function updateRotation() {
  const diff = THREE.MathUtils.euclideanModulo(targetRotation.value - currentRotation.value, Math.PI * 2);
  const shortest = (diff > Math.PI) ? diff - Math.PI * 2 : diff;

  if (Math.abs(shortest) < rotationSpeed) {
    currentRotation.value = targetRotation.value;
  } else {
    currentRotation.value += (shortest > 0 ? rotationSpeed : -rotationSpeed);
  }

  currentRotation.value = THREE.MathUtils.euclideanModulo(currentRotation.value, Math.PI * 2);
}

// Handle keydown events
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    rotateGroup('left');
  } else if (event.key === 'ArrowLeft') {
    rotateGroup('right');
  }
});

// Function to update the face content and target lookAt position
function updateCurrentFaceContent() {
  const contents = document.querySelectorAll('.content');
  contents.forEach(content => {
    content.classList.add('hidden');
    content.classList.remove('visible');
  });

  const faceIndex = Math.floor((group.rotation.y + Math.PI / 2) / rotationIncrement) % 5;

  const faceIds = ['content-face1', 'content-face2', 'content-face3', 'content-face4', 'content-face5'];
  const currentContent = document.getElementById(faceIds[faceIndex]);
  if (currentContent) {
    currentContent.classList.remove('hidden');
    currentContent.classList.add('visible');
  }
}

// Function to update the face text and camera lookAt position
function updateCurrentFaceText() {
  const faceTexts = [
    'Welcome to my Online Portfolio',
    'Contact Information and Socials',
    'Skills and Technology',
    'Projects Showcase',
    'About Me'
  ];

  const faceIndex = Math.floor((group.rotation.y + Math.PI / 2) / rotationIncrement) % 5;

  document.getElementById('current-face').innerText = faceTexts[faceIndex];
  updateCurrentFaceContent();

  targetLookAt.set(faceIndex === 0 ? 0 : -20, 0, 10);

  const pageTitle = document.getElementById('page-title');
  if (faceIndex === 0) {
    pageTitle.style.display = 'block';
  } else {
    pageTitle.style.display = 'none';
  }

  if (model) {
    if (faceIndex === 0) {
      model.position.set(0, -5, 0);
    } else {
      model.position.set(0, 0, 0);
    }

    const scale = faceIndex === 0 ? 0.2 : 0.15;
    model.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  }
}
function showFace(faceId) {
  document.querySelectorAll('.content').forEach(face => {
    face.classList.add('hidden');
    face.classList.remove('visible');
  });
  
  document.getElementById(faceId).classList.add('visible');
  document.getElementById(faceId).classList.remove('hidden');
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    // Update group rotation
    updateRotation();
    group.rotation.y = -Math.PI / 2 + currentRotation.value;

    // Animate the sun's position in a circular orbit around the model
    sunAngle += 0.01;  // Speed of the sun's orbit
    sun.position.set(
      Math.cos(sunAngle) * sunOrbitRadius,  // x position
      sunHeight,  // y position (height)
      Math.sin(sunAngle) * sunOrbitRadius   // z position
    );
    sun.lookAt(model.position);  // Ensure the sun always points at the model

    // Smoothly transition the camera's "look at" position
    currentLookAt.lerp(targetLookAt, lookAtSpeed);
    camera.lookAt(currentLookAt);

    // Update face text and render the scene
    updateCurrentFaceText();
    renderer.render(scene, camera);
  }
}

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// Start the animation
animate();
