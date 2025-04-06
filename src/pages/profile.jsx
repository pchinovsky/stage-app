import { useState, useEffect } from "react";
import {
    Button,
    User,
    Card,
    CardBody,
    Form,
    Input,
    Avatar,
    Switch,
    Select,
    SelectItem,
    Spinner,
    Link,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import useForm from "../hooks/useForm";
import authApi from "../api/auth-api";

import { useUser } from "../hooks/useUser";
import { useError } from "../contexts/errorContext";
import { useVenue } from "../hooks/useVenue";
import { userSchema } from "../api/validationSchemas";

import DefaultLayout from "@/layouts/default";
import ProfileCard from "../components/ProfileCard";
import CalendarModal from "../components/Calendar";
import InvitationCard from "../components/InvitationCard";
import ModalProfileCustom from "../components/ModalProfileCustom";

export default function Profile() {
    const { showError } = useError();

    const { currentUser: user, setCurrentUser, loading } = useUser();

    const [isModalOpen, setModalOpen] = useState(false);
    const [switchLoading, setSwitchLoading] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleToggleSetting = async (key, value) => {
        if (!user?.id) return;

        setSwitchLoading(true);

        try {
            const updatedSettings = {
                ...user.floatingPanelSettings,
                [key]: value,
            };

            setCurrentUser({
                ...user,
                floatingPanelSettings: updatedSettings,
            });

            await authApi.updateUser(user.id, {
                floatingPanelSettings: updatedSettings,
            });
        } catch (error) {
            console.error("Error updating floating panel settings:", error);
            showError("Failed to update settings. Please try again.");
        } finally {
            setSwitchLoading(false);
        }
    };

    const { venue, loading: venueLoading } = useVenue(user?.managedVenue);

    const initialValues = {
        name: user?.name || "",
        email: user?.email || "",
        image: user?.image || "",
    };

    const updateUser = async (values) => {
        try {
            await authApi.updateUser(user.id, {
                name: values.name,
                email: values.email,
                image: values.image,
            });
            setCurrentUser({
                ...user,
                name: values.name,
                email: values.email,
                image: values.image,
            });
            resetForm({
                name: values.name,
                email: values.email,
                image: values.image,
            });
        } catch (error) {
            console.error("Error updating user:", error);
            showError(error.message || "Failed to update user.");
            throw error;
        }
    };

    const {
        formValues,
        handleInputChange,
        handleSubmit,
        isSubmitting,
        resetForm,
    } = useForm(initialValues, updateUser, null, userSchema);

    useEffect(() => {
        if (user) {
            if (
                formValues.name !== user.name ||
                formValues.email !== user.email ||
                formValues.image !== user.image
            ) {
                resetForm({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                });
            }
        }
    }, [user]);

    let stats;
    if (!loading && user) {
        stats = {
            Attending: user.attending?.length || 0,
            Interested: user.interested?.length || 0,
            Created: user.created?.length || 0,
            "Following Users": user.followingUsers?.length || 0,
            "Following Artists": user.followingArtists?.length,
            "Following Venues": user.followingVenues?.length,
            "Followed By Users": user.followedBy?.length || 0,
            "": "",
        };
    }

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <DefaultLayout>
            {loading || !user ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner
                        variant="wave"
                        classNames={{
                            wrapper: "w-16 h-16",
                        }}
                    />
                </div>
            ) : (
                <div className="container block mt-[550px] p-4 h-auto w-screen font-primary bg-gray-300 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-full">
                        {/* User info */}
                        <div className="md:col-span-1 flex flex-col justify-between items-start bg-white p-6 rounded-lg shadow-md">
                            <User
                                key={formValues?.image}
                                name={formValues?.name}
                                avatarProps={{
                                    src: user?.image,
                                    size: "lg",
                                    radius: "md",
                                    showFallback: true,
                                    classNames: {
                                        base: "w-24 h-24",
                                    },
                                }}
                                classNames={{
                                    base: "flex-col items-start",
                                    name: "font-bold mt-4 text-left text-lg text-primary",
                                }}
                            />

                            <CalendarModal
                                isOpen={isCalendarOpen}
                                onClose={() => setIsCalendarOpen(false)}
                            />
                            <div className="mt-6 flex justify-end gap-2 w-full items-end">
                                <Button
                                    color="danger"
                                    variant="bordered"
                                    as={Link}
                                    href="/logout"
                                    className="w-[95px] h-[95px] border-2 border-red-400"
                                >
                                    Log Out
                                </Button>
                                <Button
                                    isIconOnly
                                    variant="bordered"
                                    onPress={setIsCalendarOpen}
                                    className="w-[95px] h-[95px] hover:text-primary"
                                >
                                    <Icon
                                        icon="ci:calendar-days"
                                        width="44"
                                        height="44"
                                    />
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-20">
                                Your Statistics
                            </h2>
                            <div className="flex flex-wrap content-end gap-3 w-full">
                                {Object.entries(stats).map(([label, value]) => (
                                    <Card
                                        key={label}
                                        radius="md"
                                        className="w-[180px] h-[80px]"
                                        shadow="sm"
                                        isHoverable
                                    >
                                        <CardBody className="flex flex-col justify-between">
                                            <h3 className="text-medium hover:text-primary">
                                                {label}
                                            </h3>
                                            <p className="text-medium font-bold text-primary">
                                                {value}
                                            </p>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-5">
                            {/* Profile form */}
                            <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md flex">
                                <Form
                                    onSubmit={handleSubmit}
                                    validationBehavior="aria"
                                >
                                    <h2 className="text-xl font-bold mb-4">
                                        Update Profile
                                    </h2>
                                    <div className="space-y-9 w-[350px]">
                                        <Input
                                            id="name"
                                            name="name"
                                            label="Username"
                                            labelPlacement="outside"
                                            value={formValues?.name}
                                            onChange={handleInputChange}
                                        />

                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            label="Email"
                                            labelPlacement="outside"
                                            value={formValues?.email}
                                            onChange={handleInputChange}
                                        />

                                        <div
                                            className="flex w-full items-end gap-5"
                                            style={{ marginTop: "20px" }}
                                        >
                                            <Input
                                                id="image"
                                                name="image"
                                                label="Profile Image URL"
                                                labelPlacement="outside"
                                                value={formValues?.image}
                                                onChange={handleInputChange}
                                            />
                                            <Avatar
                                                key={formValues?.image}
                                                src={formValues?.image}
                                                size="md"
                                                showFallback={true}
                                                className="flex-shrink-0"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            color="primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? "Updating..."
                                                : "Update Profile"}
                                        </Button>
                                    </div>
                                </Form>
                                {/* Floating controls */}
                                <div className="my-0 ml-auto mr-5">
                                    <h2 className="text-xl font-bold mb-8">
                                        Floating Controls Preferences
                                    </h2>
                                    <div className="space-y-3 flex flex-col">
                                        <Switch
                                            id="transparency"
                                            isSelected={
                                                user.floatingPanelSettings
                                                    .isTransparent
                                            }
                                            onChange={(e) =>
                                                handleToggleSetting(
                                                    "isTransparent",
                                                    e.target.checked
                                                )
                                            }
                                            isDisabled={switchLoading}
                                        >
                                            Transparent Mode
                                        </Switch>

                                        <Switch
                                            id="locked"
                                            isSelected={
                                                user.floatingPanelSettings
                                                    .isLocked
                                            }
                                            onChange={(e) =>
                                                handleToggleSetting(
                                                    "isLocked",
                                                    e.target.checked
                                                )
                                            }
                                            isDisabled={switchLoading}
                                        >
                                            Locked Mode
                                        </Switch>

                                        <Switch
                                            id="persistPosition"
                                            isSelected={
                                                user.floatingPanelSettings
                                                    .persistPosition
                                            }
                                            onChange={(e) =>
                                                handleToggleSetting(
                                                    "persistPosition",
                                                    e.target.checked
                                                )
                                            }
                                            isDisabled={switchLoading}
                                        >
                                            Persist Position
                                        </Switch>

                                        <Select
                                            label="Dock Position"
                                            selectedKeys={[
                                                user.floatingPanelSettings
                                                    .dockPosition,
                                            ]}
                                            onSelectionChange={(keys) => {
                                                const selectedKey =
                                                    Array.from(keys)[0];
                                                handleToggleSetting(
                                                    "dockPosition",
                                                    selectedKey
                                                );
                                            }}
                                            isDisabled={switchLoading}
                                        >
                                            <SelectItem key="top-left">
                                                Top Left
                                            </SelectItem>
                                            <SelectItem key="top-right">
                                                Top Right
                                            </SelectItem>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between md:col-span-3 bg-white p-0 rounded-lg shadow-md w-full mb-5">
                                {/* Managed venue */}
                                <div className="md:col-span-3 bg-white p-6 rounded-lg flex justify-between w-full">
                                    <div className="my-6 mt-0 flex justify-between items-start w-full gap-10">
                                        <h2 className="text-xl font-bold mb-4 w-[100px]">
                                            Your Managed Venue
                                        </h2>
                                        {user.managedVenue ? (
                                            venueLoading ? (
                                                <div className="flex justify-center items-center h-full mr-10 mt-3">
                                                    <Spinner
                                                        classNames={{
                                                            wrapper:
                                                                "w-16 h-16",
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <ProfileCard
                                                    key={venue.id}
                                                    data={venue}
                                                    onClick={handleCardClick}
                                                    className="self-end"
                                                    size={{
                                                        width: "480px",
                                                        height: "288px",
                                                    }}
                                                    styles={{
                                                        text: "text-lg",
                                                        desc: 150,
                                                        footer: "h-[100px]",
                                                        pos: "self-end",
                                                    }}
                                                    footer={true}
                                                />
                                            )
                                        ) : (
                                            <p className="border border-gray-400 rounded-lg px-4 py-3 text-gray-400">
                                                No managed venue.
                                            </p>
                                        )}
                                    </div>
                                    <ModalProfileCustom
                                        isOpen={isModalOpen}
                                        onClose={closeModal}
                                        data={venue}
                                    />
                                </div>
                            </div>{" "}
                        </div>

                        <div className="w-auto md:col-span-1 mb-5">
                            {/* Invitations */}
                            <div className="md:col-span-3 bg-white p-6 rounded-lg h-full w-auto shadow-md">
                                <div className="my-0 overflow-y-auto max-h-[700px]">
                                    <h2 className="text-xl font-bold mb-8">
                                        Invitations
                                    </h2>
                                    <div className="flex flex-col gap-4">
                                        {user.invitedTo.length > 0 ? (
                                            user.invitedTo.map((invitation) => (
                                                <InvitationCard
                                                    key={invitation.eventId}
                                                    invitation={invitation}
                                                />
                                            ))
                                        ) : (
                                            <p className="border border-gray-400 rounded-lg px-4 py-3 text-gray-400">
                                                No invitations at the moment.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
}
