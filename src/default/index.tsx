import { createRoot } from "react-dom/client";
import * as React from 'react';
import App from './App';
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

const root = createRoot(document.getElementById('root'));
root.render(<FluentProvider theme={teamsLightTheme}><App /></FluentProvider>);
