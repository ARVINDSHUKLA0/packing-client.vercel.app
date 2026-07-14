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
    <div className="w-64 border-r flex flex-col h-full bg-white">
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">PANELS</h3>
        <div className="flex flex-col gap-1 max-h-64 overflow-auto">
          {panels.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPanel(p.id)}
              className={`text-left px-3 py-2 rounded text-sm ${
                p.id === activePanelId
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-b flex gap-2">
        <button
          onClick={onAddText}
          disabled={!activePanelId}
          className="flex-1 px-3 py-2 text-sm bg-black text-white rounded disabled:opacity-40"
        >
          + Text
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!activePanelId}
          className="flex-1 px-3 py-2 text-sm bg-gray-200 rounded disabled:opacity-40"
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

      <div className="p-3 flex-1 overflow-auto">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">
          LAYERS {activePanelId ? `(${activePanelId})` : ""}
        </h3>
        <div className="flex flex-col gap-1">
          {elements.map((el) => (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`flex items-center justify-between px-3 py-2 rounded text-sm cursor-pointer ${
                el.id === selectedElementId
                  ? "bg-blue-50 border border-blue-400"
                  : "bg-gray-50"
              }`}
            >
              <span className="truncate">
                {el.type === "text" ? `📝 ${el.text?.slice(0, 16)}` : "🖼️ Image"}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteElement(el.id);
                }}
                className="text-red-500 text-xs ml-2"
              >
                ✕
              </button>
            </div>
          ))}
          {elements.length === 0 && (
            <p className="text-xs text-gray-400">Koi element nahi is panel mein</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasSidebar;
