import { Link } from "@heroui/link";
import HeaderNav from "../components/HeaderNav";
import SlidingSidebar from "../components/Sidebar";
import styles from "./default.module.css";

export default function DefaultLayout({ children }) {
    return (
        <div className={styles.layout}>
            <HeaderNav />
            {/* <SlidingSidebar /> */}
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <Link
                    isExternal
                    className={styles.footerLink}
                    href="https://heroui.com"
                    title="heroui.com homepage"
                >
                    <span className={styles.footerText}>Powered by</span>
                    <p className={styles.brand}>Pesho</p>
                </Link>
            </footer>
        </div>
    );
}
