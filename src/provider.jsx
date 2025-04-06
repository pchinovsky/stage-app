import { useHref, useNavigate } from "react-router-dom";
import { NavProvider } from "./contexts/navContext.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { UsersProvider } from "./contexts/usersContext.jsx";
import { ErrorProvider } from "./contexts/errorContext.jsx";
import { ToastProvider } from "./contexts/toastContext.jsx";
import { HeroUIProvider } from "@heroui/system";
import { EventsProvider } from "./contexts/eventsContext.jsx";
import { FloatingProvider } from "./contexts/floatingContext.jsx";
import { FollowingProvider } from "./contexts/followingContext.jsx";

export function Provider({ children }) {
    const navigate = useNavigate();

    return (
        <HeroUIProvider navigate={navigate} useHref={useHref}>
<<<<<<< HEAD
            <AuthProvider>
                <ErrorProvider>
                    <ToastProvider>
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
                    </ToastProvider>
                </ErrorProvider>
            </AuthProvider>
=======
            <ErrorProvider>
                <AuthProvider>
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
                </AuthProvider>
            </ErrorProvider>
>>>>>>> parent of a7bf5a5 (Fixing NonAuthGuard to ref flags.)
        </HeroUIProvider>
    );
}
