import ButtonDynamic from "./ButtonDynamic";
import styles from "./ButtonDynamicGroup.module.css";

export default function ButtonDynamicGroup({ user, event, onModalOpen }) {
    return (
        <div className={styles.buttonGroup}>
            <ButtonDynamic
                text="Invite"
                icon="tabler:user-plus"
                width="24"
                height="24"
                onPress={onModalOpen}
            />
            <ButtonDynamic
                text="Interested"
                icon="fa6-regular:star"
                width="576"
                height="512"
            />
            <ButtonDynamic
                text="Attend"
                icon="fa6-regular:circle-check"
                width="512"
                height="512"
            />
        </div>
    );
}
