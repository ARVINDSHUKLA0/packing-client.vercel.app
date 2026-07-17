"use client";

import React from "react";

/*
  Pacdora jaisa Open/Close slider.
  value: 0 (fully open) se 100 (fully closed)
  onChange: parent ko value bhejta hai
*/
export default function BoxOpenSlider({ value, onChange }) {
  return (
    <div 
      className="position-absolute translate-middle-x" 
      style={{ 
        bottom: 20, 
        left: "50%",
        zIndex: 10
      }}
    >
      <div 
        className="d-flex align-items-center gap-3 p-2 px-4 rounded-pill"
        style={{
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        }}
      >
        <span className="fw-semibold" style={{ fontSize: 13, color: "#111" }}>
          Open
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: 180, accentColor: "#16a34a" }}
          className="form-range"
        />
        <span className="fw-semibold" style={{ fontSize: 13, color: "#111" }}>
          Close
        </span>
      </div>
    </div>
  );
}