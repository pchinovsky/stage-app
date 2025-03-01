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
import { useContext } from "react";
import { NavContext } from "../contexts/navContext";
import { useLogout } from "../hooks/useAuth";

export default function HeaderNav() {
    const { navWhite } = useContext(NavContext);
    const logout = useLogout();

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
            <NavbarBrand>
                <Link aria-current="page" href="/events">
                    <p className={styles.brand}>STAGE</p>
                </Link>
            </NavbarBrand>

            {/* Center Navbar Items */}
            <NavbarContent className={styles.navContent} justify="center">
                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className={styles.featureButton}
                                endContent="▼"
                                radius="sm"
                                variant="light"
                            >
                                Features
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
                            description="ACME scales apps based on demand and load"
                        >
                            Autoscaling
                        </DropdownItem>
                        <DropdownItem
                            key="usage_metrics"
                            description="Real-time metrics to debug issues"
                        >
                            Usage Metrics
                        </DropdownItem>
                        <DropdownItem
                            key="production_ready"
                            description="ACME runs on ACME, join us at web scale"
                        >
                            Production Ready
                        </DropdownItem>
                        <DropdownItem
                            key="99_uptime"
                            description="High availability and uptime guarantees"
                        >
                            +99% Uptime
                        </DropdownItem>
                        <DropdownItem
                            key="supreme_support"
                            description="Support team ready to respond"
                        >
                            +Supreme Support
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <NavbarItem isActive className={styles.item}>
                    <Link aria-current="page" href="/create">
                        Create Event
                    </Link>
                </NavbarItem>
            </NavbarContent>

            {/* Right Navbar Items */}
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="/login">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        as={Link}
                        color="primary"
                        href="/register"
                        variant="flat"
                    >
                        Sign Up
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        as={Link}
                        color="secondary"
                        href="/logout"
                        variant="flat"
                        onPress={logout}
                    >
                        Logout
                    </Button>
                </NavbarItem>

                {/* User Avatar & Dropdown */}
                <Dropdown placement="top-end">
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
                    <DropdownMenu aria-label="User Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-bold">Signed in as</p>
                            <p className="font-bold">@tonyreichert</p>
                        </DropdownItem>
                        <DropdownItem key="settings" as={Link} href="/profile">
                            Profile
                        </DropdownItem>
                        <DropdownItem key="analytics">Analytics</DropdownItem>
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
            </NavbarContent>
        </Navbar>
    );
}
