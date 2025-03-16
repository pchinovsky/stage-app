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
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import CalendarModal from "../components/Calendar";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { useVenue } from "../hooks/useVenue";
import { useEvents } from "../hooks/useEvents";
import { useUser } from "../hooks/useUser";
import ProfileCard from "../components/ProfileCard";
import ModalProfileCustom from "../components/ModalProfileCustom";
import InvitationCard from "../components/InvitationCard";
import { useLogout } from "../hooks/useAuth";
import { useFollowing } from "../contexts/followingContext";

export default function Profile() {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const { currentUser: user, loading } = useUser();
    const logout = useLogout();

    if (!loading) console.log("--- profile user - ", user);

    const {
        venue,
        loading: venueLoading,
        error: venueError,
    } = useVenue(user?.managedVenue);

    if (loading || !user) {
        return <div>Loading user data...</div>;
    }
    const stats = {
        Attending: user.attending?.length || 0,
        Interested: user.interested?.length || 0,
        Created: user.created?.length || 0,
        "Following Users": user.followingUsers?.length || 0,
        "Following Artists": user.followingArtists?.length,
        "Following Venues": user.followingVenues?.length,
        "Followed By": user.followedBy?.length || 0,
    };

    const preferences = {
        showBulkActions: true,
        showAppearanceSettings: false,
        showQuickFilters: true,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Profile updated");
    };

    const handleCardClick = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto mt-[200px] p-4 min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User info */}
                    <div className="md:col-span-1 flex flex-col justify-between items-start bg-white p-6 rounded-lg shadow-md">
                        <User
                            name={user.name}
                            avatarProps={{
                                src: user.image,
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
                            <Button
                                color="danger"
                                variant="bordered"
                                onPress={logout}
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
                                        id="username"
                                        name="username"
                                        label="Username"
                                        labelPlacement="outside"
                                        defaultValue={user.name}
                                    />

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Email"
                                        labelPlacement="outside"
                                        defaultValue={user.email}
                                    />

                                    <div className="flex w-full gap-5 items-end">
                                        <Input
                                            id="imageUrl"
                                            name="imageUrl"
                                            label="Profile Image URL"
                                            labelPlacement="outside"
                                            defaultValue={user.image}
                                        />
                                        <Avatar
                                            src={user.image}
                                            size="md"
                                            showFallback={true}
                                        />
                                    </div>

                                    <Button type="submit" color="primary">
                                        Update Profile
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
                                        id="bulkActions"
                                        defaultSelected={
                                            preferences.showBulkActions
                                        }
                                    >
                                        Show Bulk Actions
                                    </Switch>

                                    <Switch
                                        id="appearanceSettings"
                                        defaultSelected={
                                            preferences.showAppearanceSettings
                                        }
                                    >
                                        Show Appearance Settings
                                    </Switch>

                                    <Switch
                                        id="quickFilters"
                                        defaultSelected={
                                            preferences.showQuickFilters
                                        }
                                    >
                                        Show Quick Filters
                                    </Switch>
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
