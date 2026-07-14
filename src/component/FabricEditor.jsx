// "use client";

// import {
//   forwardRef,
//   useEffect,
//   useImperativeHandle,
//   useRef,
//   useState,
// } from "react";
// import SVG from "react-inlinesvg";
// import * as fabric from "fabric";
// import "../componentStyle/Editor.css";

// const HOVER_FILL = "#e8f4ff";
// const SELECTED_FILL = "#0f67aa7f";
// const SELECTED_STROKE = "#005eff";
// const DEFAULT_FILL = "#ffffff";
// const DEFAULT_STROKE = "#999999";

// const FabricEditor = forwardRef((props, ref) => {
//   const wrapRef = useRef(null);
//   const svgHostRef = useRef(null);
//   const fabricCanvasElRef = useRef(null);
//   const fabricRef = useRef(null);

//   const panelsRef = useRef([]);
//   const selectedIndexRef = useRef(null);
//   const selectedBoundsRef = useRef(null);

//   const [svgPath] = useState("/assets/img/keyline.svg");

//   // ---------- पैनल सेलेक्ट करने का फंक्शन ----------
//   const selectPanel = (index) => {
//     const panels = panelsRef.current;
//     if (index === null || index === undefined || !panels.length) return;

//     // पुराने सेलेक्टेड को रीसेट करें
//     panels.forEach((p, i) => {
//       p.style.stroke = DEFAULT_STROKE;
//       p.style.strokeWidth = "1";
//       if (!p.dataset.hasImage) {
//         p.style.fill = DEFAULT_FILL;
//       }
//     });

//     // नए को सेलेक्ट करें
//     const panel = panels[index];
//     if (panel) {
//       panel.style.stroke = SELECTED_STROKE;
//       panel.style.strokeWidth = "2";
//       if (!panel.dataset.hasImage) {
//         panel.style.fill = SELECTED_FILL;
//       }
//     }

//     selectedIndexRef.current = index;
//     applyClipToActivePanel();
//   };

//   // ---------- क्लिपिंग अपडेट ----------
//   const applyClipToActivePanel = () => {
//     const canvas = fabricRef.current;
//     const index = selectedIndexRef.current;
//     if (!canvas) return;

//     if (index === null || index === undefined) {
//       canvas.clipPath = null;
//       selectedBoundsRef.current = null;
//       canvas.renderAll();
//       return;
//     }

//     const panel = panelsRef.current[index];
//     if (!panel) return;

//     const panelRect = panel.getBoundingClientRect();
//     const canvasRect = fabricCanvasElRef.current.getBoundingClientRect();

//     const bounds = {
//       left: panelRect.left - canvasRect.left,
//       top: panelRect.top - canvasRect.top,
//       width: panelRect.width,
//       height: panelRect.height,
//     };
//     selectedBoundsRef.current = bounds;

//     // fabric.Rect से क्लिप पाथ बनाएं (absolutePositioned: true)
//     const clipRect = new fabric.Rect({
//       left: bounds.left,
//       top: bounds.top,
//       width: bounds.width,
//       height: bounds.height,
//       absolutePositioned: true,
//     });
//     canvas.clipPath = clipRect;
//     canvas.renderAll();
//   };

//   // ---------- ऑब्जेक्ट को पैनल के अंदर रोकना (वैकल्पिक) ----------
//   const constrainObjectToPanel = (obj) => {
//     const bounds = selectedBoundsRef.current;
//     if (!bounds || !obj) return;

//     const objBounds = obj.getBoundingRect();
//     let { left, top } = obj;

//     if (objBounds.left < bounds.left) left += bounds.left - objBounds.left;
//     if (objBounds.top < bounds.top) top += bounds.top - objBounds.top;
//     if (objBounds.left + objBounds.width > bounds.left + bounds.width) {
//       left -= objBounds.left + objBounds.width - (bounds.left + bounds.width);
//     }
//     if (objBounds.top + objBounds.height > bounds.top + bounds.height) {
//       top -= objBounds.top + objBounds.height - (bounds.top + bounds.height);
//     }

