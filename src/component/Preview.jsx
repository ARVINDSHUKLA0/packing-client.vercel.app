"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Environment } from "@react-three/drei";
import * as THREE from "three";

const clean = (s) => (s || "").trim().toLowerCase();

function BoxModel({ glbUrl, exportedCanvas, panels, viewBox, groupRef }) {
  const { scene, animations } = useGLTF(glbUrl);
  const { actions, names } = useAnimations(animations, groupRef);

  // Agar GLB mein "open/close" jaisi animation hai to use CLOSED end pe clamp karo
  useEffect(() => {
    console.log("[BoxModel] Animation clips found:", names);
    if (names.length) {
      const action = actions[names[0]];
      action.reset();
      action.play();
      action.paused = true;
      // clip ke last frame (closed state) pe freeze — agar ulta ho to time = 0 kar dena
      action.time = action.getClip().duration;
      action.getMixer().update(0);
    }
  }, [actions, names]);

  useEffect(() => {
    const meshNames = [];
    scene.traverse((n) => n.isMesh && meshNames.push(n.name));
    console.log("[BoxModel] GLB mesh names:", meshNames);
    console.log("[BoxModel] SVG panel ids:", panels?.map((p) => p.id));
  }, [scene, panels]);

  useEffect(() => {
    if (!exportedCanvas || !panels?.length) return;
    const fullW = exportedCanvas.width;
    const fullH = exportedCanvas.height;
    let matched = 0;

    scene.traverse((node) => {
      if (!node.isMesh) return;
      const panel = panels.find((p) => clean(p.id) === clean(node.name));
      if (!panel) return console.warn(`[BoxModel] No match for mesh "${node.name}"`);
      matched++;

      const sx = (panel.x / viewBox.width) * fullW;
      const sy = (panel.y / viewBox.height) * fullH;
      const sw = (panel.width / viewBox.width) * fullW;
      const sh = (panel.height / viewBox.height) * fullH;

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = Math.max(1, sw);
      cropCanvas.height = Math.max(1, sh);
      cropCanvas.getContext("2d").drawImage(exportedCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

      const texture = new THREE.CanvasTexture(cropCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
      texture.needsUpdate = true;

      const material = (Array.isArray(node.material) ? node.material[0] : node.material).clone();
      if (material.map) material.map.dispose();
      material.map = texture;
      material.side = THREE.DoubleSide;
      material.needsUpdate = true;
      node.material = material;
    });
    console.log(`[BoxModel] Texture applied on ${matched}/${panels.length} panels`);
  }, [scene, exportedCanvas, panels, viewBox]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function CameraFit({ targetRef }) {
  const { camera, controls } = useThree();
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
      const distance = (maxDim / (2 * Math.tan(fov / 2))) * 1.6;
      const dir = new THREE.Vector3(1, 0.8, 1).normalize();

      camera.position.copy(center.clone().add(dir.multiplyScalar(distance)));
      camera.near = distance / 100;
      camera.far = distance * 100;
      camera.lookAt(center);
      camera.updateProjectionMatrix();
      if (controls) { controls.target.copy(center); controls.update(); }

      console.log("[CameraFit] size:", size, "maxDim:", maxDim);
      fitted.current = true;
      clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [camera, controls, targetRef]);

  return null;
}

export default function Preview({ glbUrl, exportedCanvas, panels, viewBox }) {
  const groupRef = useRef(null);
  if (!exportedCanvas)
    return <div className="w-full h-full flex items-center justify-center text-gray-400">Pehle 2D design export karo</div>;

  return (
    <div className="w-full h-full">
      <Canvas camera={{ fov: 35 }} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} />
        <Suspense fallback={null}>
          <BoxModel glbUrl={glbUrl} exportedCanvas={exportedCanvas} panels={panels} viewBox={viewBox} groupRef={groupRef} />
          <Environment preset="studio" background={false} />
        </Suspense>
        <CameraFit targetRef={groupRef} />
        <OrbitControls makeDefault enablePan={false} />
      </Canvas>
    </div>
  );
}