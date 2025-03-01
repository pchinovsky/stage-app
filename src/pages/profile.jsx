import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import TabbedCard from "../components/TabCard";
import styles from "./profile.module.css";

export default function Profile() {
    return (
        <DefaultLayout>
            <section className={styles.profileSection}>
                <div className={styles.headingContainer}>
                    <h1 className={title()}>Profile</h1>
                </div>
            </section>
            <TabbedCard />
        </DefaultLayout>
    );
}
