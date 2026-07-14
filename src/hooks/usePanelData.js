import { useEffect, useState } from "react";

/**
 * Admin se aaya SVG url fetch karke, har panel <g id="..."> ka
 * bounding box nikalta hai (viewBox ke relative units mein).
 * Purely runtime based hai - koi hardcoded id/coordinate nahi,
 * naya box style upload hote hi automatically kaam karega.
 */
export function usePanelData(svgUrl) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    panels: [], // [{ id, x, y, width, height }] in SVG user units
    viewBox: { width: 0, height: 0 },
    rawSvg: "",
  });

  useEffect(() => {
    if (!svgUrl) return;
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch(svgUrl);
        const svgText = await res.text();

        // hidden but layout-attached container - getBBox chahiye isliye
        // display:none nahi chalega, visibility:hidden se kaam ho jayega
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.visibility = "hidden";
        container.style.pointerEvents = "none";
        container.style.left = "-99999px";
        container.style.top = "0";
        container.innerHTML = svgText;
        document.body.appendChild(container);

        const svgEl = container.querySelector("svg");
        const vb = svgEl.viewBox.baseVal;
        const viewBox = { width: vb.width, height: vb.height };

        // sirf top-level named <g id="..."> panels count honge
        const groups = Array.from(svgEl.querySelectorAll("g[id]"));
        const panels = groups.map((g) => {
          const bbox = g.getBBox();
          return {
            id: g.getAttribute("id"),
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
          };
        });

        document.body.removeChild(container);

        if (!cancelled) {
          setState({ loading: false, error: null, panels, viewBox, rawSvg: svgText });
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: err.message }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [svgUrl]);

  return state;
}
