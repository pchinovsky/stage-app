import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function NonAuthGuard({ children }) {
    const { isAuth } = useContext(AuthContext);
    const location = useLocation();
    const { pathname } = location;

    if (isAuth) {
        const errorMessage =
            pathname === "/login"
                ? "You are already logged in. Please log out to access the login page."
                : "You are already registered. Please log out to create a new account.";

        return (
            <Navigate
                to="/"
                replace
                state={{
                    from: location,
                    error: errorMessage,
                }}
            />
        );
    }

    return children;
}
