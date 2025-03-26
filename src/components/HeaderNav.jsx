import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    User,
} from "@heroui/react";
import styles from "./HeaderNav.module.css";
import { useContext, useState } from "react";
import { NavContext } from "../contexts/navContext";
import { AuthContext } from "../contexts/authContext";
import { useLogout } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser-new";
import FloatingControls from "./FloatingControls";
import { useLocation } from "react-router-dom";
import ManagerGuard from "../guards/ManagerGuard";
import { useNavigate } from "react-router-dom";

export default function HeaderNav() {
    const navigate = useNavigate();
    const { navWhite } = useContext(NavContext);
    const { isAuth } = useContext(AuthContext);
    const { currentUser, loading } = useUser();

    const { pathname } = useLocation();
    const pathSegments = pathname.split("/");
    const filteredSegments = pathSegments.filter((segment) => segment !== "");
    const lastSegment = filteredSegments[filteredSegments.length - 1];

    const panelActive = lastSegment === "events";

    const handleLogout = () => {
        navigate("/logout");
    };

    return (
        <Navbar
            className={styles.navbar}
            isBordered={false}
            isBlurred={false}
            style={{
                position: "fixed",
                "--navbar-height": "70px",
                "--navbar-bg": navWhite ? "white" : "transparent",
            }}
        >
            {isAuth && (
                <FloatingControls
                    pos={{ top: "13px", left: "16px" }}
                    active={panelActive}
                />
            )}

            <NavbarBrand>
                <Link
                    aria-current="page"
                    href="/events"
                    className="bg-white px-4 py-2 rounded-lg"
                >
                    <p className={styles.brand}>STAGE</p>
                </Link>
            </NavbarBrand>
            {/* Center Navbar Items */}
            <NavbarContent className={styles.navContent} justify="center">
                <Dropdown shouldBlockScroll={false} className="lg:flex p-0">
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={styles.featureButton}
                                endContent="▼"
                                radius="sm"
                                variant="solid"
                            >
                                Profiles
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="ACME features"
                        className={styles.dropdownMenu}
                        itemClasses={{
                            base: "gap-4",
                        }}
                    >
                        <DropdownItem
                            key="autoscaling"
                            description="Information on participating artists"
                            as={Link}
                            href="/venues"
                        >
                            Venues
                        </DropdownItem>
                        <DropdownItem
                            key="usage_metrics"
                            description="Information on hosting venues"
                            as={Link}
                            href="/artists"
                        >
                            Artists
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                {isAuth && (
                    <ManagerGuard mode="display">
                        <NavbarItem isActive className={styles.item}>
                            <Link aria-current="page" href="/create">
                                Create Event
                            </Link>
                        </NavbarItem>
                    </ManagerGuard>
                )}
            </NavbarContent>

            {/* Right Navbar Items */}
            <NavbarContent justify="end">
                {isAuth ? (
                    <>
                        <NavbarItem>
                            <Button
                                as={Link}
                                color="secondary"
                                href="/logout"
                                variant="solid"
                                onPress={handleLogout}
                            >
                                Logout
                            </Button>
                        </NavbarItem>
                        {/* User Avatar & Dropdown */}
                        <Dropdown shouldBlockScroll={false} placement="top-end">
                            <DropdownTrigger>
                                <User
                                    as="button"
                                    avatarProps={{
                                        isBordered: true,
                                        src: "https://th.bing.com/th?id=OSK.HEROW-wRV8gajI7GQAlcsww50kp26c7GuT_1KPa6bPqp1zA&w=312&h=200&c=7&rs=1&o=6&dpr=1.3&pid=SANGAM",
                                    }}
                                    className="transition-transform"
                                />
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="User Actions"
                                variant="flat"
                            >
                                <DropdownItem
                                    key="profile"
                                    className="h-14 gap-2"
                                >
                                    <p className="font-bold">Signed in as</p>
                                    <p className="font-bold">
                                        {loading
                                            ? "Loading..."
                                            : currentUser?.name}
                                    </p>
                                </DropdownItem>
                                <DropdownItem
                                    key="settings"
                                    as={Link}
                                    href="/profile"
                                >
                                    Profile
                                </DropdownItem>
                                <DropdownItem key="analytics">
                                    Analytics
                                </DropdownItem>
                                <DropdownItem key="system">System</DropdownItem>
                                <DropdownItem key="configurations">
                                    Configurations
                                </DropdownItem>
                                <DropdownItem key="help_and_feedback">
                                    Help & Feedback
                                </DropdownItem>
                                <DropdownItem key="logout" color="danger">
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </>
                ) : (
                    <>
                        <NavbarItem className="hidden lg:flex">
                            <Button
                                as={Link}
                                href="/login"
                                variant="solid"
                                className="bg-white rounded-3xl p-0"
                            >
                                Login
                            </Button>
                        </NavbarItem>
                        <NavbarItem>
                            <Button
                                as={Link}
                                color="primary"
                                href="/register"
                                variant="solid"
                            >
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
        </Navbar>
    );
}
