import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);

if (import.meta.env.DEV) {
  import("./components/DevAgentation.jsx").then(({ DevAgentation }) => {
    const container = document.createElement("div");
    container.id = "agentation-dev-root";
    document.body.appendChild(container);
    createRoot(container).render(<DevAgentation />);
  });
}
