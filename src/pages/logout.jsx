import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useAuth";
import { AuthContext } from "../contexts/authContext";

export default function LogoutPage() {
    const { justLogRef, justRegRef, accessRegRef, accessLogRef } =
        useContext(AuthContext);
    const logout = useLogout();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await logout();

<<<<<<< HEAD
=======
            justLogRef.current = false;
            justRegRef.current = false;
>>>>>>> parent of a7bf5a5 (Fixing NonAuthGuard to ref flags.)
            accessLogRef.current = false;
            accessRegRef.current = false;

            navigate("/events", { replace: true });
        })();
    }, [logout, navigate]);

    return <div>Logging out...</div>;
}
