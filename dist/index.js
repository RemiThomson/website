//
let scene, camera, renderer;

function init() {
  // Set up the scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5; // Move the camera back to see the model

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('modelCanvas'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // Load the GLB model using GLTFLoader
  const loader = new THREE.GLTFLoader();
  loader.load('/earth_cartoon2.glb', function(gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      model.rotation.y += 0.01; // Rotate the model for effect
      renderer.render(scene, camera);
    }
    animate();
  }, undefined, function(error) {
    console.error(error);
  });
}

// Initialize the 3D scene
init();




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
