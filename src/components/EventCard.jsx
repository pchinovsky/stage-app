import { useContext, useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Image,
    Divider,
    Badge,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AuthContext } from "../contexts/authContext";
import { useFloatingContext } from "../contexts/floatingContext";
import styles from "./EventCard.module.css";

export default function EventCard({ event, onPress }) {
    const [interested, setInterested] = useState(false);
    const [attending, setAttending] = useState(false);

    const { userId } = useContext(AuthContext);
    const { selectionMode, selectedEvents, toggleEventSelection, applied } =
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

    const formattedDate = new Date(event.openingDate);

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
            className={`right-[39px] top-7 z-[1000] p-1.5 bg-white rounded-md border-0 border-blue-500 transition-all ease-in-out duration-500 ${
                applied ? "delay-500" : ""
            }`}
            isInvisible={!isSelected}
        >
            <Card
                isPressable={true}
                className={`${styles.card} ${isSelected ? styles.selected : ""}`}
                onPress={handlePress}
                classNames={{
                    header: "p-4 py-3 bg-background/60 backdrop-blur-md hover:bg-white transition-all ease-in-out duration-500",
                }}
            >
                <CardHeader className={styles.cardHeader}>
                    <h4 className={styles.textLarge}>{event?.title}</h4>
                    <small className={styles.textDefault}>
                        {event?.categories.join(", ")}
                    </small>
                    <Divider className="my-4"></Divider>
                    <div className="mt-auto flex gap-2 items-end">
                        <span className="text-lg font-bold text-blue-600 mb-[-2px]">
                            {formattedDate.getDate()}
                        </span>
                        <span className="text-md font-semibold">
                            {formattedDate.toLocaleString("en-US", {
                                month: "short",
                            })}
                        </span>
                    </div>
                </CardHeader>
                <CardBody className={styles.cardBody}>
                    <Image
                        alt={event?.title}
                        className={styles.image}
                        src={event?.image}
                        width={470}
                        height={260}
                    />
                </CardBody>
            </Card>
        </Badge>
    );
}
