// Crée des personnages stylisés (humains et créatures) dans la scène Three.js

// Tableau des personnages pour animation
const characters = [];

// Humain stylisé (Eren)
function createHuman(x, z, color="#b3cbe6") {
  const group = new THREE.Group();
  // Corps
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.7, 18),
    new THREE.MeshStandardMaterial({color, roughness:0.4})
  );
  body.position.y = 0.35;
  group.add(body);

  // Tête
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18,18,14),
    new THREE.MeshStandardMaterial({color: "#f3e2cf"})
  );
  head.position.y = 0.75;
  group.add(head);

  // Bras animables
  const leftArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05,0.06,0.4,12),
    new THREE.MeshStandardMaterial({color: "#b3cbe6"})
  );
  leftArm.position.set(-0.19,0.52,0);
  leftArm.rotation.z = Math.PI/6;
  group.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.x = 0.19;
  rightArm.rotation.z = -Math.PI/6;
  group.add(rightArm);

  // Jambes
  const leftLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07,0.08,0.38,10),
    new THREE.MeshStandardMaterial({color: "#545b76"})
  );
  leftLeg.position.set(-0.08,0.1,0);
  group.add(leftLeg);

  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.08;
  group.add(rightLeg);

  group.position.set(x,0,z);
  return group;
}

// Vieil homme stylisé
function createOldMan(x, z) {
  const group = createHuman(x, z, "#b5a37a");
  group.children[1].material.color.set("#e8dec4"); // tête plus pâle
  // Barbe
  const beard = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 10, 7, 0, Math.PI),
    new THREE.MeshStandardMaterial({color: "#f7f7f7"})
  );
  beard.position.y = 0.65;
  beard.position.z = 0.13;
  group.add(beard);
  return group;
}

// Créature magique (inspirée oiseau/dragon)
function createCreature(x, z) {
  const group = new THREE.Group();
  // Corps
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 18, 16),
    new THREE.MeshStandardMaterial({color: "#60d4f7", roughness:0.3, emissive:0x14e2ff, emissiveIntensity:0.15})
  );
  body.position.y = 0.45;
  group.add(body);

  // Ailes
  const wingGeo = new THREE.BoxGeometry(0.42, 0.08, 0.13);
  const wingMat = new THREE.MeshStandardMaterial({color: "#9eeefc", emissive:0x14e2ff, emissiveIntensity:0.22});
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.set(-0.23,0.48,0);
  leftWing.rotation.z = Math.PI/7;
  group.add(leftWing);

  const rightWing = leftWing.clone();
  rightWing.position.x = 0.23;
  rightWing.rotation.z = -Math.PI/7;
  group.add(rightWing);

  // Tête
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.11,12,10),
    new THREE.MeshStandardMaterial({color: "#e4fdff"})
  );
  head.position.y = 0.66;
  group.add(head);

  // Queue
  const tail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03,0.01,0.25,8),
    new THREE.MeshStandardMaterial({color: "#9eeefc"})
  );
  tail.position.set(0,0.34,-0.19);
  tail.rotation.x = -Math.PI/3;
  group.add(tail);

  group.position.set(x,0.15,z);
  return group;
}

// Ajoute les personnages à la scène
window.addCharacters = (scene) => {
  // Eren (joueur)
  const eren = createHuman(-0.5, 1.1, "#7ebae6");
  scene.add(eren);
  eren.name = "Eren";
  window.eren = eren;
  eren.target = eren.position.clone();
  eren.animateTo = (vec3) => { eren.target = vec3.clone(); };

  // Vieil homme près du pont
  const oldMan = createOldMan(-1.3, 0.7);
  scene.add(oldMan);

  // Créature magique bleue
  const creature1 = createCreature(0.7, 1.8);
  scene.add(creature1);

  // Autre créature, plus petite
  const creature2 = createCreature(-1.1, 2.1);
  creature2.scale.set(0.7,0.7,0.7);
  scene.add(creature2);

  // Ajoute à la liste des persos animés
  characters.push(
    {obj: eren, type: "human"},
    {obj: oldMan, type: "oldman"},
    {obj: creature: creature1, type:"creature"},
    {obj: creature: creature2, type:"creature"}
  );
};

// Animation des personnages
window.animateCharacters = () => {
  // Animation du joueur (Eren) vers sa cible
  if (window.eren) {
    const e = window.eren;
    const pos = e.position;
    if (e.target && pos.distanceTo(e.target) > 0.05) {
      pos.lerp(e.target, 0.03);
      // Animation de marche simple (bras/jambes balancent)
      const t = Date.now()*0.004;
      e.children[2].rotation.x = Math.sin(t)*0.5; // bras gauche
      e.children[3].rotation.x = -Math.sin(t)*0.5; // bras droit
      e.children[4].rotation.x = -Math.sin(t)*0.3; // jambe gauche
      e.children[5].rotation.x = Math.sin(t)*0.3; // jambe droite
    }
  }
  // Animation des créatures (battement d'ailes, flottement)
  for (let c of characters) {
    if (c.type === "creature" && c.obj) {
      const t = Date.now()*0.006;
      // Ailes (children 1 et 2)
      c.obj.children[1].rotation.z = Math.PI/7 + Math.sin(t)*0.6;
      c.obj.children[2].rotation.z = -Math.PI/7 - Math.sin(t)*0.6;
      // Flottement
      c.obj.position.y = 0.15 + Math.sin(t*2)*0.07;
    }
  }
};
