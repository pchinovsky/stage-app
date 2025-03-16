import {
    Card,
    CardBody,
    CardHeader,
    Avatar,
    Button,
    Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEvents } from "../hooks/useEvents";
import { useUser } from "../hooks/useUser";
import { useState, useEffect } from "react";

export default function InvitationCard({ invitation }) {
    const { events, loading, error } = useEvents({ id: invitation.eventId });
    const { fetchUsersByIds, otherUsers, loading: userLoading } = useUser();

    useEffect(() => {
        if (!userLoading && invitation.invitedBy) {
            fetchUsersByIds([invitation.invitedBy]);
        }
    }, [userLoading, invitation.invitedBy, fetchUsersByIds]);

    const inviter = otherUsers[invitation.invitedBy];
    const event = events && events[0];

    if (loading) {
        return (
            <Card isPressable className="relative h-[200px]">
                <CardBody className="flex items-center justify-center">
                    Loading...
                </CardBody>
            </Card>
        );
    }

    if (error || !event) {
        return (
            <Card isPressable className="relative h-[200px]">
                <CardBody className="flex items-center justify-center">
                    Error loading event.
                </CardBody>
            </Card>
        );
    }

    const invitationData = {
        ...invitation,
        event: {
            image: event.image,
            title: event.title,
        },
        invitedBy: {
            name: invitation.invitedByName,
            image:
                inviter?.image ||
                "https://th.bing.com/th?id=ORMS.3c0d82de9d96caa8937112747d621ec3&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.2599999904632568&p=0",
        },
    };

    return (
        <Card isPressable className="relative h-[200px]">
            <CardHeader className="p-0">
                <img
                    src={invitationData.event.image}
                    alt={invitationData.event.title}
                    className="w-full h-full object-cover"
                />
            </CardHeader>
            <CardBody className="absolute left-[6px] bottom-[6px] w-[96.5%] z-10 bg-white h-[100px] rounded-lg py-2 px-3 overflow-hidden">
                <h3 className="font-bold">{invitationData.event.title}</h3>
                <div className="flex items-end justify-between mt-2">
                    <div>
                        <Avatar
                            src={invitationData.invitedBy.image}
                            size="sm"
                            className="mr-2"
                        />
                        <span className="text-sm">
                            Invited by {invitationData.invitedBy.name}
                        </span>
                    </div>
                    <div className="flex gap-1 mb-2">
                        <Tooltip content={"Accept"} radius="sm">
                            <Button size="sm" color="success" isIconOnly>
                                <Icon icon="ci:check" width="24" height="24" />
                            </Button>
                        </Tooltip>
                        <Tooltip content={"Decline"} radius="sm">
                            <Button size="sm" color="danger" isIconOnly>
                                <Icon
                                    icon="ci:close-md"
                                    width="24"
                                    height="24"
                                />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
