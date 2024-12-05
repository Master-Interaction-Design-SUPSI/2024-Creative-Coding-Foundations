// // 1. Import necessary modules (for rendering 3D, animations)

import * as THREE from 'three'; // Core library used for 3D
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js'; // Smooth transition animations
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'; // library for slider

// // 2. Scene set-up and renderer

// Initialize scene, camera, renderer
const scene = new THREE.Scene(); // Main container
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera( // Set the camera field of view
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.z = 1200;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight); // Renders through API

// Append the renderer's canvas element to the document
document.body.appendChild(renderer.domElement);

// Responsive canvas
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

// // 3. Camera Controls

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1; // Smoother damping
controls.zoomSpeed = 0.5; // Slower zoom speed for smoother zooming
controls.rotateSpeed = 0.5; // Adjust rotation speed
controls.panSpeed = 0.5; // Adjust pan speed
controls.minDistance = 200;
controls.maxDistance = 5000;

// // 4. Lights & Environment

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// // 5. Load assets
let font;
const fontLoader = new FontLoader();
fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  (loadedFont) => {
    font = loadedFont;
    loadData();
  },
  undefined,
  (error) => {
    console.error('Error loading font:', error);
  }
);

// Tooltip for displaying book details
const tooltip = document.getElementById('tooltip');

// Global variables
let wordsData = []; // subjects array
let wordGroup; // 3D meshes group (words)
let timelineData = { startYear: 1800, endYear: 2023 };

// Load data from Gutendex
async function loadData() {
  try {
    let allBooks = [];
    let nextPage = 'https://gutendex.com/books/';
    let pageCount = 0;
    while (nextPage && pageCount < 3) { // Loading time! 
      const response = await fetch(nextPage);
      const data = await response.json();
      allBooks = allBooks.concat(data.results);
      nextPage = data.next;
      pageCount++;
    }

    // Process subjects and frequencies
    const wordMap = new Map(); // Object that stores key-value pairs
    allBooks.forEach((book) => {
      const subjects = book.subjects;
      subjects.forEach((subject) => {
        const words = subject.split(' '); // split into words
        words.forEach((word) => {
          word = word.replace(/[^a-zA-Z]/g, '').toLowerCase(); // so "art" and "Art" are the same
          if (word) {
            if (!wordMap.has(word)) { // does the word already exist on the map?
              wordMap.set(word, { count: 0, books: [] });
            }
            wordMap.get(word).count += 1;
            wordMap.get(word).books.push(book);
          }
        });
      });
    });
// wordMap converts to wordsData
    wordsData = Array.from(wordMap.entries()).map(([text, data]) => ({
      text,
      frequency: data.count,
      books: data.books,
    }));

    createWordCloud();
    createTimeline();
    addAmbientAudio();
    addBackgroundVisuals();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// // 6. Word Cloud

// Creating the word cloud
function createWordCloud() {
  wordGroup = new THREE.Group();

  wordsData.forEach((wordData, index) => {
    const wordMesh = createWordMesh(wordData);
    positionOnSphere(wordMesh, index, wordsData.length);
    wordGroup.add(wordMesh);
  });

  scene.add(wordGroup);
}

// Creating a 3D object for the text / word mesh
function createWordMesh(wordData) {
  const size = Math.log(wordData.frequency + 1) * 8; // log ensures a more even distribution of the sizes, multiplied by 8 so everything is visible
  const geometry = new TextGeometry(wordData.text, {
    font,
    size: size,
    depth: 1, // because 3D
  });
  geometry.computeBoundingBox();
  geometry.center();

  const color = new THREE.Color(0xffffff); // Colour of the text
  const material = new THREE.MeshBasicMaterial({ color, transparent: false });
  const mesh = new THREE.Mesh(geometry, material);


  // Add invisible sphere around the words (for optimised interaction, was very hard to click before)
  const paddingFactor = 2;
  const sphereGeometry = new THREE.SphereGeometry(size * paddingFactor, 8, 8);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    opacity: 0,
    transparent: true,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); // New mesh object
  sphere.name = 'interactionSphere';
  mesh.add(sphere); // Make sphere child of word mesh

  mesh.userData = { wordData };
  return mesh;
}

// Position words on the surface of a sphere
function positionOnSphere(mesh, index, total) {
  const radius = 800; // Distance from sphere circle
  const phi = Math.acos(-1 + (2 * index) / total); // Distributes words from bottom to top of sphere
  const theta = Math.sqrt(total * Math.PI) * phi; // Longitude distribution

  mesh.position.setFromSphericalCoords(radius, phi, theta); // Position mesh using spheric coordinates
}

// // 7. Interactivity 

// Raycaster for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', onClick, false);

// Detect clicks on words (determines mouse position in space)
function onClick(event) {
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera); // ray from camera's perspective

  // Check for intersections with the interaction spheres
  const intersects = raycaster.intersectObjects(
    wordGroup?.children.map((mesh) => mesh.getObjectByName('interactionSphere')),
    true
  );

  if (intersects.length > 0) {
    const sphere = intersects[0].object; // The object it intersected
    const mesh = sphere.parent;
    if (mesh.userData && mesh.userData.wordData) {
      showPlanetaryPanel(mesh.userData.wordData, mesh.position); // Show planetary panel
      centerViewOnObject(mesh); // Adjusts camera to center on the word
      playTwinkleSound();
    }
  }
}

