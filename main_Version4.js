// --- Paramètres ---
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// --- Scène THREE.js ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181d23);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.3, 4);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("game-container").appendChild(renderer.domElement);

// Lumière
const light = new THREE.DirectionalLight(0xffffff, 1.1);
light.position.set(2, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x446088, 0.6));

// --- Chargement du décor (village) ---
const loader = new THREE.GLTFLoader();
loader.load(
  'assets/village.glb', // Place ton modèle ici (ou remplace par village.dae + ColladaLoader si besoin)
  function(gltf) {
    scene.add(gltf.scene);
    // Tu peux ajouter ici des animations d'intro, oiseaux, lanternes, etc.
  },
  undefined,
  function(error) {
    console.error('Erreur de chargement du décor :', error);
  }
);

// --- UI et histoire ---
const dialogues = [
  { text: "Eren se réveille au son d’un grondement dans le ciel...", delay: 1800 },
  { text: "Une lumière bleue tombe sur la Tour Ancienne au loin.", delay: 2000 },
  { text: "Le vieil homme murmure : « La Tour t’appelle… Va, mon enfant. »", delay: 3500 }
];
let dialogueStep = 0;

const dialogueBox = document.getElementById("dialogue");
const btnAction = document.getElementById("btn-action");

// Affiche le dialogue progressif
function showDialogue(step=0) {
  if (step >= dialogues.length) {
    btnAction.classList.remove("hidden");
    dialogueBox.classList.add("hidden");
    return;
  }
  dialogueBox.textContent = dialogues[step].text;
  dialogueBox.classList.remove("hidden");
  btnAction.classList.add("hidden");
  setTimeout(() => {
    showDialogue(step+1);
  }, dialogues[step].delay);
}
showDialogue();

// Bouton "Action" (pour mobile) : aller vers la Tour
btnAction.addEventListener("touchstart", (e) => {
  e.preventDefault();
  dialogueBox.classList.remove("hidden");
  dialogueBox.textContent = "Objectif : Se rendre à la Tour !";
  btnAction.classList.add("hidden");
  // Animation du personnage principal (Eren) vers la tour :
  if (window.eren) window.eren.animateTo(new THREE.Vector3(0,0, -6));
  setTimeout(() => { dialogueBox.classList.add("hidden"); }, 2500);
});

// --- Contrôles tactiles basiques (glisser pour tourner la caméra) ---
let lastTouch = null;
renderer.domElement.addEventListener("touchstart", e => {
  if (e.touches.length === 1) lastTouch = {x: e.touches[0].clientX, y: e.touches[0].clientY};
});
renderer.domElement.addEventListener("touchmove", e => {
  if (e.touches.length === 1 && lastTouch) {
    const dx = (e.touches[0].clientX - lastTouch.x) * 0.008;
    const dy = (e.touches[0].clientY - lastTouch.y) * 0.008;
    camera.rotation.y -= dx;
    camera.rotation.x -= dy;
    camera.rotation.x = Math.max(-1, Math.min(1, camera.rotation.x));
    lastTouch = {x: e.touches[0].clientX, y: e.touches[0].clientY};
  }
});
renderer.domElement.addEventListener("touchend", () => { lastTouch = null; });

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Ajout des personnages (dans characters.js) ---
window.addEventListener("DOMContentLoaded", () => {
  if (window.addCharacters) window.addCharacters(scene);
});

// --- Boucle d'animation ---
function animate() {
  requestAnimationFrame(animate);
  if (window.animateCharacters) window.animateCharacters();
  renderer.render(scene, camera);
}
animate();