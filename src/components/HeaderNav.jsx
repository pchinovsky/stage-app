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
import { getPanelState } from "../../utils/getPanelState";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function HeaderNav() {
    const { navWhite } = useContext(NavContext);
    const { isAuth } = useContext(AuthContext);
    const { currentUser, loading } = useUser();

    const location = useLocation();
    const { pathname } = location;
    const isEventsPage = pathname === "/events";

    const { floatingPanelSettings: settings } = currentUser ?? {};
    const { pos, docked } = getPanelState(settings, isEventsPage);

    // const dockPosition = settings?.dockPosition ?? "top-left";
    const dockPositionClass = isAuth
        ? settings?.dockPosition === "top-left"
            ? "ml-[225px]"
            : ""
        : "";

    // const persistPosition = settings?.persistPosition;
    // const lastPosition = settings?.lastPosition ?? {
    //     top: "13px",
    //     left: "16px",
    // };

    // const docked =
    //     !persistPosition ||
    //     (lastPosition?.top === "13px" &&
    //         (lastPosition?.left === "16px" || lastPosition?.left === "72.8%"));

    // const pos =
    //     isEventsPage && persistPosition
    //         ? {
    //               top: lastPosition?.top || "13px",
    //               left: lastPosition?.left || "16px",
    //           }
    //         : {
    //               top: "13px",
    //               left: dockPosition === "top-left" ? "16px" : "72.8%",
    //           };

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
                    // dock={!(persistPosition && !docked)}
                    dock={docked}
                />
            )}

            <NavbarBrand>
                <Link
                    aria-current="page"
                    href="/events"
                    className={`bg-transparent px-4 py-2 rounded-lg ${dockPositionClass}`}
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
                                size="sm"
                                endContent={
                                    <Icon
                                        icon="material-symbols:keyboard-arrow-down-rounded"
                                        width="24"
                                        height="24"
                                        className="ml-2"
                                    />
                                }
                                radius="lg"
                                className="px-4 py-[17.5px] text-gray-600 font-bold bg-white text-[12px] hover:text-blue-600"
                            >
                                Profiles
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        radius="lg"
                        className={styles.dropdownMenu}
                        itemClasses={{
                            base: "gap-6 p-4",
                            title: "font-bold",
                        }}
                    >
                        <DropdownItem
                            key="autoscaling"
                            description="Information on participating artists"
                            as={Link}
                            href="/venues"
                            className=""
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

                <Button
                    as={Link}
                    href="/events"
                    size="sm"
                    radius="lg"
                    className="px-4 py-[17.5px] text-gray-600 font-bold bg-white text-[12px] hover:text-blue-600"
                >
                    Events
                </Button>

                {isAuth && (
                    <ManagerGuard mode="display">
                        <NavbarItem isActive>
                            <Button
                                as={Link}
                                href="/create"
                                size="sm"
                                radius="lg"
                                className="px-4 py-[17.5px] text-gray-600 font-bold bg-white text-[12px] hover:text-blue-600"
                                // classNames={{
                                //     base: "data-[hover=true]:bg-pink-100 data-[hover=true]:text-pink-600",
                                // }}
                            >
                                Create Event
                            </Button>
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
                        crossOffset={-80}
                    >
                        <DropdownTrigger>
                            <User
                                key={currentUser?.image || "fallback"}
                                as="button"
                                isFocusable={true}
                                avatarProps={{
                                    isBordered: true,
                                    src: currentUser?.image,
                                    showFallback: true,
                                    color: "primary",
                                }}
                                className="transition-transform mr-4 mt-2"
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
                        <div className="flex gap-2 mr-4">
                            <NavbarItem className="hidden lg:flex">
                                <Button
                                    as={Link}
                                    href="/login"
                                    size="sm"
                                    radius="lg"
                                    className="px-4 py-[17.5px] text-gray-600 font-bold bg-white text-[12px] hover:text-blue-600"
                                    // classNames={{
                                    //     base: "data-[hover=true]:bg-pink-100 data-[hover=true]:text-pink-600",
                                    // }}
                                >
                                    Login
                                </Button>
                            </NavbarItem>
                            <NavbarItem>
                                <Button
                                    as={Link}
                                    href="/register"
                                    size="sm"
                                    radius="lg"
                                    className="px-4 py-[17.5px] text-white font-bold bg-blue-600 text-[12px] hover:text-blue-300"
                                    // classNames={{
                                    //     base: "data-[hover=true]:bg-pink-100 data-[hover=true]:text-pink-600",
                                    // }}
                                >
                                    Sign Up
                                </Button>
                            </NavbarItem>
                        </div>
                    </>
                )}
            </NavbarContent>
        </Navbar>
    );
}
