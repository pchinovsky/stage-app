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

export default function HeaderNav() {
    const { navWhite } = useContext(NavContext);
    const { isAuth } = useContext(AuthContext);
    const { currentUser, loading } = useUser();

    const location = useLocation();
    const { pathname } = location;
    const isEventsPage = pathname === "/events";
    // const { pathname } = useLocation();

    // const pathSegments = pathname.split("/");
    // const filteredSegments = pathSegments.filter((segment) => segment !== "");
    // const lastSegment = filteredSegments[filteredSegments.length - 1];

    // const panelActive = lastSegment === "events";

    const dockPosition = currentUser?.floatingPanelSettings?.dockPosition;

    const persistPosition = currentUser?.floatingPanelSettings?.persistPosition;
    const docked =
        (currentUser?.floatingPanelSettings?.lastPosition?.top === "13px" &&
            currentUser?.floatingPanelSettings?.lastPosition?.left ===
                "16px") ||
        (currentUser?.floatingPanelSettings?.lastPosition?.top === "13px" &&
            currentUser?.floatingPanelSettings?.lastPosition?.left === "72.8%");

    const pos =
        isEventsPage && persistPosition
            ? {
                  top: `${currentUser?.floatingPanelSettings?.lastPosition?.top || "13px"}`,
                  left: `${currentUser?.floatingPanelSettings?.lastPosition?.left || "16px"}`,
              }
            : {
                  top: "13px",
                  left: dockPosition === "top-left" ? "16px" : "72.8%",
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
            maxWidth="full"
        >
            {isAuth && (
                <FloatingControls
                    // pos={{ top: "13px", left: "16px" }}
                    // pos={{ top: currentUser.floatingPanelSettings."13px",
                    //     left: "72.8%" }}
                    pos={pos}
                    active={isEventsPage}
                    dock={!(persistPosition && !docked)}
                />
            )}

            <NavbarBrand>
                <Link
                    aria-current="page"
                    href="/events"
                    className={`bg-white px-4 py-2 rounded-lg ${dockPosition === "top-left" && "ml-[195px]"}`}
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
                {isAuth && loading ? null : isAuth ? (
                    <Dropdown
                        shouldBlockScroll={false}
                        offset={10}
                        crossOffset={-65}
                    >
                        <DropdownTrigger>
                            <User
                                key={currentUser?.image || "fallback"}
                                as="button"
                                avatarProps={{
                                    isBordered: true,
                                    src: currentUser?.image,
                                    showFallback: true,
                                }}
                                className="transition-transform mr-3 mt-2"
                            />
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem
                                key="profile"
                                as={Link}
                                href="/profile"
                            >
                                Profile
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                as={Link}
                                href="/logout"
                                color="danger"
                                variant="bordered"
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
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
