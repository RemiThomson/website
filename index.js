// Basic setup for rotating the pentagon and updating content

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
    'Contact Information and Socials', 
    'Skills and Technology', 
    'Projects Showcase', 
    'About Me'
  ];
  const currentFace = document.getElementById('current-face');
  currentFace.innerText = faceTexts[currentFaceIndex];
  currentFace.classList.add('page-title-style'); // Ensure this class is applied
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
  if (event.key === 'ArrowRight') {
    rotatePentagon('right');
  } else if (event.key === 'ArrowLeft') {
    rotatePentagon('left');
  }
});
