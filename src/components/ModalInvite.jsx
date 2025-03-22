import "./ModalInvite.module.css";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Listbox,
    ListboxItem,
    Chip,
    Input,
} from "@heroui/react";
import { useState, useMemo, useEffect } from "react";
import {
    arrayUnion,
    writeBatch,
    doc,
    getDoc,
    increment,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { calcTrending } from "../../utils/calcTrending";

export default function ModalInvite({
    isOpen,
    onClose,
    users,
    currentUser,
    event,
}) {
    const [selectedUsers, setSelectedUsers] = useState(new Set([]));
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [alreadyInvited, setAlreadyInvited] = useState([]);

    // fetch already invited -
    useEffect(() => {
        const fetchEventDetails = async () => {
            if (isOpen && event) {
                try {
                    const eventDoc = await getDoc(doc(db, "events", event));
                    if (eventDoc.exists()) {
                        setAlreadyInvited(eventDoc.data().invited || []);
                    }
                } catch (error) {
                    console.error("Error fetching event details:", error);
                }
            }
        };

        fetchEventDetails();
    }, [isOpen, event]);

    // search filter -
    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const handleSelectionChange = (keys) => {
        const newSelection = new Set(
            Array.from(keys).filter(
                (userId) => !alreadyInvited.includes(userId)
            )
        );
        setSelectedUsers(newSelection);
    };

    const removeUser = (userId) => {
        const newSelection = new Set(selectedUsers);
        newSelection.delete(userId);
        setSelectedUsers(newSelection);
    };

    const handleInvite = async () => {
        if (selectedUsers.size === 0) return;

        setIsLoading(true);
        try {
            const eventId = event;

            const userIds = Array.from(selectedUsers);

            const batch = writeBatch(db);

            const eventRef = doc(db, "events", eventId);
            batch.update(eventRef, {
                invited: arrayUnion(...userIds),
                invitedCount: increment(userIds.length),
                inviting: arrayUnion(currentUser.id),
                involvedUsers: arrayUnion(...userIds),
            });

            userIds.forEach((userId) => {
                const userRef = doc(db, "users", userId);
                batch.update(userRef, {
                    invitedTo: arrayUnion({
                        eventId: eventId,
                        invitedBy: currentUser.id,
                        invitedByName: currentUser.name,
                        invitedAt: new Date(),
                    }),
                });
            });

            await batch.commit();

            await calcTrending(eventId);

            setAlreadyInvited([...alreadyInvited, ...userIds]);
            setSelectedUsers(new Set([]));

            onClose();
        } catch (error) {
            console.error("Error inviting users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            modalClassName="!z-[9999]"
            backdrop="blur"
        >
            <ModalContent className="modal-content">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Invite Users
                        </ModalHeader>
                        <ModalBody>
                            {/* sel users chips -  */}
                            {selectedUsers.size > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {Array.from(selectedUsers).map((userId) => {
                                        const user = users.find(
                                            (u) => u.id === userId
                                        );
                                        return (
                                            <Chip
                                                key={userId}
                                                onClose={() =>
                                                    removeUser(userId)
                                                }
                                                color="primary"
                                                variant="flat"
                                            >
                                                {user?.name}
                                            </Chip>
                                        );
                                    })}
                                </div>
                            )}

                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mb-3"
                                clearable
                            />

                            <div className="h-[200px] overflow-auto border rounded-md">
                                <Listbox
                                    aria-label="User selection"
                                    selectionMode="multiple"
                                    selectedKeys={selectedUsers}
                                    onSelectionChange={handleSelectionChange}
                                    disabledKeys={alreadyInvited}
                                    variant="flat"
                                >
                                    {filteredUsers.map((user) => {
                                        const isInvited =
                                            alreadyInvited.includes(user.id);
                                        return (
                                            <ListboxItem
                                                key={user.id}
                                                textValue={user.name}
                                                className={`cursor-pointer ${
                                                    selectedUsers.has(user.id)
                                                        ? "bg-blue-500 text-white"
                                                        : ""
                                                }`}
                                                description={
                                                    isInvited
                                                        ? "Already invited"
                                                        : ""
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span>{user.name}</span>
                                                </div>
                                            </ListboxItem>
                                        );
                                    })}
                                </Listbox>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleInvite}
                                isLoading={isLoading}
                                isDisabled={selectedUsers.size === 0}
                            >
                                Send Invites
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
