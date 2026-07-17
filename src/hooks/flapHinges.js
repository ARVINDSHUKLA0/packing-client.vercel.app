import * as THREE from "three";

/*
  FLAP HINGE CONFIG (full-unfold version, fixed nesting bug)
  --------------------------------------------------------------
  "Front" panel fixed/anchor hai (kabhi rotate nahi hota). Baaki sab
  isi ke reference se khulte hain:

    left  -> Front ke left edge se hinge
    right -> Front ke right edge se hinge
    back  -> "right" ke far edge se hinge (nested/chained parent: right)
    top   -> Front ke upar wale edge se hinge
    lock  -> Front ke neeche wale edge se hinge

  PEHLE BUG: jab "back" ko "right" ke andar nest kiya jata tha, hinge
  point world-space coordinates mein calculate hokar seedha nested
  pivot ki LOCAL position bana diya jata tha — jiski wajah se position
  do baar add ho jaati thi aur "back" panel dur bhaag jaata tha, aur
  iski wajah se camera bhi zyada zoom-out hokar "left" panel choti/gayab
  dikhti thi.

  FIX: ab THREE.Object3D.attach() use kiya hai, jo reparent karte waqt
  object ki WORLD position automatically preserve karta hai — chahe
  kitni bhi nesting ho, position kabhi galat calculate nahi hoga.
*/
export const FLAP_HINGES = [
  { meshName: "top", hingeEdge: "z-min", axis: "x", openDeg: -100, closeDeg: 0 },
  { meshName: "lock", hingeEdge: "z-min", axis: "x", openDeg: 100, closeDeg: 0 },
  { meshName: "right", hingeEdge: "z-min", axis: "y", openDeg: 90, closeDeg: 0 },
  { meshName: "left", hingeEdge: "z-min", axis: "y", openDeg: -90, closeDeg: 0 },
  { meshName: "back", hingeEdge: "x-max", axis: "y", openDeg: 90, closeDeg: 0, parent: "right" },
];

const pivotCache = new WeakMap();

function computeHingePoint(bbox, hingeEdge) {
  const cx = (bbox.min.x + bbox.max.x) / 2;
  const cy = (bbox.min.y + bbox.max.y) / 2;
  const cz = (bbox.min.z + bbox.max.z) / 2;

  switch (hingeEdge) {
    case "x-min":
      return new THREE.Vector3(bbox.min.x, cy, cz);
    case "x-max":
      return new THREE.Vector3(bbox.max.x, cy, cz);
    case "y-min":
      return new THREE.Vector3(cx, bbox.min.y, cz);
    case "y-max":
      return new THREE.Vector3(cx, bbox.max.y, cz);
    case "z-min":
      return new THREE.Vector3(cx, cy, bbox.min.z);
    case "z-max":
    default:
      return new THREE.Vector3(cx, cy, bbox.max.z);
  }
}

export function setupFlapPivots(scene) {
  if (!scene) return null;
  if (pivotCache.has(scene)) return pivotCache.get(scene);

  scene.updateMatrixWorld(true);

  const pivots = {};
  const originalParents = {};

  FLAP_HINGES.forEach(({ meshName, hingeEdge, parent }) => {
    const node = scene.getObjectByName(meshName);
    if (!node || !node.geometry) return;

    // asli parent yaad rakho reparent karne se pehle
    originalParents[meshName] = node.parent;

    node.geometry.computeBoundingBox();
    const bbox = node.geometry.boundingBox;
    const localHinge = computeHingePoint(bbox, hingeEdge);
    node.updateMatrixWorld(true);
    const worldHinge = localHinge.clone().applyMatrix4(node.matrixWorld);

    // pivot ko world space mein exact hinge point par banao — pehle scene
    // root mein add karke world position set karte hain, taaki koi galat
    // nesting offset na aaye.
    const pivot = new THREE.Group();
    pivot.name = `__pivot_${meshName}`;
    scene.add(pivot);
    pivot.position.copy(worldHinge);
    pivot.updateMatrixWorld(true);

    // node ko pivot ke andar move karo — attach() world position ko
    // automatically preserve karta hai, isliye manual math ki zaroorat nahi.
    pivot.attach(node);

    pivots[meshName] = pivot;
  });

  // Ab agar kisi entry ka "parent" specify kiya gaya hai (chained hinge),
  // to uske pivot ko us doosre pivot ke andar reparent karo — attach()
  // yahan bhi world position ko sahi preserve karega.
  FLAP_HINGES.forEach(({ meshName, parent }) => {
    if (!parent) return;
    const myPivot = pivots[meshName];
    const parentPivot = pivots[parent];
    if (myPivot && parentPivot) {
      parentPivot.attach(myPivot);
    }
  });

  pivotCache.set(scene, pivots);
  return pivots;
}

export function applyFlapRotation(scene, openAmount) {
  if (!scene) return;
  const pivots = setupFlapPivots(scene);
  if (!pivots) return;

  const t = Math.min(100, Math.max(0, openAmount)) / 100; // 0..1

  FLAP_HINGES.forEach(({ meshName, axis, openDeg, closeDeg }) => {
    const pivot = pivots[meshName];
    if (!pivot) return;

    const angleDeg = closeDeg + (openDeg - closeDeg) * t;
    pivot.rotation[axis] = (angleDeg * Math.PI) / 180;
  });
}

































