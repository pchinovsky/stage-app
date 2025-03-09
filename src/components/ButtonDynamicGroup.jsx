import ButtonDynamicClick from "./ButtonDynamicClick";
import ButtonDynamic from "./ButtonDynamic";
import styles from "./ButtonDynamicGroup.module.css";

export default function ButtonDynamicGroup() {
    return (
        <div className={styles.buttonGroup}>
            <ButtonDynamic text="Follow" icon="mdi:bell-outline" />
            <ButtonDynamic text="Interested" icon="mdi:star-outline" />
            <ButtonDynamic text="Attend" icon="mdi:tick-outline" />
        </div>
    );
}
