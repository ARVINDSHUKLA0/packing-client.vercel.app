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
    <div className="d-flex align-items-center gap-3">
      <select
        value={element.fontFamily}
        onChange={(e) => onChange({ fontFamily: e.target.value })}
        className="form-select form-select-sm"
        style={{ width: "auto" }}
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
        className="form-control form-control-sm"
        style={{ width: "4rem" }}
      />

      <input
        type="color"
        value={element.fill}
        onChange={(e) => onChange({ fill: e.target.value })}
        className="form-control form-control-sm p-1"
        style={{ width: "2rem", height: "2rem" }}
      />

      <button
        onClick={() => toggleStyle("bold")}
        className={`btn btn-sm ${isBold ? "btn-dark" : "btn-light"} fw-bold`}
      >
        B
      </button>
      <button
        onClick={() => toggleStyle("italic")}
        className={`btn btn-sm ${isItalic ? "btn-dark" : "btn-light"} fst-italic`}
      >
        I
      </button>

      {["left", "center", "right"].map((a) => (
        <button
          key={a}
          onClick={() => onChange({ align: a })}
          className={`btn btn-sm ${element.align === a ? "btn-dark" : "btn-light"}`}
        >
          {a[0].toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default TextToolbar;