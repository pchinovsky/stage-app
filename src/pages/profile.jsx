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
import { useState } from "react";

export default function Profile() {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const userProfile = {
        name: "Jane Doe",
        bio: "Music lover, concert goer, and aspiring artist.",
        imageUrl: "https://via.placeholder.com/150",
        username: "janedoe",
        email: "janedoe@example.com",
        hasVenuePermissions: true,
    };

    const stats = {
        artistsFollowed: 12,
        venuesFollowed: 5,
        eventsInterested: 8,
        eventsAttending: 3,
    };

    const preferences = {
        showBulkActions: true,
        showAppearanceSettings: false,
        showQuickFilters: true,
    };

    const invitations = [
        {
            id: "inv1",
            event: {
                imageUrl:
                    "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1Arz6g.img?w=800&h=435&q=60&m=2&f=jpg",
                title: "Live Concert at The Opera House",
            },
            invitedBy: {
                imageUrl:
                    "https://th.bing.com/th?id=ORMS.3c0d82de9d96caa8937112747d621ec3&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.2599999904632568&p=0",
                name: "Alice",
            },
        },
        {
            id: "inv2",
            event: {
                imageUrl:
                    "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1Arz6g.img?w=800&h=435&q=60&m=2&f=jpg",
                title: "Indie Fest 2025",
            },
            invitedBy: {
                imageUrl:
                    "https://th.bing.com/th?id=ORMS.3c0d82de9d96caa8937112747d621ec3&pid=Wdp&w=300&h=156&qlt=90&c=1&rs=1&dpr=1.2599999904632568&p=0",
                name: "Bob",
            },
        },
    ];

    const venue = {
        name: "The Grand Venue",
        description: "A beautiful venue for live events and concerts.",
    };

    const handleLogout = () => {
        console.log("Log Out clicked");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Profile updated");
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto mt-[200px] p-4 min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User info */}
                    <div className="md:col-span-1 flex flex-col justify-between items-start bg-white p-6 rounded-lg shadow-md">
                        <User
                            name={userProfile.name}
                            description={userProfile.bio}
                            avatarProps={{
                                src: userProfile.imageUrl,
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
                            <Button color="danger" onClick={handleLogout}>
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
                        <div className="flex gap-4 w-full">
                            <div className="flex gap-4 my-4 w-full">
                                <Card className="w-[150px]">
                                    <CardBody>
                                        <h3 className="text-lg font-bold">
                                            Artists
                                        </h3>
                                        <p className="text-2xl">
                                            {stats.artistsFollowed}
                                        </p>
                                    </CardBody>
                                </Card>
                                <Card className="w-[150px]">
                                    <CardBody>
                                        <h3 className="text-lg font-bold">
                                            Venues
                                        </h3>
                                        <p className="text-2xl">
                                            {stats.venuesFollowed}
                                        </p>
                                    </CardBody>
                                </Card>
                                <Card className="w-[150px]">
                                    <CardBody>
                                        <h3 className="text-lg font-bold">
                                            Interested
                                        </h3>
                                        <p className="text-2xl">
                                            {stats.eventsInterested}
                                        </p>
                                    </CardBody>
                                </Card>
                                <Card className="w-[150px]">
                                    <CardBody>
                                        <h3 className="text-lg font-bold">
                                            Attending
                                        </h3>
                                        <p className="text-2xl">
                                            {stats.eventsAttending}
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
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
                                        defaultValue={userProfile.username}
                                    />

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Email"
                                        labelPlacement="outside"
                                        defaultValue={userProfile.email}
                                    />

                                    <Input
                                        id="imageUrl"
                                        name="imageUrl"
                                        label="Profile Image URL"
                                        labelPlacement="outside"
                                        defaultValue={userProfile.imageUrl}
                                    />
                                    <div className="mt-2">
                                        <Avatar
                                            src={userProfile.imageUrl}
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

                        <div className="flex justify-between md:col-span-3 bg-white p-6 rounded-lg shadow-md">
                            {/* Managed venue */}
                            {userProfile.hasVenuePermissions && (
                                <div className="md:col-span-3 bg-white p-6 rounded-lg">
                                    {userProfile.hasVenuePermissions && (
                                        <div className="my-6 flex justify-between items-start w-full gap-5">
                                            <h2 className="text-xl font-bold mb-4">
                                                Your Managed Venue
                                            </h2>
                                            <Card className="ml-[200px]">
                                                <CardHeader>
                                                    <h3 className="text-lg font-bold">
                                                        {venue.name}
                                                    </h3>
                                                </CardHeader>
                                                <CardBody>
                                                    <p>{venue.description}</p>
                                                    <div className="mt-3">
                                                        <Button
                                                            color="primary"
                                                            size="sm"
                                                        >
                                                            Manage Events
                                                        </Button>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    )}
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
                                    {invitations.map((invitation) => (
                                        <Card
                                            key={invitation.id}
                                            isPressable
                                            className="relative h-[200px]"
                                        >
                                            <CardHeader className="p-0">
                                                <img
                                                    src={
                                                        invitation.event
                                                            .imageUrl
                                                    }
                                                    alt={invitation.event.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </CardHeader>
                                            <CardBody className="absolute left-[6px] bottom-[6px] w-[96.5%] z-10 bg-white h-[100px] rounded-lg py-2 px-3 overflow-hidden">
                                                <h3 className="font-bold">
                                                    {invitation.event.title}
                                                </h3>
                                                <div className="flex items-end justify-between mt-2">
                                                    <div>
                                                        <Avatar
                                                            src={
                                                                invitation
                                                                    .invitedBy
                                                                    .imageUrl
                                                            }
                                                            size="sm"
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">
                                                            Invited by{" "}
                                                            {
                                                                invitation
                                                                    .invitedBy
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-1 mb-2">
                                                        {" "}
                                                        <Tooltip
                                                            content={"Accept"}
                                                            radius="sm"
                                                        >
                                                            <Button
                                                                size="sm"
                                                                color="success"
                                                                isIconOnly
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
                                                            >
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
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
