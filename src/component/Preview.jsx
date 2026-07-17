"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { applyFlapRotation } from "../hooks/flapHinges";
import BoxOpenSlider from "./BoxOpenSlider";

// ============================================================
// YAHI EK LINE SE BACKGROUND COLOR CONTROL HOTA HAI.
// Isko change karoge to hamesha yahi color fixed rahega —
// kabhi black kabhi white wala issue nahi aayega.
// ============================================================
const SCENE_BG_COLOR = "#f2f2f2"; // studio-style light gray, chaho to "#ffffff" kar do

const clean = (str) => (str ? str.toString().trim().toLowerCase() : "");

// Blender jab do objects ka naam same hota hai to automatically ".001", ".002"
// jaisa suffix laga deta hai. Kabhi kabhi "_1", "-2" jaise suffix bhi export
// tools se aate hain. Isse strip karke base naam nikalte hain taaki match fail na ho.
const stripSuffix = (str) => clean(str).replace(/[.\-_]\d+$/, "");

function findPanelForMesh(panels, meshName) {
  const meshClean = clean(meshName);
  let panel = panels?.find((p) => clean(p.id) === meshClean);
  if (panel) return panel;

  const meshBase = stripSuffix(meshName);
  panel = panels?.find((p) => stripSuffix(p.id) === meshBase);
  return panel || null;
}

