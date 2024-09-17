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

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create a group to hold the keyboard and monitor
const mainGroup = new THREE.Group();

// Create a group to hold the keyboard parts
const keyboardGroup = new THREE.Group();

// Create the main body of the keyboard (a large flat rectangle)
const bodyGeometry = new THREE.BoxGeometry(12, 0.5, 6); // Large flat rectangular box
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.5 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
keyboardGroup.add(body); // Add body to the group

function createKey(x, y, z, keyLabel) {
  const keyGeometry = new THREE.BoxGeometry(1, 0.3, 1); // Dimensions of each key
  const keyMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.6, metalness: 0.4 });
  const key = new THREE.Mesh(keyGeometry, keyMaterial);
  key.position.set(x, y, z);

  // Create a simple text label using a plane
  const labelGeometry = new THREE.PlaneGeometry(0.8, 0.2); // Dimensions of label
  const labelMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const label = new THREE.Mesh(labelGeometry, labelMaterial);

  // Simple text representation: use texture or plain color
  const textCanvas = document.createElement('canvas');
  const context = textCanvas.getContext('2d');
  textCanvas.width = 128;
  textCanvas.height = 32;
  context.fillStyle = 'white';
  context.font = '20px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(keyLabel, textCanvas.width / 2, textCanvas.height / 2);
  const texture = new THREE.CanvasTexture(textCanvas);
  labelMaterial.map = texture;

  // Position the label correctly on top of the key
  label.position.set(0, 0.2, 0); // Adjust position based on key height
  label.rotation.x = -Math.PI / 2; // Rotate so the text is upright

  // Add the label to the key
  key.add(label);

  return key;
}

// Create a grid of keys (4 rows and 10 columns)
const rows = 4;
const cols = 10;
const keySpacing = 1.2; // Spacing between keys
const startX = -cols * keySpacing / 2 + keySpacing / 2;
const startZ = -rows * keySpacing / 2 + keySpacing / 2;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const x = startX + col * keySpacing;
    const z = startZ + row * keySpacing;
    const keyLabel = String.fromCharCode(65 + (row * cols + col) % 26); // A-Z
    const key = createKey(x, 0.5, z, keyLabel);
    keyboardGroup.add(key);
  }
}

// Add the keyboard group to the main group
mainGroup.add(keyboardGroup);

// Create the monitor
const monitorGroup = new THREE.Group();

// Create the monitor body (back part)
const monitorBackGeometry = new THREE.BoxGeometry(9, 8, 1); // Large box for the back
const monitorBackMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.5 });
const monitorBack = new THREE.Mesh(monitorBackGeometry, monitorBackMaterial);
monitorBack.position.set(0, 4, -6); // Position behind the keyboard
monitorGroup.add(monitorBack);

// Create the monitor screen (front panel)
const monitorScreenGeometry = new THREE.BoxGeometry(8, 6, 0.2); // Thin box for the screen
const monitorScreenMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black screen
const monitorScreen = new THREE.Mesh(monitorScreenGeometry, monitorScreenMaterial);
monitorScreen.position.set(0, 4.5, -5.5); // Position in front of the monitor body
monitorGroup.add(monitorScreen);

// Create dials for the monitor
function createDial(x, y, z) {
  const dialGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32); // Small cylinder for the dial
  const dialMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.8, metalness: 0.5 });
  const dial = new THREE.Mesh(dialGeometry, dialMaterial);
  dial.rotation.x = Math.PI / 2; // Rotate to stand upright
  dial.position.set(x, y, z);
  return dial;
}

// Add dials to the bottom of the monitor
const dialPositions = [
  [-2.5, 1, -5.5], // Left dial
  [2.5, 1, -5.5],   // Right dial
  [2.0, 1, -5.5]
];

dialPositions.forEach(position => {
  const dial = createDial(...position);
  monitorGroup.add(dial);
});

// Add the monitor group to the main group
mainGroup.add(monitorGroup);

// Add the entire group to the scene
scene.add(mainGroup);

// Animation loop to rotate the keyboard and monitor in all directions
function animate() {
  requestAnimationFrame(animate);
  mainGroup.rotation.y += 0.01; // Rotate along the Y-axis

  renderer.render(scene, camera);
}
animate();

// Add ambient and directional light for better visibility
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Strong directional light
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Set the camera position
camera.position.z = 18;
camera.position.y = 11;
camera.lookAt(new THREE.Vector3(-9, 0, 0));

// Adjust camera and renderer size on window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