//     obj.set({ left, top });
//   };

//   // ---------- SVG इनिशियलाइज़ेशन ----------
//   const initSvg = () => {
//     const svg = svgHostRef.current?.querySelector("svg");
//     if (!svg) return;

//     svg.style.width = "100%";
//     svg.style.height = "100%";
//     svg.style.display = "block";

//     const panels = svg.querySelectorAll(
//       "rect,path,polygon,polyline,circle,ellipse"
//     );
//     panelsRef.current = Array.from(panels);

//     panels.forEach((panel, index) => {
//       panel.dataset.panelIndex = index; // कैनवास इवेंट में पहचान के लिए
//       panel.style.fill = DEFAULT_FILL;
//       panel.style.stroke = DEFAULT_STROKE;
//       panel.style.strokeWidth = "1";
//       panel.style.cursor = "pointer";
//       panel.style.transition = "fill 0.15s, stroke 0.15s";

//       // होवर इफेक्ट (सिर्फ तभी जब सेलेक्टेड न हो)
//       panel.addEventListener("mouseenter", () => {
//         if (selectedIndexRef.current !== index && !panel.dataset.hasImage) {
//           panel.style.fill = HOVER_FILL;
//         }
//       });
//       panel.addEventListener("mouseleave", () => {
//         if (selectedIndexRef.current !== index && !panel.dataset.hasImage) {
//           panel.style.fill = DEFAULT_FILL;
//         }
//       });
//     });
//   };

//   // ---------- टेक्स्ट ऐड करना ----------
//   const addText = (textValue, options = {}) => {
//     const canvas = fabricRef.current;
//     const bounds = selectedBoundsRef.current;

//     if (selectedIndexRef.current === null || !bounds) {
//       alert("Pehle ek panel select karo, fir text add karo.");
//       return;
//     }
//     if (!textValue?.trim()) return;

//     const text = new fabric.IText(textValue, {
//       left: bounds.left + bounds.width / 2,
//       top: bounds.top + bounds.height / 2,
//       originX: "center",
//       originY: "center",
//       fontSize: options.fontSize || 20,
//       fontWeight: options.fontWeight || "500",
//       fill: options.color || "#000000",
//       fontFamily: "Arial",
//       cornerColor: "#005eff",
//       cornerStrokeColor: "#ffffff",
//       borderColor: "#005eff",
//       cornerSize: 12,
//       transparentCorners: false,
//       padding: 0,
//     });

//     canvas.add(text);
//     canvas.setActiveObject(text);
//     canvas.renderAll();
//   };

//   // ---------- इमेज ऐड करना ----------
//   const addImage = (imageUrl) => {
//     const canvas = fabricRef.current;
//     const bounds = selectedBoundsRef.current;

//     if (selectedIndexRef.current === null || !bounds) {
//       alert("Pehle ek panel select karo, fir image upload karo.");
//       return;
//     }

//     fabric.FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" })
//       .then((img) => {
//         const padding = 0.9;
//         const scaleX = (bounds.width * padding) / img.width;
//         const scaleY = (bounds.height * padding) / img.height;
//         const scale = Math.min(scaleX, scaleY);

//         img.set({
//           left: bounds.left + bounds.width / 2,
//           top: bounds.top + bounds.height / 2,
//           originX: "center",
//           originY: "center",
//           scaleX: scale,
//           scaleY: scale,
//           cornerColor: "#005eff",
//           cornerStrokeColor: "#ffffff",
//           borderColor: "#005eff",
//           cornerSize: 12,
//           transparentCorners: false,
//           padding: 0,
//         });

//         canvas.add(img);
//         canvas.setActiveObject(img);
//         canvas.renderAll();
//       })
//       .catch((err) => {
//         console.error("IMAGE LOAD FAILED:", err);
//       });
//   };

//   // ---------- डिलीट ----------
//   const deleteSelected = () => {
//     const canvas = fabricRef.current;
//     if (!canvas) return;
//     const active = canvas.getActiveObject();
//     if (active) {
//       canvas.remove(active);
//       canvas.discardActiveObject();
//       canvas.renderAll();
//     }
//   };

