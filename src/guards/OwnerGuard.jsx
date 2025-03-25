import React, { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser-new";
import { useEvent } from "../hooks/useEvent";

const OwnerGuard = ({ ownerId, children, mode = "route" }) => {
    const { currentUser, loading: userLoading } = useUser();
    const { eventId } = useParams();
    const { event, loading: eventLoading } = useEvent(eventId);
    const navigate = useNavigate();

    const [checked, setChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    const isOwner = ownerId
        ? currentUser?.id === ownerId
        : event && currentUser?.id === event?.createdBy;

    useEffect(() => {
        if (!userLoading && !eventLoading && currentUser) {
            if (isOwner) {
                setAuthorized(true);
            } else if (mode === "route") {
                navigate("/events", {
                    replace: true,
                    state: {
                        error: "You are not authorized to edit this event.",
                    },
                });
            }
            setChecked(true);
        }
    }, [
        userLoading,
        eventLoading,
        currentUser,
        event,
        isOwner,
        mode,
        navigate,
    ]);

    if (userLoading || eventLoading || !checked) return null;

    if (!authorized && mode !== "route") return null;

    return <>{children}</>;
};

export default OwnerGuard;
