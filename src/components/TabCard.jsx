import { useState } from "react";
import { Tabs, Tab, Card, Image } from "@heroui/react";
import styles from "./TabCard.module.css";
export default function TabbedCard() {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <Card className={styles.card}>
            {/* Tabs */}
            <Tabs
                selectedKey={selectedTab}
                onSelectionChange={setSelectedTab}
                variant="underlined"
                fullWidth={true}
                className={styles.tabs}
            >
                <Tab key="1" title="one" className={styles.tab}>
                    <div className={styles.tabContent}>
                        Content for Tab 1
                        <Image
                            alt="Card background"
                            className={styles.image}
                            src="https://heroui.com/images/hero-card-complete.jpeg"
                            width={270}
                        />
                    </div>
                </Tab>
                <Tab key="2" title="two" className={styles.tab}>
                    <div className={styles.tabContent}>Content for Tab 2</div>
                </Tab>
                <Tab key="3" title="three" className={styles.tab}>
                    <div className={styles.tabContent}>Content for Tab 3</div>
                </Tab>
            </Tabs>
        </Card>
    );
}
