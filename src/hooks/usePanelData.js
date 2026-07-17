// "use client";

// import { useEffect, useState } from "react";

// /**
//  * usePanelData(svgUrl)
//  *
//  * SVG ko fetch karke ek hidden <div> mein DOM par mount karta hai,
//  * fir har element jiska `id` set hai uska getBBox() nikalta hai.
//  * getBBox() sirf tab kaam karta hai jab SVG actual DOM mein render
//  * ho chuka ho - isliye hidden mount zaroori hai (offscreen, display:none nahi,
//  * kyunki display:none wale SVG ka getBBox() browsers mein 0 return karta hai).
//  *
//  * Returns: { panels: [{id, x, y, width, height}], viewBox: {width, height}, loading, error }
//  */
// export function usePanelData(svgUrl) {
//   const [panels, setPanels] = useState([]);
//   const [viewBox, setViewBox] = useState({ width: 0, height: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!svgUrl) return;

//     let cancelled = false;
//     setLoading(true);
//     setError(null);

//     async function run() {
//       try {
//         const res = await fetch(svgUrl);
//         if (!res.ok) throw new Error(`SVG fetch failed: ${res.status}`);
//         const svgText = await res.text();

//         // Hidden container - offscreen positioning (NOT display:none) taaki
//         // browser layout/getBBox() sahi values de.
//         const container = document.createElement("div");
//         container.style.position = "absolute";
//         container.style.left = "-99999px";
//         container.style.top = "0";
//         container.style.width = "0";
//         container.style.height = "0";
//         container.style.overflow = "hidden";
//         container.innerHTML = svgText;
//         document.body.appendChild(container);

//         const svgEl = container.querySelector("svg");
//         if (!svgEl) throw new Error("SVG root element nahi mila");

//         // viewBox parse karo (fallback: width/height attributes)
//         let vb = { width: 0, height: 0 };
//         const viewBoxAttr = svgEl.getAttribute("viewBox");
//         if (viewBoxAttr) {
//           const parts = viewBoxAttr.trim().split(/\s+/).map(Number);
//           vb = { width: parts[2], height: parts[3] };
//         } else {
//           vb = {
//             width: parseFloat(svgEl.getAttribute("width")) || 0,
//             height: parseFloat(svgEl.getAttribute("height")) || 0,
//           };
//         }

//         // har id-wale element ka bbox nikalo
//         const idElements = svgEl.querySelectorAll("[id]");
//         const extracted = [];
//         idElements.forEach((el) => {
//           try {
//             const bbox = el.getBBox();
//             extracted.push({
//               id: el.getAttribute("id"),
//               x: bbox.x,
//               y: bbox.y,
//               width: bbox.width,
//               height: bbox.height,
//             });
//           } catch {
//             // kuch elements (jaise <defs> ke andar) getBBox throw kar sakte hain, skip karo
//           }
//         });

//         document.body.removeChild(container);

//         if (!cancelled) {
//           setPanels(extracted);
//           setViewBox(vb);
//           setLoading(false);
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setError(err.message);
//           setLoading(false);
//         }
//       }
//     }

//     run();
//     return () => {
//       cancelled = true;
//     };
//   }, [svgUrl]);

//   return { panels, viewBox, loading, error };
// }

















































"use client";

import { useEffect, useState } from "react";

/**
 * usePanelData(svgUrl)
 *
 * SVG ko fetch karke ek hidden <div> mein DOM par mount karta hai,
 * fir har element jiska `id` set hai uska matrix-aware global bounding box nikalta hai.
 *
 * Returns: { panels: [{id, x, y, width, height}], viewBox: {width, height}, loading, error }
 */
