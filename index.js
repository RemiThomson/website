// Three.js scene setup
let scene, camera, renderer;

function init() {
  // Create the scene
  scene = new THREE.Scene();
  
  // Set up the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Create the renderer and link it to the correct canvas
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('modelCanvas'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // Load the GLTF model
  const loader = new THREE.GLTFLoader();
  loader.load('dist/earth_cartoon2.glb', function(gltf) {
    const model = gltf.scene;
    scene.add(model);
  
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      model.rotation.y += 0.01; // Rotate the model
      renderer.render(scene, camera);
    }
    animate();
  }, undefined, function(error) {
    console.error(error);
  });
}

// Call the init function to start the Three.js scene
init();

// Content update function
function updateFaceContent(faceIndex) {
  document.querySelectorAll('.content').forEach(content => {
    content.classList.add('hidden');
    content.classList.remove('visible');
  });
  document.getElementById(`content-face${faceIndex + 1}`).classList.add('visible');

  const faceTexts = ['Welcome to my Online Portfolio', 'Contact Information', 'Projects Showcase', 'Skills and Technology', 'About Me'];
  document.getElementById('current-face').innerText = faceTexts[faceIndex];
}

// Face rotation logic
let faceIndex = 0;
updateFaceContent(faceIndex);

function rotatePentagon(direction) {
  if (direction === 'left') {
    faceIndex = (faceIndex - 1 + 5) % 5;
  } else {
    faceIndex = (faceIndex + 1) % 5;
  }
  updateFaceContent(faceIndex);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    rotatePentagon('left');
  } else if (event.key === 'ArrowRight') {
    rotatePentagon('right');
  }
});
