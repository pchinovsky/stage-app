import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,
} from "@heroui/react";
import styles from "./EventInfo.module.css";

export default function EventInfo() {
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
                    <p className={styles.title}>HeroUI</p>
                    <p className={styles.subtitle}>heroui.com</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className={styles.cardBody}>
                <p>
                    Make beautiful websites regardless of your design
                    experience.
                </p>
            </CardBody>
            <Divider />
            <CardFooter className={styles.cardFooter}>
                <Link
                    isExternal
                    showAnchorIcon
                    href="https://github.com/heroui-inc/heroui"
                >
                    Visit source code on GitHub.
                </Link>
            </CardFooter>
        </Card>
    );
}