export function usePanelData(svgUrl) {
  const [panels, setPanels] = useState([]);
  const [viewBox, setViewBox] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!svgUrl) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function run() {
      try {
        // const res = await fetch(svgUrl);
        // if (!res.ok) throw new Error(`SVG fetch failed: ${res.status}`);
        // const svgText = await res.text();

        const res = await fetch(svgUrl);

console.log("Status:", res.status);
console.log("Content-Type:", res.headers.get("content-type"));

if (!res.ok) {
  throw new Error(`SVG fetch failed: ${res.status}`);
}

const svgText = await res.text();

console.log("SVG URL:", svgUrl);
console.log("SVG First 500 Characters:");
console.log(svgText.substring(0, 500));

        // Hidden container - offscreen positioning (NOT display:none)
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-99999px";
        container.style.top = "0";
        container.style.width = "0";
        container.style.height = "0";
        container.style.overflow = "hidden";
        container.innerHTML = svgText;
        document.body.appendChild(container);

        const svgEl = container.querySelector("svg");
        if (!svgEl) throw new Error("SVG root element nahi mila");

        // 1. viewBox parse karo aur shifts/offsets ko nikalne ke liye base coordinates lo
        let vb = { width: 0, height: 0 };
        let vbX = 0;
        let vbY = 0;
        
        const viewBoxAttr = svgEl.getAttribute("viewBox");
        if (viewBoxAttr) {
          const parts = viewBoxAttr.trim().split(/\s+/).map(Number);
          vbX = parts[0] || 0;
          vbY = parts[1] || 0;
          vb = { width: parts[2], height: parts[3] };
        } else {
          vb = {
            width: parseFloat(svgEl.getAttribute("width")) || 0,
            height: parseFloat(svgEl.getAttribute("height")) || 0,
          };
        }

        // har id-wale element ka bbox nikalo
        const idElements = svgEl.querySelectorAll("[id]");
        const extracted = [];
        
        idElements.forEach((el) => {
          try {
            // Agar <defs>, <style>, ya metadata elements hain to unhe chhod do
            if (el.closest("defs")) return;

            // Local bounding box
            const bbox = el.getBBox();
            
            // Current Transformation Matrix (CTM) - root <svg> tak ka combined transform
            const ctm = el.getCTM();

            let finalX = bbox.x;
            let finalY = bbox.y;
            let finalWidth = bbox.width;
            let finalHeight = bbox.height;

            // Agar transform matrix maujood hai (jaise nested <g transform="matrix(...)">)
            if (ctm) {
              // 4 corners ke SVG points banao
              const p1 = svgEl.createSVGPoint();
              const p2 = svgEl.createSVGPoint();
              const p3 = svgEl.createSVGPoint();
              const p4 = svgEl.createSVGPoint();

              p1.x = bbox.x;              p1.y = bbox.y;
              p2.x = bbox.x + bbox.width; p2.y = bbox.y;
              p3.x = bbox.x;              p3.y = bbox.y + bbox.height;
              p4.x = bbox.x + bbox.width; p4.y = bbox.y + bbox.height;

              // Har corner ko transform matrix se multiply karke global canvas space me lao
              const tp1 = p1.matrixTransform(ctm);
              const tp2 = p2.matrixTransform(ctm);
              const tp3 = p3.matrixTransform(ctm);
              const tp4 = p4.matrixTransform(ctm);

              // Transformed points se naya min/max boundary box calculate karo
              const minX = Math.min(tp1.x, tp2.x, tp3.x, tp4.x);
              const maxX = Math.max(tp1.x, tp2.x, tp3.x, tp4.x);
              const minY = Math.min(tp1.y, tp2.y, tp3.y, tp4.y);
              const maxY = Math.max(tp1.y, tp2.y, tp3.y, tp4.y);

              finalX = minX;
              finalY = minY;
              finalWidth = maxX - minX;
              finalHeight = maxY - minY;
            }

            // Bonus Fix: Agar viewBox (0,0) se start nahi ho raha, to wo shift subtract karo
            extracted.push({
              id: el.getAttribute("id"),
              x: finalX - vbX,
              y: finalY - vbY,
              width: finalWidth,
              height: finalHeight,
            });
          } catch (e) {
            // getBBox ya getCTM throw karne wale elements skip ho jayenge
          }
        });

        document.body.removeChild(container);

        if (!cancelled) {
          setPanels(extracted);
          setViewBox(vb);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [svgUrl]);

  return { panels, viewBox, loading, error };
}