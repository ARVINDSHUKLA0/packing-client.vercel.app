"use client";

import React, { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePanelData } from "../../../hooks/usePanelData";
import CanvasSidebar from "@/component/CanvasSidebar";
import TextToolbar from "@/component/TextToolbar";
import Editor from "@/component/Editor";
import Preview from "@/component/Preview";

const uid = () => Math.random().toString(36).slice(2, 10);

// 🔥 Component jo searchParams use karega
function CanvasContent({ boxStyleId }) {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId');

  const [boxStyle, setBoxStyle] = useState(null);
  const [loadingBoxStyle, setLoadingBoxStyle] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // 🔥 Fetch Box Style
  useEffect(() => {
    async function fetchBoxStyle() {
      setLoadingBoxStyle(true);
      setFetchError(null);

      try {
        if (boxStyleId) {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
          const response = await fetch(`${API_URL}/api/boxstyle/${boxStyleId}`);

          if (!response.ok) {
            throw new Error(`Failed to fetch box style: ${response.status}`);
          }

          const data = await response.json();

          console.log("API Response:", data);

          const boxStyleData = data.boxStyle || data;

          setBoxStyle({
            svgUrl: boxStyleData.svgDieline?.url || boxStyleData.svgUrl || null,
            glbUrl: boxStyleData.glbModel?.url || boxStyleData.glbUrl || null,
            styleName: boxStyleData.styleName
          });
        } else {
          setBoxStyle({
            svgUrl: "/assets/img/keyline.svg",
            glbUrl: "/assets/img/box.glb",
          });
        }
      } catch (err) {
        console.error("Error fetching box style:", err);
        setFetchError(err.message);
        setBoxStyle({
          svgUrl: "/assets/img/keyline.svg",
          glbUrl: "/assets/img/box.glb",
        });
      } finally {
        setLoadingBoxStyle(false);
      }
    }

    if (boxStyleId) {
      fetchBoxStyle();
    }
  }, [boxStyleId]);

  const {
    panels,
    viewBox,
    loading: loadingPanels,
    error: panelError,
  } = usePanelData(boxStyle?.svgUrl);

  const [viewMode, setViewMode] = useState("2d");
  const [activePanelId, setActivePanelId] = useState(null);
  const [elements, setElements] = useState({});
  const [selectedElementId, setSelectedElementId] = useState(null);

  const stageRef = useRef(null);
  const [exportedCanvas, setExportedCanvas] = useState(null);

  useEffect(() => {
    if (panels?.length && !activePanelId) {
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
    if (stageRef.current) {
      const canvas = stageRef.current.toCanvas({ pixelRatio: 2 });
      setExportedCanvas(canvas);
    }
    setViewMode("3d");
  }, []);

  // Loading states
  if (loadingBoxStyle) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading box style...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center text-danger">
          <h4>Error Loading Box Style</h4>
          <p>{fetchError}</p>
          <p className="text-muted small">Box Style ID: {boxStyleId}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!boxStyle?.svgUrl || !boxStyle?.glbUrl) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center text-danger">
          <h4>Missing Assets</h4>
          <p>Box style ke SVG/GLB assets missing hain.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (panelError) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center text-danger">
          <h4>SVG Parse Error</h4>
          <p>{panelError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 overflow-hidden">
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

      <div className="flex-grow-1 d-flex flex-column position-relative">
        <div className="d-flex align-items-center justify-content-between border-bottom px-4 py-2" style={{ minHeight: "52px" }}>
          {selectedElement?.type === "text" ? (
            <TextToolbar
              element={selectedElement}
              onChange={(patch) => updateElement(activePanelId, selectedElement.id, patch)}
            />
          ) : (
            <div />
          )}

          <div className="d-flex gap-2">
            <button
              className={`px-3 py-1 rounded text-sm ${viewMode === "2d" ? "bg-black text-white" : "bg-gray-200"
                }`}
              onClick={() => setViewMode("2d")}
            >
              2D Edit
            </button>
            <button
              className={`px-3 py-1 rounded text-sm ${viewMode === "3d" ? "bg-black text-white" : "bg-gray-200"
                }`}
              onClick={goToPreview}
            >
              3D Preview
            </button>
          </div>
        </div>

        <div className="flex-grow-1 position-relative">
          {loadingPanels ? (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Parsing SVG panels...</p>
              </div>
            </div>
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
              selectedPanel={activePanelId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 🔥 MAIN COMPONENT - params ko handle karega
export default function CanvasPage({ params }) {
  // 🔥 params ko React.use() se unwrap karo
  const { boxStyleId } = React.use(params);

  return (
    <Suspense fallback={
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <CanvasContent boxStyleId={boxStyleId} />
    </Suspense>
  );
}