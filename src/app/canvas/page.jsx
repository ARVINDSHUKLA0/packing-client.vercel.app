"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { usePanelData } from "../../hooks/usePanelData";
import CanvasSidebar from "@/component/CanvasSidebar";
import TextToolbar from "@/component/TextToolbar";
import Editor from "@/component/Editor";
import Preview from "@/component/Preview";
// Agar @/* alias set hai (jsconfig.json / tsconfig.json mein), to isse use kar:
// import { usePanelData } from "@/hooks/usePanelData";
 

const uid = () => Math.random().toString(36).slice(2, 10);

const page = ({ params }) => {
  const boxStyleId = params?.boxStyleId; // dynamic route hoga to yaha aayega

  const [boxStyle, setBoxStyle] = useState(null); // { svgUrl, glbUrl }
  const [loadingBoxStyle, setLoadingBoxStyle] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchBoxStyle() {
      setLoadingBoxStyle(true);
      try {
        if (boxStyleId) {
          // Production: admin ke BoxStyle document se SVG + GLB fetch karo
          const res = await fetch(`/api/box-styles/${boxStyleId}`);
          if (!res.ok) throw new Error("Box style not found");
          const data = await res.json();
          setBoxStyle({ svgUrl: data.keylineSvgUrl, glbUrl: data.modelGlbUrl });
        } else {
          // LOCAL TESTING: static route hai (koi [boxStyleId] param nahi),
          // isliye public/assets se direct files uthao.
          // public/assets/keyline.svg aur public/assets/box.glb rakh de.
          setBoxStyle({
            svgUrl: "/assets/img/keyline.svg",
            glbUrl: "/assets/img/box.glb",
          });
        }
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoadingBoxStyle(false);
      }
    }
    fetchBoxStyle();
  }, [boxStyleId]);

  const {
    panels,
    viewBox,
    loading: loadingPanels,
    error: panelError,
  } = usePanelData(boxStyle?.svgUrl);

  const [viewMode, setViewMode] = useState("2d"); // '2d' | '3d'
  const [activePanelId, setActivePanelId] = useState(null);
  const [elements, setElements] = useState({}); // { [panelId]: Element[] }
  const [selectedElementId, setSelectedElementId] = useState(null);

  const stageRef = useRef(null); // Konva Stage instance
  const [exportedCanvas, setExportedCanvas] = useState(null); // captured before 3D switch

  // pehla panel default select ho jaye jab panels load ho jaayein
  useEffect(() => {
    if (panels.length && !activePanelId) {
      setActivePanelId(panels[0].id);
    }
  }, [panels, activePanelId]);

  const selectedElement =
    selectedElementId && activePanelId
      ? elements[activePanelId]?.find((el) => el.id === selectedElementId)
      : null;

  const addElement = useCallback(
    (type, extra = {}) => {
      if (!activePanelId) return;
      const newEl = {
        id: uid(),
        type,
        x: 20,
        y: 20,
        rotation: 0,
        ...(type === "text"
          ? {
              text: "Double click to edit",
              fontSize: 24,
              fontFamily: "Arial",
              fill: "#000000",
              fontStyle: "normal",
              align: "left",
              width: 160,
            }
          : {
              width: 120,
              height: 120,
              src: extra.src,
            }),
        ...extra,
      };
      setElements((prev) => ({
        ...prev,
        [activePanelId]: [...(prev[activePanelId] || []), newEl],
      }));
      setSelectedElementId(newEl.id);
    },
    [activePanelId]
  );

  const updateElement = useCallback((panelId, elId, patch) => {
    setElements((prev) => ({
      ...prev,
      [panelId]: (prev[panelId] || []).map((el) =>
        el.id === elId ? { ...el, ...patch } : el
      ),
    }));
  }, []);

  const deleteElement = useCallback((panelId, elId) => {
    setElements((prev) => ({
      ...prev,
      [panelId]: (prev[panelId] || []).filter((el) => el.id !== elId),
    }));
    setSelectedElementId(null);
  }, []);

  const handleAddImage = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = () => addElement("image", { src: reader.result });
      reader.readAsDataURL(file);
    },
    [addElement]
  );

  const goToPreview = useCallback(() => {
    // CRITICAL: snapshot abhi capture karo jabki Editor/Stage mounted hai.
    // Agar hum sirf viewMode badal dete to Editor unmount ho jaata aur
    // Konva stage destroy ho jaata - texture blank aa jaata.
    if (stageRef.current) {
      const canvas = stageRef.current.toCanvas({ pixelRatio: 2 });
      setExportedCanvas(canvas);
    }
    setViewMode("3d");
  }, []);

  if (loadingBoxStyle) return <div className="p-8">Loading box style...</div>;
  if (fetchError) return <div className="p-8 text-red-500">{fetchError}</div>;
  if (!boxStyle?.svgUrl || !boxStyle?.glbUrl)
    return <div className="p-8 text-red-500">Box style ke SVG/GLB assets missing hain.</div>;
  if (panelError) return <div className="p-8 text-red-500">SVG parse error: {panelError}</div>;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <CanvasSidebar
        panels={panels}
        activePanelId={activePanelId}
        onSelectPanel={setActivePanelId}
        elements={elements[activePanelId] || []}
        selectedElementId={selectedElementId}
        onSelectElement={setSelectedElementId}
        onAddText={() => addElement("text")}
        onAddImage={handleAddImage}
        onDeleteElement={(id) => deleteElement(activePanelId, id)}
      />

      <div className="flex-1 flex flex-col relative">
        <div className="flex items-center justify-between border-b px-4 py-2 min-h-[52px]">
          {selectedElement?.type === "text" ? (
            <TextToolbar
              element={selectedElement}
              onChange={(patch) => updateElement(activePanelId, selectedElement.id, patch)}
            />
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "2d" ? "bg-black text-white" : "bg-gray-200"
              }`}
              onClick={() => setViewMode("2d")}
            >
              2D Edit
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "3d" ? "bg-black text-white" : "bg-gray-200"
              }`}
              onClick={goToPreview}
            >
              3D Preview
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          {loadingPanels ? (
            <div className="p-8">Parsing SVG panels...</div>
          ) : viewMode === "2d" ? (
            <Editor
              panels={panels}
              viewBox={viewBox}
              elements={elements}
              activePanelId={activePanelId}
              selectedElementId={selectedElementId}
              onSelectPanel={setActivePanelId}
              onSelectElement={setSelectedElementId}
              onUpdateElement={updateElement}
              stageRef={stageRef}
            />
          ) : (
            <Preview
              glbUrl={boxStyle.glbUrl}
              exportedCanvas={exportedCanvas}
              panels={panels}
              viewBox={viewBox}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
