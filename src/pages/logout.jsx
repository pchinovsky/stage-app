import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useAuth";

export default function LogoutPage() {
    const logout = useLogout();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await logout();
            navigate("/events", { replace: true });
        })();
    }, [logout, navigate]);

    return <div>Logging out...</div>;
}
