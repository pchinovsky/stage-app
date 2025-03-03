import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { Button, Tooltip, Modal, Image, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import Accordeon from "../components/Accordeon";
import ButtonDynamicClick from "../components/ButtonDynamicClick";
import MultiAccordion from "../components/AccordeonMulti";
import CalendarDate from "../components/CalendarDate";

import styles from "./event.module.css";
import DefaultLayout from "../layouts/default";
import { FloatingCard } from "../components/FloatingCard";
import TooltipProfile from "../components/TooltipProfile";
import ModalProfile from "../components/ModalProfile";

export default function Event() {
    const { eventId } = useParams();
    const { events, loading, error } = useEvents({ id: eventId });

    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // if (loading) return <p className={styles.loading}>Loading...</p>;
    // if (error) return <p className={styles.error}>Error: {error.message}</p>;
    // if (!events.length)
    //     return <p className={styles.notFound}>Event not found.</p>;

    const event = events[0];

    const handleOpenModal = () => {
        console.log("Opening modal");
        setIsModalOpen(true);
    };

    return (
        <DefaultLayout>
            <div
                className={styles.eventDetails}
                style={{ position: "relative" }}
            >
                {loading ? (
                    <p className={styles.loading}>Loading...</p>
                ) : error ? (
                    <p className={styles.error}>Error: {error.message}</p>
                ) : !events.length ? (
                    <p className={styles.notFound}>Event not found.</p>
                ) : (
                    <>
                        <CalendarDate date={event.openingDateTime} />
                        <ButtonDynamicClick
                            top="600px"
                            left="100px"
                            text="Follow"
                            icon="mdi:bell-outline"
                        />
                        <ButtonDynamicClick
                            top="650px"
                            left="100px"
                            text="Interested"
                            icon="mdi:star-outline"
                        />
                        <ButtonDynamicClick
                            top="700px"
                            left="100px"
                            text="Attend"
                            icon="mdi:tick-outline"
                        />
                        {/* <ButtonDynamicClick></ButtonDynamicClick>
                        <ButtonDynamicClick></ButtonDynamicClick>
                        <ButtonDynamicClick></ButtonDynamicClick> */}
                        <h1 className="absolute top-[120px] left-[300px] z-[100] font-bold text-6xl">
                            {event.title}
                        </h1>
                        <h3 className="absolute top-[180px] left-[300px] z-[100] font-bold text-2xl">
                            {event.subtitle}
                        </h3>
                        <Tooltip
                            content={<TooltipProfile />}
                            onClick={handleOpenModal}
                            placement="bottom"
                            offset={1}
                            delay={0}
                            motionProps={{
                                variants: {
                                    exit: {
                                        opacity: 0,
                                        transition: {
                                            duration: 0.1,
                                            ease: "easeIn",
                                        },
                                    },
                                    enter: {
                                        opacity: 1,
                                        transition: {
                                            duration: 0.15,
                                            ease: "easeOut",
                                        },
                                    },
                                },
                            }}
                        >
                            <button
                                className="absolute top-[220px] left-[300px] z-[100] font-bold text-2xl cursor-pointer"
                                onClick={() => setIsModalOpen(true)}
                            >
                                {event.venue}
                            </button>
                        </Tooltip>
                        <Image
                            src={event.image}
                            alt={event.title}
                            className={styles.image}
                        />
                        <FloatingCard className="absolute top-[500px] left-20 w-60 p-4 z-[100]">
                            <div className="flex items-center gap-2">
                                <Icon
                                    icon="lucide:zap"
                                    className="text-yellow-500"
                                />
                                <span>{event.title}</span>
                            </div>
                        </FloatingCard>

                        <MultiAccordion
                            sections={[
                                {
                                    title: "Description",
                                    content: "An amazing event happening soon!",
                                },
                                {
                                    title: "Event Statistics",
                                    content: "Attendees: 340, Interested: 1200",
                                },
                                {
                                    title: "Venue",
                                    content: "The Grand Arena, New York",
                                },
                            ]}
                            className="absolute top-[300px] left-[700px] z-[100]"
                        />
                        <ModalProfile
                            profile={{
                                name: event.venue,
                                image: "https://sarieva.org/data/i/2022-ECHO.jpg",
                                description:
                                    "This is an amazing venue for events.",
                            }}
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </>
                )}
            </div>
        </DefaultLayout>
    );
}
