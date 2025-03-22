import ButtonDynamic from "./ButtonDynamic";
import { useState, useEffect, useContext } from "react";
import styles from "./ButtonDynamicGroup.module.css";
import eventsApi from "../api/events-api";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Toast from "./Toast";
import { AuthContext } from "../contexts/authContext";
import { useFloatingContext } from "../contexts/floatingContext";
import { calcTrending } from "../../utils/calcTrending";

export default function ButtonDynamicGroup({
    pos,
    event,
    onModalOpen,
    disableExpand,
    disabled,
    mode = "single",
}) {
    const [toastMessage, setToastMessage] = useState("");
    const [isInterested, setIsInterested] = useState(false);
    const [isAttending, setIsAttending] = useState(false);

    const { userId } = useContext(AuthContext);
    const {
        selectedEvents,
        selectionMode,
        toggleSelectionMode,
        bulkUpdate,
        uniformAttending,
        uniformInterested,
    } = useFloatingContext();

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

            await calcTrending(event.id);

            const userUpdate = {
                attending: isAttending
                    ? arrayRemove(event.id)
                    : arrayUnion(event.id),
            };
            await updateDoc(doc(db, "users", userId), userUpdate);
            setIsAttending(!isAttending);
            setToastMessage(
                isAttending
                    ? "You are no longer attending this event."
                    : "You are now attending this event."
            );
            // setTrigger((prev) => prev + 1);
            console.log("User toggled attending status");
        } catch (error) {
            console.error("Error updating attending list:", error);
        }
    };

    const handleInterested = async () => {
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

            await calcTrending(event.id);

            const userUpdate = {
                interested: isInterested
                    ? arrayRemove(event.id)
                    : arrayUnion(event.id),
            };
            await updateDoc(doc(db, "users", userId), userUpdate);
            setIsInterested(!isInterested);
            setToastMessage(
                isInterested
                    ? "You are no longer interested in this event."
                    : "You are now interested in this event."
            );
            console.log("User toggled interested status");
        } catch (error) {
            console.error("Error updating interested list:", error);
        }
    };

    const handleCloseToast = () => {
        setToastMessage("");
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
            {toastMessage && (
                <Toast message={toastMessage} onClose={handleCloseToast} />
            )}
        </div>
    );
}
