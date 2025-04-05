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
import { Icon } from "@iconify/react/dist/iconify.js";
import { useContext } from "react";
import { motion } from "framer-motion";
import { NavContext } from "../contexts/navContext";
import { AuthContext } from "../contexts/authContext";
import { useUser } from "../hooks/useUser-new";
import { useLocation } from "react-router-dom";
import ManagerGuard from "../guards/ManagerGuard";
import FloatingControls from "./FloatingControls";
import { getPanelState } from "../../utils/getPanelState";
import styles from "./HeaderNav.module.css";

export default function HeaderNav() {
    const { navWhite } = useContext(NavContext);
    const { isAuth } = useContext(AuthContext);
    const { currentUser, loading } = useUser();

    const location = useLocation();
    const { pathname } = location;
    const isEventsPage = pathname === "/events";

    const { floatingPanelSettings: settings } = currentUser ?? {};
    const { pos, docked } = getPanelState(settings, isEventsPage);

    const dockPositionClass = isAuth
        ? settings?.dockPosition === "top-left"
            ? "ml-[225px]"
            : ""
        : "";

    const container = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const letter = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 100,
            },
        },
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
                    pos={pos}
                    active={isEventsPage}
                    dock={docked}
                />
            )}

            <NavbarBrand>
                <Link
                    aria-current="page"
                    href="/events"
                    className={`bg-transparent px-4 py-2 rounded-lg ${dockPositionClass}`}
                >
                    {/* <p className={styles.brand}>STAGE</p> */}
                    <motion.p
                        className={styles.brand + " flex gap-1"}
                        variants={container}
                        initial="hidden"
                        animate="visible"
                    >
                        {"STAGE".split("").map((char, i) => (
                            <motion.span key={i} variants={letter}>
                                {char}
                            </motion.span>
                        ))}
                    </motion.p>
                </Link>
            </NavbarBrand>

            {/* Center */}
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
                                className="px-4 py-[17.5px] text-gray-600 font-bold bg-white text-[12px] hover:text-primary"
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
                    className="px-4 py-[17.5px] text-gray-600 font-bold bg-white text-[12px] hover:text-primary"
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
                                className="px-4 py-[17.5px] text-gray-600 font-bold bg-white text-[12px] hover:text-primary"
                            >
                                Create Event
                            </Button>
                        </NavbarItem>
                    </ManagerGuard>
                )}
            </NavbarContent>

            {/* Right */}
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
                            <DropdownItem key="username">
                                Logged in as
                                <p className="font-bold text-primary">
                                    {currentUser?.name}
                                </p>
                            </DropdownItem>
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
                                    className="px-4 py-[17.5px] text-gray-600 font-bold bg-white text-[12px] hover:text-primary"
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
                                    className="px-4 py-[17.5px] text-white font-bold bg-primary text-[12px] hover:text-blue-300"
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
