import HeaderNav from "../components/HeaderNav";
import ErrorModal from "../components/ModalError";
import styles from "./default.module.css";

export default function DefaultLayout({ children }) {
    return (
        <div className={styles.layout}>
            <HeaderNav />
            <ErrorModal />
            <main className={styles.main}>{children}</main>
        </div>
    );
}
