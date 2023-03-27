import { createRoot } from "react-dom/client";
import React from "React";
import App from './App';
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

const root = createRoot(document.getElementById('options-root'));
root.render(<FluentProvider theme={teamsLightTheme}><App /></FluentProvider>);
