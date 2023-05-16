import * as React from "React";
import { createRoot } from "react-dom/client";
import App from './App';
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

const root = createRoot(document.getElementById('options-root'));
root.render(<FluentProvider theme={teamsLightTheme}><App /></FluentProvider>);
