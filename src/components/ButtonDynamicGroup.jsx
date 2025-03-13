import ButtonDynamic from "./ButtonDynamic";
import { useState, useEffect } from "react";
import styles from "./ButtonDynamicGroup.module.css";
import eventsApi from "../api/events-api";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import Toast from "./Toast";

export default function ButtonDynamicGroup({
    user,
    event,
    onModalOpen,
    setTrigger,
}) {
    const [toastMessage, setToastMessage] = useState("");
    const [isInterested, setIsInterested] = useState(false);
    const [isAttending, setIsAttending] = useState(false);

    useEffect(() => {
        if (event) {
            setIsInterested(event.interested?.includes(user.id));
            setIsAttending(event.attending?.includes(user.id));
        }
    }, [event, user.id]);

    const handleAttend = async () => {
        try {
            const updatedEvent = {
                attending: isAttending
                    ? arrayRemove(user.id)
                    : arrayUnion(user.id),
            };
            await eventsApi.updateEvent(event.id, updatedEvent);
            setIsAttending(!isAttending);
            setToastMessage(
                isAttending
                    ? "You are no longer attending this event."
                    : "You are now attending this event."
            );
            setTrigger((prev) => prev + 1);
            console.log("User toggled attending status");
        } catch (error) {
            console.error("Error updating attending list:", error);
        }
    };

    const handleInterested = async () => {
        try {
            const updatedEvent = {
                interested: isInterested
                    ? arrayRemove(user.id)
                    : arrayUnion(user.id),
            };
            await eventsApi.updateEvent(event.id, updatedEvent);
            setIsInterested(!isInterested);
            setToastMessage(
                isInterested
                    ? "You are no longer interested in this event."
                    : "You are now interested in this event."
            );
            setTrigger((prev) => prev + 1);
            console.log("User toggled interested status");
        } catch (error) {
            console.error("Error updating interested list:", error);
        }
    };

    const handleCloseToast = () => {
        setToastMessage("");
    };

    return (
        <div className={styles.buttonGroup}>
            <ButtonDynamic
                text="Invite"
                icon="tabler:user-plus"
                width="24"
                height="24"
                onPress={onModalOpen}
            />
            <ButtonDynamic
                text="Interested"
                icon="fa6-regular:star"
                width="576"
                height="512"
                onPress={handleInterested}
                style={{ color: isInterested ? "blue" : "inherit" }}
            />
            <ButtonDynamic
                text="Attend"
                icon="fa6-regular:circle-check"
                width="512"
                height="512"
                onPress={handleAttend}
                style={{ color: isAttending ? "blue" : "inherit" }}
            />
            {toastMessage && (
                <Toast message={toastMessage} onClose={handleCloseToast} />
            )}
        </div>
    );
}
