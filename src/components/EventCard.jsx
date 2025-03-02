import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Image,
    Button,
    Divider,
} from "@heroui/react";
import styles from "./EventCard.module.css";

export default function EventCard({ event }) {
    return (
        <Card isPressable={true} className={styles.card}>
            <CardHeader className={styles.cardHeader}>
                <h4 className={styles.textLarge}>{event.title}</h4>
                <small className={styles.textDefault}>
                    {event.categories.join(", ")}
                </small>
                <Divider className="my-4"></Divider>
                <p className={styles.description}>{event.description}</p>
            </CardHeader>
            <CardBody className={styles.cardBody}>
                <Image
                    alt={event.title}
                    className={styles.image}
                    src={event.image || "https://via.placeholder.com/370"}
                    width={370}
                    height={235}
                />
                {/* <Button size="sm" className="mt-4">
                    View Details
                </Button> */}
            </CardBody>
        </Card>
    );
}