//   // ---------- useImperativeHandle ----------
//   useImperativeHandle(ref, () => ({
//     addText,
//     addImage,
//     deleteSelected,
//   }));

//   // ---------- useEffect: कैनवास सेटअप ----------
//   useEffect(() => {
//     const canvas = new fabric.Canvas(fabricCanvasElRef.current, {
//       selection: false,
//       preserveObjectStacking: true,
//     });
//     fabricRef.current = canvas;

//     // कैनवास रैपर को एब्सोल्यूट पोजीशन दें
//     if (canvas.wrapperEl) {
//       canvas.wrapperEl.style.position = "absolute";
//       canvas.wrapperEl.style.inset = "0";
//       canvas.wrapperEl.style.top = "0";
//       canvas.wrapperEl.style.left = "0";
//     }

//     // रिसाइज़ हैंडलर
//     const resize = () => {
//       const el = wrapRef.current;
//       if (!el) return;
//       canvas.setDimensions({ width: el.clientWidth, height: el.clientHeight });
//       applyClipToActivePanel();
//     };
//     resize();
//     window.addEventListener("resize", resize);

//     // ---- पैनल सेलेक्शन: कैनवास पर क्लिक डिटेक्ट करें ----
//     canvas.on("mouse:down", (e) => {
//       const pointerEvent = e.e;
//       const elements = document.elementsFromPoint(
//         pointerEvent.clientX,
//         pointerEvent.clientY
//       );

//       let clickedIndex = -1;
//       for (let el of elements) {
//         if (el.dataset && el.dataset.panelIndex !== undefined) {
//           clickedIndex = parseInt(el.dataset.panelIndex, 10);
//           break;
//         }
//       }

//       // अगर किसी पैनल पर क्लिक हुआ और वह सेलेक्टेड नहीं है, तो सेलेक्ट करें
//       if (clickedIndex !== -1 && clickedIndex !== selectedIndexRef.current) {
//         selectPanel(clickedIndex);
//         return;
//       }

//       // अगर कैनवास के खाली हिस्से पर क्लिक हुआ (कोई ऑब्जेक्ट नहीं)
//       // तो हम सेलेक्शन नहीं बदलेंगे, ताकि यूजर ऑब्जेक्ट्स पर क्लिक कर सके
//     });

//     // ऑब्जेक्ट को पैनल में कंस्ट्रेन करें (मूव/स्केल)
//     canvas.on("object:moving", (e) => constrainObjectToPanel(e.target));
//     canvas.on("object:scaling", (e) => constrainObjectToPanel(e.target));

//     // कीबोर्ड: डिलीट
//     const handleKeyDown = (e) => {
//       const isTyping =
//         document.activeElement?.tagName === "INPUT" ||
//         document.activeElement?.tagName === "TEXTAREA" ||
//         canvas.getActiveObject()?.isEditing;

//       if ((e.key === "Delete" || e.key === "Backspace") && !isTyping) {
//         const active = canvas.getActiveObject();
//         if (active) {
//           canvas.remove(active);
//           canvas.discardActiveObject();
//           canvas.renderAll();
//         }
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);

//     // क्लीनअप
//     return () => {
//       window.removeEventListener("resize", resize);
//       window.removeEventListener("keydown", handleKeyDown);
//       canvas.dispose();
//     };
//   }, []); // खाली डिपेंडेंसी, सिर्फ एक बार रन होगा

//   return (
//     <div className="editor" ref={wrapRef}>
//       {/* SVG लेयर (पीछे) */}
//       <div className="editor-svg-layer" ref={svgHostRef}>
//         <SVG src={svgPath} onLoad={initSvg} />
//       </div>

//       {/* Fabric कैनवास (ऊपर) */}
//       <canvas ref={fabricCanvasElRef} className="editor-fabric-layer" />
//     </div>
//   );
// });

// FabricEditor.displayName = "FabricEditor";

// export default FabricEditor;