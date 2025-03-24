import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,
} from "@heroui/react";
import styles from "./EventInfo.module.css";

export default function EventInfo({ event }) {
    return (
        <Card
            className={styles.card}
            style={{
                position: "absolute",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
        >
            <CardHeader className={styles.cardHeader}>
                <div className={styles.headerContent}>
                    <p className={styles.title}>{event?.title}</p>
                    <p className={styles.subtitle}>{event?.subtitle}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className={styles.cardBody}>
                <p>
                    {event?.description.length > 100
                        ? event?.description.substring(0, 100) + "..."
                        : event?.description}
                </p>
            </CardBody>
            <Divider />
            <CardFooter className={styles.cardFooter}>
                <Link
                    isExternal
                    showAnchorIcon
                    href={event?.associatedLinks[0]}
                >
                    Learn more.
                </Link>
            </CardFooter>
        </Card>
    );
}
