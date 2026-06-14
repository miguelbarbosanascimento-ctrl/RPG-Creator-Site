import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function CursedLogo({
  size = 36,
  className = ""
}) {
  return /*#__PURE__*/_jsxs("svg", {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    "aria-hidden": true,
    children: [/*#__PURE__*/_jsxs("defs", {
      children: [/*#__PURE__*/_jsxs("radialGradient", {
        id: "cursed-glow",
        cx: "50%",
        cy: "50%",
        r: "50%",
        children: [/*#__PURE__*/_jsx("stop", {
          offset: "0%",
          stopColor: "#c084fc",
          stopOpacity: "1"
        }), /*#__PURE__*/_jsx("stop", {
          offset: "60%",
          stopColor: "#7c3aed",
          stopOpacity: "1"
        }), /*#__PURE__*/_jsx("stop", {
          offset: "100%",
          stopColor: "#3b0764",
          stopOpacity: "1"
        })]
      }), /*#__PURE__*/_jsxs("linearGradient", {
        id: "cursed-line",
        x1: "0",
        y1: "0",
        x2: "1",
        y2: "1",
        children: [/*#__PURE__*/_jsx("stop", {
          offset: "0%",
          stopColor: "#c084fc"
        }), /*#__PURE__*/_jsx("stop", {
          offset: "100%",
          stopColor: "#e11d48"
        })]
      })]
    }), /*#__PURE__*/_jsx("circle", {
      cx: "32",
      cy: "32",
      r: "28",
      stroke: "url(#cursed-line)",
      strokeWidth: "1.5",
      opacity: "0.7"
    }), /*#__PURE__*/_jsx("circle", {
      cx: "32",
      cy: "32",
      r: "24",
      stroke: "url(#cursed-line)",
      strokeWidth: "0.8",
      opacity: "0.4"
    }), /*#__PURE__*/_jsx("circle", {
      cx: "32",
      cy: "32",
      r: "14",
      fill: "url(#cursed-glow)",
      opacity: "0.85"
    }), /*#__PURE__*/_jsxs("g", {
      stroke: "#fbbf24",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      opacity: "0.95",
      children: [/*#__PURE__*/_jsx("line", {
        x1: "32",
        y1: "6",
        x2: "32",
        y2: "14"
      }), /*#__PURE__*/_jsx("line", {
        x1: "32",
        y1: "50",
        x2: "32",
        y2: "58"
      }), /*#__PURE__*/_jsx("line", {
        x1: "6",
        y1: "32",
        x2: "14",
        y2: "32"
      }), /*#__PURE__*/_jsx("line", {
        x1: "50",
        y1: "32",
        x2: "58",
        y2: "32"
      })]
    }), /*#__PURE__*/_jsx("circle", {
      cx: "32",
      cy: "32",
      r: "3",
      fill: "#fff"
    }), /*#__PURE__*/_jsx("circle", {
      cx: "32",
      cy: "32",
      r: "1.4",
      fill: "#7c1d6f"
    })]
  });
}
