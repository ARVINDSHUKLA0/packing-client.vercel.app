"use client";

import React from "react";

const FONTS = ["Arial", "Georgia", "Times New Roman", "Courier New", "Verdana"];

const TextToolbar = ({ element, onChange }) => {
  if (!element) return null;

  const isBold = element.fontStyle?.includes("bold");
  const isItalic = element.fontStyle?.includes("italic");

  const toggleStyle = (key) => {
    const style = element.fontStyle || "normal";
    const parts = new Set(style.split(" ").filter((s) => s !== "normal" && s !== ""));
    if (parts.has(key)) parts.delete(key);
    else parts.add(key);
    onChange({ fontStyle: parts.size ? [...parts].join(" ") : "normal" });
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={element.fontFamily}
        onChange={(e) => onChange({ fontFamily: e.target.value })}
        className="border rounded px-2 py-1 text-sm"
      >
        {FONTS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={element.fontSize}
        min={8}
        max={200}
        onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
        className="w-16 border rounded px-2 py-1 text-sm"
      />

      <input
        type="color"
        value={element.fill}
        onChange={(e) => onChange({ fill: e.target.value })}
        className="w-8 h-8 border rounded"
      />

      <button
        onClick={() => toggleStyle("bold")}
        className={`px-2 py-1 rounded text-sm font-bold ${
          isBold ? "bg-black text-white" : "bg-gray-100"
        }`}
      >
        B
      </button>
      <button
        onClick={() => toggleStyle("italic")}
        className={`px-2 py-1 rounded text-sm italic ${
          isItalic ? "bg-black text-white" : "bg-gray-100"
        }`}
      >
        I
      </button>

      {["left", "center", "right"].map((a) => (
        <button
          key={a}
          onClick={() => onChange({ align: a })}
          className={`px-2 py-1 rounded text-sm ${
            element.align === a ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          {a[0].toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default TextToolbar;
