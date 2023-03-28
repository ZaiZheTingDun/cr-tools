import { createRoot } from "react-dom/client";
import App from "./components/App";
import React from "react";

const divElement = document.createElement("div");
divElement.setAttribute("id", "cr-tools-root");
document.body.appendChild(divElement);

const root = createRoot(document.getElementById('cr-tools-root'));
root.render(<App />);