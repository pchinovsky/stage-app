import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NavProvider } from "./contexts/navContext.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";

import App from "./App.jsx";
import { Provider } from "./provider.jsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Provider>
            <AuthProvider>
                <NavProvider>
                    <App />
                </NavProvider>
            </AuthProvider>
        </Provider>
    </BrowserRouter>
);
