import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { NavProvider } from "./contexts/navContext.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { FollowingProvider } from "./contexts/followingContext.jsx";
import { FloatingProvider } from "./contexts/floatingContext.jsx";
import { EventsProvider } from "./contexts/eventsContext.jsx";
import { UsersProvider } from "./contexts/usersContext.jsx";
import { ErrorProvider } from "./contexts/errorContext.jsx";

export function Provider({ children }) {
    const navigate = useNavigate();

    return (
        <HeroUIProvider navigate={navigate} useHref={useHref}>
            <AuthProvider>
                <ErrorProvider>
                    <UsersProvider>
                        <NavProvider>
                            <FollowingProvider>
                                <EventsProvider>
                                    <FloatingProvider>
                                        {children}
                                    </FloatingProvider>
                                </EventsProvider>
                            </FollowingProvider>
                        </NavProvider>
                    </UsersProvider>
                </ErrorProvider>
            </AuthProvider>
        </HeroUIProvider>
    );
}