/* ---------------------------------------------------------------- */
/* 1. BOX MODEL — texture mapping (working logic, untouched)        */
/* ---------------------------------------------------------------- */
function BoxModel({ glbUrl, exportedCanvas, panels, viewBox, groupRef, openAmount }) {
  const { scene } = useGLTF(glbUrl);

  // Open/Close slider se flap rotation drive karta hai.
  // Jab tak GLB mein flapHinges.js ke FLAP_HINGES array mein mesh names
  // register nahi honge, ye silently kuch nahi karega (box normal dikhega).
  useEffect(() => {
    if (!scene) return;
    applyFlapRotation(scene, openAmount);
  }, [scene, openAmount]);

  useEffect(() => {
    if (!scene) return;

    const fullW = exportedCanvas ? exportedCanvas.width : 1024;
    const fullH = exportedCanvas ? exportedCanvas.height : 1024;

    // Naam se pehchan lo ki ye hum khud se add kiya hua "andar wala plain"
    // mesh hai — traverse jab isko dubara visit kare to skip kar do, warna
    // har re-render pe recursively naye inside-mesh bante jayenge.
    const INSIDE_SUFFIX = "__inside_face";

    scene.traverse((node) => {
      if (!node.isMesh) return;
      if (node.name.endsWith(INSIDE_SUFFIX)) return; // apna hi banaya hua inside mesh, skip

      const existingMaterial = Array.isArray(node.material) ? node.material[0] : node.material;
      const material = existingMaterial ? existingMaterial.clone() : new THREE.MeshStandardMaterial();

      // GLB ka apna original color yahin pe capture kar lo (design apply karne
      // se PEHLE) — isi color ko aage andar wali (inside) face ke liye use
      // karenge, taaki wahan hamesha GLB ka asli grey/color dikhe, kabhi black nahi.
      const glbOriginalColor =
        existingMaterial && existingMaterial.color
          ? existingMaterial.color.clone()
          : new THREE.Color("#b5b5b5");

      if (material.map) material.map.dispose();

      const panel = findPanelForMesh(panels, node.name);

      if (panel && exportedCanvas) {
        const sx = (panel.x / viewBox.width) * fullW;
        const sy = (panel.y / viewBox.height) * fullH;
        const sw = (panel.width / viewBox.width) * fullW;
        const sh = (panel.height / viewBox.height) * fullH;

        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = Math.max(1, sw);
        cropCanvas.height = Math.max(1, sh);
        const ctx = cropCanvas.getContext("2d");

        // Panel ke peeche fallback fill — agar kahin transparent gap ho to
        // scene background jaisa hi color rahe, black patch kabhi na dikhe.
        ctx.fillStyle = SCENE_BG_COLOR;
        ctx.fillRect(0, 0, sw, sh);

        ctx.drawImage(exportedCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

        const texture = new THREE.CanvasTexture(cropCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;

        material.map = texture;
        material.color = new THREE.Color("#ffffff"); 
        material.roughness = 1.0;
        material.metalness = 0.0;
      } else {
        // Design abhi apply nahi hui (ya panel match nahi mila) — box ka woh
        // panel plain white rahega, GAYAB nahi hoga. Poora box hamesha visible.
        material.map = null;
        material.color = new THREE.Color("#ffffff"); 
        material.roughness = 1.0;
        material.metalness = 0.0;
      }

      // IMPORTANT: sirf FRONT (bahar wali) face pe hi design/texture render
      // hoga ab. DoubleSide hata diya — warna andar wali surface pe bhi
      // yehi image/text mirror hoke dikh jaata tha jab box khulta tha.
      material.side = THREE.FrontSide; 
      
      material.needsUpdate = true;
      node.material = material;

      // ---- ANDAR WALI (inside) FACE: hamesha plain white, kabhi bhi
      // image/text nahi — ek alag mesh jo sirf BackSide render karta hai ----
      let insideMesh = node.children.find(
        (c) => c.isMesh && c.name === node.name + INSIDE_SUFFIX
      );

      if (!insideMesh) {
        // MeshBasicMaterial = unlit/plain — lighting pe depend nahi karta,
        // isliye kabhi bhi black nahi dikhega, hamesha GLB ka apna original
        // color exactly wahi dikhega jaisa GLB mein hai.
        const insideMaterial = new THREE.MeshBasicMaterial({
          color: glbOriginalColor,
          side: THREE.BackSide,
        });
        insideMesh = new THREE.Mesh(node.geometry, insideMaterial);
        insideMesh.name = node.name + INSIDE_SUFFIX;
        // node ka hi child banaya, identity transform — isliye node jahan
        // bhi rotate/move ho (hinge/open-close), ye bhi exactly wahi follow karega.
        node.add(insideMesh);
      } else {
        // geometry kabhi badal jaye to sync rakho
        insideMesh.geometry = node.geometry;
        // color bhi hamesha GLB ke original color se sync rakho
        insideMesh.material.color.copy(glbOriginalColor);
      }
    });
  }, [scene, exportedCanvas, panels, viewBox]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ---------------------------------------------------------------- */
/* 2. CAMERA FIT — GLB chahe kitne bhi scale/units ka ho, camera    */
/*    automatically poore box ko frame karega. Yahi missing tha.    */
/* ---------------------------------------------------------------- */
function CameraFit({ targetRef }) {
  const { camera, controls, invalidate } = useThree();
  const fitted = useRef(false);

  useEffect(() => {
    fitted.current = false;
    const id = setInterval(() => {
      if (fitted.current || !targetRef.current) return;
      targetRef.current.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(targetRef.current);
      if (box.isEmpty()) return;

      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (!maxDim || !isFinite(maxDim)) return;

      const fov = (camera.fov * Math.PI) / 180;
      const distance = (maxDim / (2 * Math.tan(fov / 2))) * 1.7;
      const dir = new THREE.Vector3(1, 0.8, 1).normalize();

      camera.position.copy(center.clone().add(dir.multiplyScalar(distance)));
      camera.near = Math.max(distance / 100, 0.01);
      camera.far = distance * 100;
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      if (controls) {
        controls.target.copy(center);
        controls.minDistance = distance / 10;
        controls.maxDistance = distance * 10;
        controls.update();
      }

      fitted.current = true;
      clearInterval(id);
      if (invalidate) invalidate();
    }, 100);

    return () => clearInterval(id);
  }, [camera, controls, targetRef, invalidate]);

  return null;
}

/* ---------------------------------------------------------------- */
/* 3. MAIN PREVIEW CONTAINER                                        */
/* ---------------------------------------------------------------- */
export default function Preview({ glbUrl, exportedCanvas, panels, viewBox }) {
  const groupRef = useRef(null);
  const [openAmount, setOpenAmount] = useState(0); // 0 = closed, 100 = fully open

  return (
    <div 
      className="w-100 h-100 position-relative"
      style={{ background: SCENE_BG_COLOR }}
    >
      <Canvas
        camera={{ fov: 40 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false }}
      >
        {/* Scene background fixed hamesha — kabhi black kabhi white nahi hoga */}
        <color attach="background" args={[SCENE_BG_COLOR]} />

        <ambientLight intensity={1.2} />
        <hemisphereLight args={["#ffffff", "#dddddd", 1.0]} />
        <directionalLight position={[3, 5, 3]} intensity={1.0} />
        <directionalLight position={[-3, 3, -3]} intensity={0.6} />

        {glbUrl && (
          <Suspense fallback={null}>
            <BoxModel
              glbUrl={glbUrl}
              exportedCanvas={exportedCanvas}
              panels={panels}
              viewBox={viewBox}
              groupRef={groupRef}
              openAmount={openAmount}
            />
            <CameraFit targetRef={groupRef} />
          </Suspense>
        )}

        <OrbitControls makeDefault enablePan={true} enableZoom={true} />
      </Canvas>

      {/* Open/Close slider — Pacdora style. Slider "Open" left, "Close" right,
          isliye value ko invert karke openAmount state mein bhejte hain. */}
      <BoxOpenSlider
        value={100 - openAmount}
        onChange={(v) => setOpenAmount(100 - v)}
      />
    </div>
  );
}