// Function to smoothly center the view on a given object
function centerViewOnObject(object) {
  // Calculate the offset needed to center the object
  const targetPosition = new THREE.Vector3();
  targetPosition.copy(object.position);

  // Tween.js add-on for smooth transition
  new TWEEN.Tween(controls.target)
    .to(
      {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
      },
      1000 // Time in ms
    )
    .easing(TWEEN.Easing.Cubic.Out)
    .start();
}

// Show planetary panel for a word
function showPlanetaryPanel(wordData, position) {
  // Remove previous planets if any
  const existingPlanets = scene.getObjectByName('planetGroup');
  if (existingPlanets) {
    scene.remove(existingPlanets);
  }

  // Create new planet group (like a container for 3D objects)
  const planetGroup = new THREE.Group();
  planetGroup.name = 'planetGroup';

  const books = wordData.books.filter((book) => { // filter books by
    const author = book.authors[0]; // has author
    const deathYear = author ? author.death_year : null;
    const birthYear = author ? author.birth_year : null;
    const year = deathYear || birthYear || 1900; // default for unavailable
    return year >= timelineData.startYear && year <= timelineData.endYear; // filtering condition in order to position it on the timeline
  });

  books.forEach((book, index) => {
    const planet = createPlanetMesh(book); // will transform book object in a planet mesh
    positionPlanet(planet, index, books.length, position); // spaces out the planets properly
    planetGroup.add(planet); // add to group opened earlier
  });

  scene.add(planetGroup); // add to scene
}

// // 8. Planet creation and interaction (each planet represents one book)

// Create a planet mesh for a book
function createPlanetMesh(book) {
  const geometry = new THREE.SphereGeometry(20, 32, 32); // bit smoother
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
  }); // should add some badass colours
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { book };
  return mesh;
}

// Position planets in orbit around the word at its current position
function positionPlanet(planet, index, total, centerPosition) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 150;
  planet.position.set(
    centerPosition.x + Math.cos(angle) * radius,
    centerPosition.y + Math.sin(angle) * radius,
    centerPosition.z
  );
}

// Planet interaction
renderer.domElement.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera); // another ray looking for intersections

  const planetGroup = scene.getObjectByName('planetGroup');
  if (!planetGroup) return;

  const intersects = raycaster.intersectObjects(planetGroup.children, true);

  if (intersects.length > 0) { // ray intersected, mouse is hovering over
    const mesh = intersects[0].object; // retrieves planet
    if (mesh.userData && mesh.userData.book) {
      showTooltip(event.clientX, event.clientY, mesh.userData.book); // display info
    } else {
      hideTooltip();
    }
  } else {
    hideTooltip();
  }
}

// // 9. Tooltip (overlay) & slider GUI

