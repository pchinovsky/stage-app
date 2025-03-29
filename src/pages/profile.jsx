import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import TabbedCard from "../components/TabCard";
import styles from "./profile.module.css";
import {
    Button,
    User,
    Card,
    CardBody,
    CardHeader,
    Form,
    Input,
    Avatar,
    Calendar,
    Switch,
    Tooltip,
    Select,
    SelectItem,
    Link,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import CalendarModal from "../components/Calendar";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/authContext";
import { useVenue } from "../hooks/useVenue";
import { useEvents } from "../hooks/useEvents";
import { useUser } from "../hooks/useUser";
import ProfileCard from "../components/ProfileCard";
import ModalProfileCustom from "../components/ModalProfileCustom";
import InvitationCard from "../components/InvitationCard";
import { useLogout } from "../hooks/useAuth";
import { useFollowing } from "../contexts/followingContext";
import useForm from "../hooks/useForm";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { userSchema } from "../api/validationSchemas";
import authApi from "../api/auth-api";
import { useError } from "../contexts/errorContext";
import { useFloatingContext } from "../contexts/floatingContext";

export default function Profile() {
    const { showError } = useError();
    const {
        updateFloatingPanelSettings,
        floatingPanelSettings,
        setFloatingPanelSettings,
    } = useFloatingContext();

    const { currentUser: user, setCurrentUser, loading } = useUser();

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [switchLoading, setSwitchLoading] = useState(false);

    const logout = useLogout();

    // useEffect(() => {
    //     if (!loading && user) {
    //         setFloatingPanelSettings(
    //             user.floatingPanelSettings || floatingPanelSettings
    //         );
    //     }
    // }, [user, loading]);

    // const updateFloatingPanelSettings = async (newSettings) => {
    //     setFloatingPanelSettings((prev) => ({ ...prev, ...newSettings }));

    //     try {
    //         setSwitchLoading(true);
    //         await authApi.updateUser(user.id, {
    //             floatingPanelSettings: {
    //                 ...floatingPanelSettings,
    //                 ...newSettings,
    //             },
    //         });
    //     } catch (error) {
    //         console.error("Error updating floating panel settings:", error);
    //         showError("Failed to update settings. Please try again.");
    //     } finally {
    //         setSwitchLoading(false);
    //     }
    // };

    const handleSwitchToggle = async (newSettings) => {
        setFloatingPanelSettings((prev) => ({ ...prev, ...newSettings }));
        setSwitchLoading(true);
        try {
            await updateFloatingPanelSettings(newSettings);
        } catch (err) {
            showError("Failed to update setting");
        } finally {
            setSwitchLoading(false);
        }
    };

    const {
        venue,
        loading: venueLoading,
        error: venueError,
    } = useVenue(user?.managedVenue);

    const initialValues = {
        name: user?.name || "",
        email: user?.email || "",
        image: user?.image || "",
    };

    const updateUser = async (values) => {
        try {
            // const userRef = doc(db, "users", user.id);
            // await updateDoc(userRef, {
            //     name: values.name,
            //     email: values.email,
            //     image: values.image,
            // });
            await authApi.updateUser(user.id, {
                name: values.name,
                email: values.email,
                image: values.image,
            });

            console.log("User updated:", values);
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
        error,
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

    if (!loading) console.log("--- profile user - ", formValues.name);

    let stats;
    if (!loading && user) {
        stats = {
            Attending: user.attending?.length || 0,
            Interested: user.interested?.length || 0,
            Created: user.created?.length || 0,
            "Following Users": user.followingUsers?.length || 0,
            "Following Artists": user.followingArtists?.length,
            "Following Venues": user.followingVenues?.length,
            "Followed By": user.followedBy?.length || 0,
        };
    }

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    if (loading || !user) {
        return <div>Loading user data...</div>;
    }

    return (
        <DefaultLayout>
            <div className="container mx-auto mt-[200px] p-4 min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            }}
                        />

                        <CalendarModal
                            isOpen={isCalendarOpen}
                            onClose={() => setIsCalendarOpen(false)}
                        />
                        <div className="mt-6 flex justify-between w-full items-end">
                            {/* <Button
                                color="danger"
                                variant="bordered"
                                onPress={logout}
                            >
                                Log Out
                            </Button> */}
                            <Button
                                color="danger"
                                variant="bordered"
                                as={Link}
                                href="/logout"
                            >
                                Log Out
                            </Button>
                            <Button
                                isIconOnly
                                variant="bordered"
                                onPress={setIsCalendarOpen}
                                className="w-[55px] h-[55px] hover:text-blue-500"
                            >
                                <Icon
                                    icon="ci:calendar-days"
                                    width="24"
                                    height="24"
                                />
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Your Stats</h2>
                        <div className="flex flex-wrap gap-4 w-full">
                            {Object.entries(stats).map(([label, value]) => (
                                <Card key={label} className="w-[150px]">
                                    <CardBody>
                                        <h3 className="text-lg font-bold">
                                            {label}
                                        </h3>
                                        <p className="text-2xl">{value}</p>
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
                                <div className="space-y-10 w-[350px]">
                                    <Input
                                        id="name"
                                        name="name"
                                        label="Username"
                                        // key={formValues?.name}
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

                                    <div className="flex w-full items-end gap-5">
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
                            <div className="my-0 ml-auto">
                                <h2 className="text-xl font-bold mb-8">
                                    Floating Controls Preferences
                                </h2>
                                <div className="space-y-3 flex flex-col">
                                    <Switch
                                        id="transparency"
                                        isSelected={
                                            floatingPanelSettings.isTransparent
                                        }
                                        onChange={(e) =>
                                            handleSwitchToggle({
                                                isTransparent: e.target.checked,
                                            })
                                        }
                                        isDisabled={switchLoading}
                                    >
                                        Transparent Mode
                                    </Switch>
                                    <Switch
                                        id="locked"
                                        isSelected={
                                            floatingPanelSettings.isLocked
                                        }
                                        onChange={(e) =>
                                            handleSwitchToggle({
                                                isLocked: e.target.checked,
                                            })
                                        }
                                        isDisabled={switchLoading}
                                    >
                                        Locked Mode
                                    </Switch>

                                    <Switch
                                        id="transparency"
                                        isSelected={
                                            floatingPanelSettings.persistPosition
                                        }
                                        onChange={(e) =>
                                            handleSwitchToggle({
                                                persistPosition:
                                                    e.target.checked,
                                            })
                                        }
                                        isDisabled={switchLoading}
                                    >
                                        Persist Position
                                    </Switch>
                                    <Select
                                        label="Dock Position"
                                        selectedKeys={[
                                            floatingPanelSettings.dockPosition,
                                        ]}
                                        onSelectionChange={(keys) => {
                                            const selectedKey =
                                                Array.from(keys)[0];
                                            console.log(
                                                "selectedKey",
                                                selectedKey
                                            );

                                            updateFloatingPanelSettings({
                                                dockPosition: selectedKey,
                                            });
                                        }}
                                        isDisabled={switchLoading}
                                        // className="border rounded-md p-2"
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

                        <div className="flex justify-between md:col-span-3 bg-white p-6 rounded-lg shadow-md w-full">
                            {/* Managed venue */}
                            {user.managedVenue && (
                                <div className="md:col-span-3 bg-white p-6 rounded-lg flex justify-between w-full">
                                    {user.managedVenue && (
                                        <div className="my-6 flex justify-between items-start w-full gap-10">
                                            <h2 className="text-xl font-bold mb-4 w-[100px]">
                                                Your Managed Venue
                                            </h2>
                                            {venueLoading ? (
                                                <div>Loading venue...</div>
                                            ) : venueError || !venue ? (
                                                <div>Error loading venue.</div>
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
                                                    footer={true}
                                                />
                                            )}
                                        </div>
                                    )}
                                    <ModalProfileCustom
                                        isOpen={isModalOpen}
                                        onClose={closeModal}
                                        data={venue}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-full w-auto md:col-span-1">
                        {/* Invitations */}
                        <div className="md:col-span-3 bg-white p-6 rounded-lg h-full w-auto shadow-md">
                            <div className="my-0">
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
                                        <p>No invitations at the moment.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
