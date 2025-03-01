import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
// import {
//     Card,
//     CardHeader,
//     CardBody,
//     CardFooter,
// } from "@heroui/card";
import styles from "./index.module.css";
import DropdownEl from "@/Dropdown";
import EventCard from "../components/EventCard";
import HeaderNav from "../components/HeaderNav";
import TabbedCard from "../components/TabCard";
import FloatingControls from "../components/FloatingControls";
import { useState } from "react";

export default function IndexPage() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const closeModal = () => setIsModalOpen(false);
    const [isOpen, setIsOpen] = useState(false);

    const pos1 = {
        top: "100px",
        left: "100px",
    };
    const pos2 = {
        top: "300px",
        left: "100px",
    };

    return (
        <DefaultLayout>
            {/* <Button color="secondary">NOPE</Button> */}

            <FloatingControls pos={pos1} />
            <FloatingControls pos={pos2} />
            {/* <HeaderNav></HeaderNav> */}
            {/* <div className={styles.container}>
            
                <TabbedCard></TabbedCard>
            </div> */}
        </DefaultLayout>
    );
}
