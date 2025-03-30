import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { Provider } from "./provider.jsx";
import "@/styles/globals.css";

console.warn = () => {};
ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Provider>
            <App />
        </Provider>
    </BrowserRouter>
);
