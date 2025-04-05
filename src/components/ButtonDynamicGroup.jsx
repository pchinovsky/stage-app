import { useState, useEffect, useContext } from "react";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { increment } from "firebase/firestore";

import styles from "./ButtonDynamicGroup.module.css";
import authApi from "../api/auth-api";
import eventsApi from "../api/events-api";
import ButtonDynamic from "./ButtonDynamic";
import { AuthContext } from "../contexts/authContext";
import { useFloatingContext } from "../contexts/floatingContext";
import { useError } from "../contexts/errorContext";
import { useToast } from "../contexts/toastContext";
import { calcTrending } from "../../utils/calcTrending";

export default function ButtonDynamicGroup({
    pos,
    event,
    onModalOpen,
    disableExpand,
    disabled,
    mode = "single",
}) {
    const { showToast } = useToast();
    const { showError } = useError();
    const [isInterested, setIsInterested] = useState(false);
    const [isAttending, setIsAttending] = useState(false);

    const { userId } = useContext(AuthContext);
    const { selectionMode, bulkUpdate, setApplied } = useFloatingContext();

    useEffect(() => {
        if (event) {
            setIsInterested(event.interested?.includes(userId));
            setIsAttending(event.attending?.includes(userId));
        }
    }, [event, userId]);

    const handleAttend = async () => {
        if (mode === "bulk") {
            bulkUpdate("attending");
            return;
        }
        try {
            const updatedEvent = {
                attending: isAttending
                    ? arrayRemove(userId)
                    : arrayUnion(userId),
                attendingCount: isAttending ? increment(-1) : increment(1),
            };
            if (isAttending && !isInterested) {
                updatedEvent.involvedUsers = arrayRemove(userId);
            } else if (!isAttending) {
                updatedEvent.involvedUsers = arrayUnion(userId);
            }
            await eventsApi.updateEvent(event.id, updatedEvent);

            await calcTrending(event);

            await authApi.updateUser(userId, {
                attending: isAttending
                    ? arrayRemove(event.id)
                    : arrayUnion(event.id),
            });
            setIsAttending(!isAttending);
            showToast(
                isAttending
                    ? "You are no longer attending this event."
                    : "You are now attending this event."
            );
        } catch (error) {
            console.error("Error updating attending list:", error);
            showError(
                error.message || "An error occurred while updating attendance."
            );
        }
    };

    const handleInterested = async () => {
        setApplied(true);
        if (mode === "bulk") {
            bulkUpdate("interested");
            return;
        }
        try {
            const updatedEvent = {
                interested: isInterested
                    ? arrayRemove(userId)
                    : arrayUnion(userId),
                interestedCount: isInterested ? increment(-1) : increment(1),
            };
            if (isInterested && !isAttending) {
                updatedEvent.involvedUsers = arrayRemove(userId);
            } else if (!isInterested) {
                updatedEvent.involvedUsers = arrayUnion(userId);
            }
            await eventsApi.updateEvent(event.id, updatedEvent);

            await calcTrending(event);

            await authApi.updateUser(userId, {
                interested: isInterested
                    ? arrayRemove(event.id)
                    : arrayUnion(event.id),
            });
            setIsInterested(!isInterested);
            showToast(
                isInterested
                    ? "You are no longer interested in this event."
                    : "You are now interested in this event."
            );
        } catch (error) {
            console.error("Error updating interested list:", error);
            showError(
                error.message || "An error occurred while updating interest."
            );
        }
    };

    return (
        <div
            className={`${styles.buttonGroup} ${pos.top} ${pos.left} ${pos.flex}`}
        >
            {!disableExpand && (
                <ButtonDynamic
                    text="Invite"
                    icon="tabler:user-plus"
                    width="24"
                    height="24"
                    onPress={onModalOpen}
                    disableExpand={disableExpand}
                />
            )}
            <ButtonDynamic
                text="Interested"
                icon="fa6-regular:star"
                width="576"
                height="512"
                onPress={handleInterested}
                style={{ color: isInterested ? "blue" : "inherit" }}
                disableExpand={disableExpand}
                disabled={disabled?.interested}
                selectionMode={selectionMode}
                selection={disabled?.selection}
            />
            <ButtonDynamic
                text="Attend"
                icon="fa6-regular:circle-check"
                width="512"
                height="512"
                onPress={handleAttend}
                style={{ color: isAttending ? "blue" : "inherit" }}
                disableExpand={disableExpand}
                disabled={disabled?.attending}
                selectionMode={selectionMode}
                selection={disabled?.selection}
            />
        </div>
    );
}
