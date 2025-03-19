import React from "react";
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

export default function EventCard({ event, onPress }) {
    const { selectionMode, selectedEvents, toggleEventSelection } =
        useFloatingContext();
    const isSelected = selectedEvents.includes(event.id);

    const handlePress = () => {
        if (selectionMode) {
            toggleEventSelection(event.id);
        } else {
            onPress(event.id);
        }
    };

    return (
        <Badge
            content={<Icon icon="ci:check" width="24" height="24" />}
            color="primary"
            variant="flat"
            placement="top-right"
            shape="rectangle"
            size="sm"
            className="right-1 top-1 z-[1000] p-0 bg-white border-2 border-blue-500"
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
