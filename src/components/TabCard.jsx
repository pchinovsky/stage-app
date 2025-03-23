import { useState } from "react";
import { Tabs, Tab, Card, Tooltip, Button, Skeleton } from "@heroui/react";
import styles from "./TabCard.module.css";
import ProfileCard from "./ProfileCard";
import { useArtists } from "../hooks/useArtists";
import { useVenues } from "../hooks/useVenues";
import { useEventsStore } from "../contexts/eventsContext";

export default function TabbedCard() {
    const [selectedTab, setSelectedTab] = useState(0);
    const { events, loading: eventsLoading } = useEventsStore();
    const { artists, loading: artistsLoading } = useArtists();
    const { venues, loading: venuesLoading } = useVenues();

    const activeArtists = artists.map((artist) => {
        const activityCount = events.filter((event) =>
            event.artists.includes(artist.id)
        ).length;
        return { ...artist, activityCount };
    });

    const sortedArtists = activeArtists.sort(
        (a, b) => b.activityCount - a.activityCount
    );

    const activeVenues = venues.map((venue) => {
        const activityCount = events.filter((event) =>
            event.venue.includes(venue.id)
        ).length;
        return { ...venue, activityCount };
    });

    const sortedVenues = activeVenues.sort(
        (a, b) => b.activityCount - a.activityCount
    );

    const sortedEvents = [...events].sort((a, b) => {
        return b.createdAt.toDate() - a.createdAt.toDate();
    });

    return (
        <Card className={styles.card}>
            {/* Tabs */}
            <Tabs
                selectedKey={selectedTab}
                onSelectionChange={setSelectedTab}
                variant="underlined"
                fullWidth={true}
                className={styles.tabs}
                classNames={{
                    cursor: "w-1 h-1 rounded-full bg-blue-500 mb-0",
                    tab: "pb-3 h-5",
                    tabContent: "text-gray-400 font-bold text-tiny",
                }}
            >
                <Tab key="1" title="active venue" className={styles.tab}>
                    <div className={styles.tabContent}>
                        {venuesLoading ? (
                            <div className="">
                                <Skeleton className="rounded-xl rounded-b-2xl mt-[-5px]">
                                    <div
                                        style={{
                                            width: "350px",
                                            height: "85px",
                                        }}
                                    />
                                </Skeleton>
                            </div>
                        ) : (
                            <Tooltip
                                content={
                                    <div className="flex flex-col justify-start gap-4 p-2">
                                        <div className="text-small font-bold text-gray-700">
                                            {sortedVenues[0].name}
                                        </div>
                                        <div className="text-tiny text-gray-500">
                                            {sortedVenues[0].description
                                                .length > 100
                                                ? sortedVenues[0].description.substring(
                                                      0,
                                                      100
                                                  ) + "..."
                                                : sortedVenues[0].description}
                                        </div>
                                    </div>
                                }
                                placement="left"
                                showArrow={true}
                                size="md"
                                className="w-[200px] h-[138px] flex justify-start items-start"
                                offset={20}
                                crossOffset={-18}
                            >
                                <div className="cursor-pointer mt-[-5px]">
                                    <ProfileCard
                                        data={sortedVenues[0]}
                                        size={{
                                            width: "350px",
                                            height: "85px",
                                        }}
                                    />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                </Tab>
                <Tab key="2" title="active artist" className={styles.tab}>
                    <div className={styles.tabContent}>
                        {artistsLoading ? (
                            <div className="">
                                <Skeleton className="rounded-xl rounded-b-2xl mt-[-5px]">
                                    <div
                                        style={{
                                            width: "350px",
                                            height: "85px",
                                        }}
                                    />
                                </Skeleton>
                            </div>
                        ) : (
                            <Tooltip
                                content={
                                    <div className="flex flex-col justify-start gap-4 p-2">
                                        <div className="text-small font-bold text-gray-700">
                                            {sortedArtists[0].name}
                                        </div>
                                        <div className="text-tiny text-gray-500">
                                            {sortedArtists[0].description
                                                .length > 100
                                                ? sortedArtists[0].description.substring(
                                                      0,
                                                      100
                                                  ) + "..."
                                                : sortedArtists[0].description}
                                        </div>
                                    </div>
                                }
                                placement="left"
                                showArrow={true}
                                size="md"
                                className="w-[200px] h-[138px] flex justify-start items-start"
                                offset={20}
                                crossOffset={-18}
                            >
                                <div className="cursor-pointer mt-[-5px]">
                                    <ProfileCard
                                        data={sortedArtists[0]}
                                        size={{
                                            width: "350px",
                                            height: "85px",
                                        }}
                                    />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                </Tab>
                <Tab key="3" title="recent event" className={styles.tab}>
                    <div className={styles.tabContent}>
                        {eventsLoading ? (
                            <div className="">
                                <Skeleton className="rounded-xl rounded-b-2xl mt-[-5px]">
                                    <div
                                        style={{
                                            width: "350px",
                                            height: "85px",
                                        }}
                                    />
                                </Skeleton>
                            </div>
                        ) : (
                            <Tooltip
                                content={
                                    <div className="flex flex-col justify-start gap-4 p-2">
                                        <div className="text-small font-bold text-gray-700">
                                            {sortedEvents[0].title}
                                        </div>
                                        <div className="text-tiny text-gray-500">
                                            {sortedEvents[0].description
                                                .length > 100
                                                ? sortedEvents[0].description.substring(
                                                      0,
                                                      100
                                                  ) + "..."
                                                : sortedEvents[0].description}
                                        </div>
                                    </div>
                                }
                                placement="left"
                                showArrow={true}
                                size="md"
                                className="w-[200px] h-[138px] flex justify-start items-start"
                                offset={20}
                                crossOffset={-18}
                            >
                                <div className="cursor-pointer mt-[-5px]">
                                    <ProfileCard
                                        data={sortedEvents[0]}
                                        size={{
                                            width: "350px",
                                            height: "85px",
                                        }}
                                    />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                </Tab>
            </Tabs>
        </Card>
    );
}
