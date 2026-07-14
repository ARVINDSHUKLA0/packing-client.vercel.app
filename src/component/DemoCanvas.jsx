"use client";
import { useEffect } from "react";
import SVG from "react-inlinesvg";
import "./canvas.css";

export default function Page() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const svg = document.querySelector(".keyline svg");
      if (!svg) {
        console.log("SVG not found");
        return;
      }

      const panels = svg.querySelectorAll("rect, path, polygon, polyline, circle");
      console.log("Found:", panels.length); // Helpful for debugging

      panels.forEach((panel) => {
        // Ensure it's clickable
        panel.style.cursor = "pointer";
        panel.style.pointerEvents = "all";
        
        // Set default fill to transparent (via style, to override any inline)
        panel.style.fill = "transparent";

        // Hover In
        panel.addEventListener("mouseenter", () => {
          if (panel.dataset.active !== "true") {
            panel.style.fill = "rgba(255, 0, 0, 0.3)";
          }
        });

        // Hover Out
        panel.addEventListener("mouseleave", () => {
          if (panel.dataset.active !== "true") {
            panel.style.fill = "transparent";
          }
        });

        // Click
        panel.addEventListener("click", (e) => {
          e.stopPropagation();
          // Reset all
          panels.forEach((p) => {
            p.style.fill = "transparent";
            p.dataset.active = "false";
          });
          // Set current
          panel.style.fill = "red";
          panel.dataset.active = "true";
        });
      });
    }, 500); // Increased timeout to ensure SVG loads properly
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="main-height">
      <div className="keyline">
        <SVG src="/assets/img/keyline.svg" />
      </div>
    </section>
  );
}