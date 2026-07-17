"use client";

import React, { useRef } from "react";

const CanvasSidebar = ({
  panels,
  activePanelId,
  onSelectPanel,
  elements,
  selectedElementId,
  onSelectElement,
  onAddText,
  onAddImage,
  onDeleteElement,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white border-end vh-100 d-flex flex-column" style={{ width: "16rem" }}>
      <div className="p-3 border-bottom">
        <h3 className="text-secondary fw-semibold" style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
          PANELS
        </h3>
        <div className="d-flex flex-column gap-1 overflow-auto" style={{ maxHeight: "16rem" }}>
          {panels.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPanel(p.id)}
              className={`text-start px-3 py-2 rounded text-sm border-0 ${
                p.id === activePanelId
                  ? "bg-primary text-white"
                  : "bg-light hover-bg-gray-100"
              }`}
              style={{ fontSize: "0.875rem" }}
            >
              {p.id}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-bottom d-flex gap-2">
        <button
          onClick={onAddText}
          disabled={!activePanelId}
          className="flex-grow-1 px-3 py-2 text-sm bg-black text-white rounded border-0 disabled-opacity-40"
          style={{ fontSize: "0.875rem" }}
        >
          + Text
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!activePanelId}
          className="flex-grow-1 px-3 py-2 text-sm bg-secondary bg-opacity-25 rounded border-0 disabled-opacity-40"
          style={{ fontSize: "0.875rem" }}
        >
          + Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onAddImage(file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="p-3 flex-grow-1 overflow-auto">
        <h3 className="text-secondary fw-semibold" style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
          LAYERS {activePanelId ? `(${activePanelId})` : ""}
        </h3>
        <div className="d-flex flex-column gap-1">
          {elements.map((el) => (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`d-flex align-items-center justify-content-between px-3 py-2 rounded text-sm cursor-pointer ${
                el.id === selectedElementId
                  ? "bg-primary bg-opacity-10 border border-primary"
                  : "bg-light"
              }`}
              style={{ fontSize: "0.875rem", cursor: "pointer" }}
            >
              <span className="text-truncate">
                {el.type === "text" ? `📝 ${el.text?.slice(0, 16)}` : "🖼️ Image"}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteElement(el.id);
                }}
                className="text-danger border-0 bg-transparent ms-2"
                style={{ fontSize: "0.75rem" }}
              >
                ✕
              </button>
            </div>
          ))}
          {elements.length === 0 && (
            <p className="text-muted" style={{ fontSize: "0.75rem" }}>Koi element nahi is panel mein</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasSidebar;