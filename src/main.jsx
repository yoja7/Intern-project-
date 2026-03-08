import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Bootstrap CSS — must come before custom styles
import "bootstrap/dist/css/bootstrap.min.css";

// Global custom styles
import "./styles/main.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
