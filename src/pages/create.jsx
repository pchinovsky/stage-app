import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import styles from "./create.module.css";
import EventCard from "../components/EventCard";
import TabbedCard from "../components/TabCard";

export default function CreatePage() {
    return (
        <DefaultLayout>
            <div className={styles.headingContainer}>
                <h1 className={title()}>Create</h1>
            </div>
            <div className={styles.cardsContainer}>
                <EventCard />
                <EventCard />
                <EventCard />
                <TabbedCard />
            </div>
            <section className={styles.section}></section>
        </DefaultLayout>
    );
}
