import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NavProvider } from "./contexts/navContext.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { FollowingProvider } from "./contexts/followingContext.jsx";
import { FloatingProvider } from "./contexts/floatingContext.jsx";
import { EventsProvider } from "./contexts/eventsContext.jsx";
import { UsersProvider } from "./contexts/usersContext.jsx";

import App from "./App.jsx";
import { Provider } from "./provider.jsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Provider>
            <AuthProvider>
                <UsersProvider>
                    <NavProvider>
                        <FollowingProvider>
                            <EventsProvider>
                                <FloatingProvider>
                                    <App />
                                </FloatingProvider>
                            </EventsProvider>
                        </FollowingProvider>
                    </NavProvider>
                </UsersProvider>
            </AuthProvider>
        </Provider>
    </BrowserRouter>
);
