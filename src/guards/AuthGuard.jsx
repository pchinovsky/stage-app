import React, { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children }) => {
    const { user, authLoading } = useContext(AuthContext);
    const location = useLocation();

    if (authLoading) return null;

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                    error: "Please log in to access this page.",
                }}
            />
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
