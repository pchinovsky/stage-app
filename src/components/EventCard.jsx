import React, { useContext, useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Image,
    Button,
    Divider,
    Skeleton,
    Badge,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import styles from "./EventCard.module.css";
import { useFloatingContext } from "../contexts/floatingContext";
import { AuthContext } from "../contexts/authContext";

export default function EventCard({ event, onPress }) {
    const { userId } = useContext(AuthContext);
    const [interested, setInterested] = useState(false);
    const [attending, setAttending] = useState(false);

    const { selectionMode, selectedEvents, toggleEventSelection } =
        useFloatingContext();
    const isSelected = selectedEvents.includes(event.id);

    useEffect(() => {
        setInterested(event.interested.includes(userId));
        setAttending(event.attending.includes(userId));
    }, [event]);

    const handlePress = () => {
        if (selectionMode) {
            toggleEventSelection(event.id);
        } else {
            onPress(event.id);
        }
    };

    return (
        <Badge
            content={
                <div className="flex gap-1">
                    <Icon
                        icon="fa6-regular:star"
                        width="18"
                        height="18"
                        className={
                            interested ? "text-blue-500" : "text-gray-400"
                        }
                    />
                    <Icon
                        icon="fa6-regular:circle-check"
                        width="18"
                        height="18"
                        className={
                            attending ? "text-blue-500" : "text-gray-400"
                        }
                    />
                </div>
            }
            color="primary"
            variant="flat"
            placement="top-right"
            shape="rectangle"
            size="sm"
            className="right-12 top-1 z-[1000] p-1.5 bg-white border-2 border-blue-500"
            isInvisible={!isSelected}
        >
            <Card
                isPressable={true}
                // className={styles.card}
                className={`${styles.card} ${isSelected ? styles.selected : ""}`}
                // onPress={() => onPress(event.id)}
                onPress={handlePress}
            >
                <CardHeader className={styles.cardHeader}>
                    <h4 className={styles.textLarge}>{event?.title}</h4>
                    <small className={styles.textDefault}>
                        {event?.categories.join(", ")}
                    </small>
                    <Divider className="my-4"></Divider>
                    <p className={styles.description}>{event?.description}</p>
                </CardHeader>
                <CardBody className={styles.cardBody}>
                    <Image
                        alt={event?.title}
                        className={styles.image}
                        src={event?.image || "https://via.placeholder.com/370"}
                        width={370}
                        height={235}
                    />
                </CardBody>
            </Card>
        </Badge>
    );
}
