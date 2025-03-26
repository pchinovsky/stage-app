import React, { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser-new";
import { useEvent } from "../hooks/useEvent";
import { useLocation } from "react-router-dom";

const OwnerGuard = ({ ownerId, children, mode = "route" }) => {
    const { currentUser, loading: userLoading } = useUser();
    const { eventId } = useParams();
    const { event, loading: eventLoading } = useEvent(eventId);
    const navigate = useNavigate();
    const location = useLocation();

    const [checked, setChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const isOwner = ownerId
        ? currentUser?.id === ownerId
        : event && currentUser?.id === event?.createdBy;

    useEffect(() => {
        if (!userLoading && !eventLoading && currentUser) {
            if (isOwner) {
                setAuthorized(true);
            }
            setChecked(true);
        }
    }, [userLoading, eventLoading, currentUser, event, isOwner]);

    if (!authorized && mode === "route" && checked) {
        return (
            <Navigate
                to="/events"
                replace
                state={{
                    from: location,
                    error: "You are not authorized to edit this event.",
                }}
            />
        );
    }

    if (userLoading || eventLoading || !checked) return null;

    if (!authorized && mode !== "route") return null;

    return <>{children}</>;
};

export default OwnerGuard;
