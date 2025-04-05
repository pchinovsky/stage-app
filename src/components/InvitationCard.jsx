import { useState, useEffect, useContext } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {
    Card,
    CardBody,
    CardHeader,
    Avatar,
    Button,
    Tooltip,
    Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { useError } from "../contexts/errorContext";
import { AuthContext } from "../contexts/authContext";
import { useToast } from "../contexts/toastContext";

export default function InvitationCard({ invitation }) {
    const { showError } = useError();
    const { showToast } = useToast();

    const [hasAccepted, setHasAccepted] = useState(false);
    const [hasDeclined, setHasDeclined] = useState(false);

    const { event, loading } = useEvent(invitation.eventId);

    const {
        fetchUsersByIds,
        currentUser: user,
        otherUsers,
        loading: userLoading,
    } = useUser();
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && invitation.invitedBy) {
            fetchUsersByIds([invitation.invitedBy]);
        }
    }, [userLoading, invitation.invitedBy]);

    useEffect(() => {
        if (user && user.interested?.includes(invitation.eventId)) {
            setHasAccepted(true);
        }
    }, [user, invitation.eventId]);

    const inviter = otherUsers[invitation.invitedBy];

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

    const openEvent = () => {
        navigate(`/events/${event.id}`);
    };

    const handleAccept = async () => {
        try {
            if (!userId) return;
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                interested: arrayUnion(event.id),
            });
            showToast("Invitation accepted.");
            setHasAccepted(true);
        } catch (err) {
            console.error("Error accepting invitation:", err);
            showError(err.message || "Error accepting invitation.");
        }
    };

    const handleDecline = async () => {
        try {
            if (!userId) return;
            const userRef = doc(db, "users", userId);

            await updateDoc(userRef, {
                invitedTo: arrayRemove({
                    eventId: invitation.eventId,
                    invitedBy: invitation.invitedBy,
                    invitedAt: invitation.invitedAt,
                    invitedByName: invitation.invitedByName,
                }),
            });

            showToast("Invitation declined.");
            setHasDeclined(true);
        } catch (err) {
            console.error("Error declining invitation:", err);
            showError(err.message || "Error declining invitation.");
        }
    };

    if (hasDeclined) {
        return null;
    }

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Spinner size="lg" />
                </div>
            ) : (
                <Card
                    isPressable
                    onPress={openEvent}
                    className="relative h-[200px]"
                >
                    <CardHeader className="p-0">
                        <img
                            src={invitationData.event.image}
                            alt={invitationData.event.title}
                            className="w-full h-full object-cover"
                        />
                    </CardHeader>
                    <CardBody className="absolute left-[6px] bottom-[6px] w-[96.5%] z-10 bg-white h-[100px] rounded-lg py-2 px-3 overflow-hidden">
                        <h3 className="font-bold">
                            {invitationData.event.title}
                        </h3>
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
                                {hasAccepted ? (
                                    <Button
                                        size="sm"
                                        color="success"
                                        isDisabled
                                    >
                                        Accepted
                                    </Button>
                                ) : (
                                    <>
                                        <Tooltip content={"Accept"} radius="sm">
                                            <Button
                                                size="sm"
                                                color="success"
                                                isIconOnly
                                                onPress={handleAccept}
                                            >
                                                <Icon
                                                    icon="ci:check"
                                                    width="24"
                                                    height="24"
                                                />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip
                                            content={"Decline"}
                                            radius="sm"
                                        >
                                            <Button
                                                size="sm"
                                                color="danger"
                                                isIconOnly
                                                onPress={handleDecline}
                                            >
                                                <Icon
                                                    icon="ci:close-md"
                                                    width="24"
                                                    height="24"
                                                />
                                            </Button>
                                        </Tooltip>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    );
}