function showTooltip(x, y, book) {
  const authors =
    Array.isArray(book.authors) && book.authors.length > 0 // checks array for authors
      ? book.authors.map((a) => a.name).join(', ')
      : 'Unknown'; // no authors

  const author = book.authors[0]; // extract more info
  const deathYear = author ? author.death_year : null;
  const birthYear = author ? author.birth_year : null;
  const year = deathYear || birthYear || 'Unknown'; // no info

  // Overlay position & contents
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
  tooltip.style.display = 'block';
  tooltip.innerHTML = `
    <strong>Title:</strong> ${book.title}<br>
    <strong>Author:</strong> ${authors}<br>
    <strong>Year:</strong> ${year}<br>
    <strong>Subjects:</strong> ${book.subjects.join(', ')}<br>
    <strong>Languages:</strong> ${book.languages.join(', ')}<br>
    <strong>Download Count:</strong> ${book.download_count}
  `;
}

function hideTooltip() {
  tooltip.style.display = 'none';
}

// Interactive timeline
function createTimeline() {
  const gui = new GUI({ // dat.GUI library
    container: document.getElementById('gui-container'),
    width: 300,
  });
  gui
    .add(timelineData, 'startYear', 1800, 2023, 1) // Add slider to adjust year
    .name('Start Year')
    .onChange(updateTimeline);
  gui
    .add(timelineData, 'endYear', 1800, 2023, 1)
    .name('End Year')
    .onChange(updateTimeline);
}

function updateTimeline() {
  // StartYear must be < or = to endYear
  if (timelineData.startYear > timelineData.endYear) {
    [timelineData.startYear, timelineData.endYear] = [
      timelineData.endYear,
      timelineData.startYear,
    ];
  }

  // Update subject words based on the selected year range
  wordGroup.children.forEach((mesh) => {
    const books = mesh.userData.wordData.books;
    const relevantBooks = books.filter((book) => {
      const author = book.authors[0];
      const deathYear = author ? author.death_year : null;
      const birthYear = author ? author.birth_year : null;
      const year = deathYear || birthYear || 1900; // default uses death year
      return year >= timelineData.startYear && year <= timelineData.endYear;
    });
    mesh.visible = relevantBooks.length > 0;
  });

  // Update planetary panel if open
  const planetGroup = scene.getObjectByName('planetGroup');
  if (planetGroup) {
    const wordMesh = planetGroup.children[0]; // currently selected word
    showPlanetaryPanel(wordMesh.userData.wordData, wordMesh.position);
  }
}

// // 10. Sounds & backgrounds

// Ambient audio (relative to camera position)
function addAmbientAudio() {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const audioLoader = new THREE.AudioLoader();
  const ambientSound = new THREE.Audio(listener);

  audioLoader.load(
    'assets/ambient.mp3',
    (buffer) => {
      ambientSound.setBuffer(buffer);
      ambientSound.setLoop(true);
      ambientSound.setVolume(0.5);
      ambientSound.play();
    },
    undefined,
    (error) => {
      console.error('Error loading ambient audio:', error);
    }
  );
}

// Play twinkle sound
function playTwinkleSound() {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const audioLoader = new THREE.AudioLoader();
  const sound = new THREE.Audio(listener);

  audioLoader.load(
    'assets/twinkle.mp3',
    (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(1);
      sound.play();
    },
    undefined,
    (error) => {
      console.error('Error loading twinkle sound:', error);
    }
  );
}

// Background
function addBackgroundVisuals() {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    'assets/nebula.jpg',
    (texture) => {
      scene.background = texture;
    },
    undefined,
    (error) => {
      console.error('Error loading background texture:', error);
    }
  );
}

// Animation loop
function animate(time) {
  requestAnimationFrame(animate);
  controls.update(); // Update camera controls

  // Update TWEEN animations
  TWEEN.update(time);
  if (!wordGroup) return;
  wordGroup.children.forEach((mesh) => {
    mesh.lookAt(camera.position); // Words always face the camera
  });

  // Rotate planets (if any)
  const planetGroup = scene.getObjectByName('planetGroup');
  if (planetGroup) {
    planetGroup.children.forEach((child) => {
      if (!child.userData.wordData) {
        child.rotation.y += 0.01;
      }
    });
  }

  renderer.render(scene, camera);
}

animate();

