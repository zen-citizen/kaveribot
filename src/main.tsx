import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import posthogScript from "./assets/posthog.js?url"

import App from "./App.tsx";

const container = document.createElement("div");
container.id = "react-root";
document.body.appendChild(container);
const script = document.createElement("script");
script.src = posthogScript;
document.head.appendChild(script);

createRoot(container).render(<StrictMode>
    <App />
  </StrictMode>)
