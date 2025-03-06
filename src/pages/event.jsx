import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { Button, Tooltip, Modal, Image, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import Accordeon from "../components/Accordeon";
import ButtonDynamicClick from "../components/ButtonDynamicClick";
import MultiAccordion from "../components/AccordeonMulti";
import CalendarDate from "../components/CalendarDate";
import CalendarModal from "../components/Calendar";

import styles from "./event.module.css";
import DefaultLayout from "../layouts/default";
import { FloatingCard } from "../components/FloatingCard";
import TooltipProfile from "../components/TooltipProfile";
import ModalProfile from "../components/ModalProfile";
import ModalProfileCustom from "../components/ModalProfileCustom";
import Engaged from "../components/Engaged";
import Toggle from "../components/Toggle";
import Discussion from "../components/Discussion";
import { useArtists } from "../hooks/useArtists";
import { useVenue } from "../hooks/useVenue";
import ArtistList from "../components/ArtistList";
import SlidingSidebar from "../components/Sidebar";
import StatsBox from "../components/Stats";

export default function Event() {
    const { eventId } = useParams();
    const { events, loading, error } = useEvents({ id: eventId });

    const event = events[0];

    const [artistIds, setArtistIds] = useState(null);
    const [venueId, setVenueId] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [sidebarData, setSidebarData] = useState(null);
    const [tooltipExitDelay, setTooltipExitDelay] = useState(500);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        if (!loading && events.length > 0) {
            const event = events[0];
            setArtistIds(event.artists || []);
            setVenueId(event.venue || null);
        }
    }, [loading, events]);

    const { artists, loading: artistsLoading } = useArtists(artistIds);
    const { venue, loading: venueLoading } = useVenue(venueId);

    useEffect(() => {
        if (!event || artistsLoading || venueLoading) return;

        setSidebarData({
            artists: artists || [],
            categories: event.categories || [],
            createdBy: event.createdBy || "",
            venue: venue || "",
        });
    }, [event, artists, venue, artistsLoading, venueLoading]);

    console.log("artists", artists);
    console.log("venue", venue);

    // const sidebarData = {
    //     artists: artists || [],
    //     categories: event.categories || [],
    //     createdBy: event.createdBy || "",
    //     venue: venue || "",
    // };

    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPanel, setSelectedPanel] = useState("About");

    const handleOpenModal = (content) => {
        setTooltipExitDelay(0);
        setModalContent(content);
        setIsModalOpen(true);
        setTimeout(
            () => console.log("- Modal State AFTER update -", isModalOpen),
            0
        );
    };

    const handleCloseModal = () => {
        console.log("Closing modal");
        setIsModalOpen(false);
        setModalContent(null);
        setTooltipExitDelay(500);
    };

    const [comments, setComments] = useState([
        {
            text: "Great stuff!",
            user: { name: "Agent", avatar: "https://i.pravatar.cc/40?img=1" },
        },
        {
            text: "Looking forward to booze!",
            user: { name: "Lobster", avatar: "https://i.pravatar.cc/40?img=2" },
        },
        {
            text: "Looking forward to booze!",
            user: { name: "Lobster", avatar: "https://i.pravatar.cc/40?img=2" },
        },
    ]);

    const addComment = (text) => {
        setComments([
            ...comments,
            {
                text,
                user: { name: "You", avatar: "https://i.pravatar.cc/40?img=3" },
            },
        ]);
    };

    const statsData = [
        {
            label: "Attendees",
            value: "340",
            description: "People attending",
            icon: "mdi:account-group",
        },
        {
            label: "Interested",
            value: "1.2K",
            description: "People interested",
            icon: "mdi:star-outline",
        },
        {
            label: "Events Hosted",
            value: "58",
            description: "Total events organized",
            icon: "mdi:calendar-check",
        },
    ];

    const yourEvents = [
        { title: "Art Show-mow", date: "2025-03-10" },
        { title: "Music Festival-val", date: "2025-03-15" },
    ];

    const followedUsersEvents = [
        { title: "Gallery Opening with Protein Bars", date: "2025-03-12" },
        {
            title: "Tech Meetup with Bear Grills eating eyeballs",
            date: "2025-03-20",
        },
    ];

    console.log("calendar open - ", isCalendarOpen);

    return (
        <DefaultLayout>
            <div
                className={styles.eventContainer}
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
                        <CalendarDate
                            date={event.openingDateTime}
                            onPress={setIsCalendarOpen}
                        />
                        <CalendarModal
                            isOpen={isCalendarOpen}
                            onClose={() => setIsCalendarOpen(false)}
                            events={events}
                            followedEvents={followedUsersEvents}
                        />
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
                        <h1 className="absolute top-[120px] left-[250px] z-[100] font-bold text-6xl">
                            {event.title}
                        </h1>
                        <h3 className="absolute top-[180px] left-[250px] z-[100] font-bold text-2xl">
                            {event.subtitle}
                        </h3>
                        <Tooltip
                            content={
                                <TooltipProfile
                                    data={venue}
                                    onClick={() => handleOpenModal(venue)}
                                />
                            }
                            key={isModalOpen ? "closed" : "open"}
                            isOpen={isModalOpen ? false : undefined}
                            placement="bottom"
                            offset={1}
                            delay={0}
                            motionProps={{
                                variants: {
                                    exit: {
                                        opacity: 0,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeIn",
                                        },
                                    },
                                    enter: {
                                        opacity: 1,
                                        transition: {
                                            duration: 0.7,
                                            ease: "easeOut",
                                        },
                                    },
                                },
                            }}
                            className="py-0 px-0"
                        >
                            <button
                                className="absolute top-[220px] left-[250px] z-[100] font-bold text-blue-600 text-2xl cursor-pointer"
                                onClick={() => handleOpenModal(venue)}
                            >
                                {venueLoading ? "Loading venue..." : venue.name}
                            </button>
                        </Tooltip>
                        {/* Artists Section */}
                        {artistsLoading ? (
                            <p>Loading artists...</p>
                        ) : (
                            <ArtistList
                                artists={artists}
                                onClick={(artist) => handleOpenModal(artist)}
                                exitDelay={tooltipExitDelay}
                                isModalOpen={isModalOpen}
                            />
                        )}
                        <Engaged
                            author={{
                                id: 1,
                                name: "Gosho",
                                image: "https://example.com/john.jpg",
                            }}
                            attending={[
                                {
                                    id: 2,
                                    name: "Ghee",
                                    image: "https://example.com/alice.jpg",
                                },
                                {
                                    id: 3,
                                    name: "Joo",
                                    image: "https://example.com/bob.jpg",
                                },
                            ]}
                            interested={[
                                {
                                    id: 4,
                                    name: "Faint",
                                    image: "https://example.com/charlie.jpg",
                                },
                            ]}
                        />
                        <Image
                            src={event.image}
                            alt={event.title}
                            className={styles.image}
                        />
                        <StatsBox stats={statsData} />;
                        <SlidingSidebar event={event} venue={venue} />
                        {/* <FloatingCard className="absolute top-[500px] left-20 w-60 p-4 z-[100]">
                            <div className="flex items-center gap-2">
                                <Icon
                                    icon="lucide:zap"
                                    className="text-yellow-500"
                                />
                                <span>{event.title}</span>
                            </div>
                        </FloatingCard> */}
                        {/* <MultiAccordion
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
                        /> */}
                        {/* <ModalProfile
                            profile={{
                                name: event.venue,
                                image: "https://sarieva.org/data/i/2022-ECHO.jpg",
                                description:
                                    "This is an amazing venue for events.",
                            }}
                            isOpen={true}
                            onClose={() => setIsModalOpen(false)}
                        /> */}
                        {/* always-visible modal */}
                        {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h2 className="text-xl font-bold">
                                    Test Modal
                                </h2>
                                <p>This modal should always be visible.</p>
                                <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                                    Close
                                </button>
                            </div>
                        </div> */}
                        <ModalProfileCustom
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            title="Information"
                            className="z-[1000]"
                            data={modalContent}
                        ></ModalProfileCustom>
                        {/* <Discussion
                            comments={comments}
                            onAddComment={addComment}
                        /> */}
                        <Toggle
                            options={["About", "Discussion"]}
                            onChange={(panel) => setSelectedPanel(panel)}
                        />
                        <motion.div
                            key={selectedPanel}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-[300px] left-[810px] z-[100]"
                        >
                            {selectedPanel === "About" ? (
                                <MultiAccordion
                                    sections={[
                                        {
                                            title: "Description",
                                            content: event.description,
                                        },
                                        {
                                            title: "Related Content",
                                            content: event.associatedLinks,
                                        },
                                        {
                                            title: "Venue",
                                            content:
                                                "The Grand Arena, New York",
                                        },
                                    ]}
                                />
                            ) : (
                                <Discussion
                                    comments={comments}
                                    onAddComment={addComment}
                                />
                            )}
                        </motion.div>
                    </>
                )}
            </div>
        </DefaultLayout>
    );
}
