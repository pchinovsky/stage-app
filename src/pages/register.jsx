import { useState, useEffect } from "react";
import { Button, Input, Link, Image, Form, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import useForm from "../hooks/useForm";
import { useRegister } from "../hooks/useAuth";
import { useEventsStore } from "../contexts/eventsContext";
import { registerSchema } from "../api/validationSchemas";
import EventInfo from "../components/EventInfo";
import DefaultLayout from "../layouts/default";
import styles from "./register.module.css";

export default function Register() {
    const { events, loading } = useEventsStore();

    const [isVisible, setIsVisible] = useState(false);
    const [featuredEvent, setFeaturedEvent] = useState(null);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const register = useRegister();

    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const route = "/events";
    const { formValues, handleInputChange, handleSubmit, error } = useForm(
        initialValues,
        register,
        route,
        registerSchema
    );

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () =>
        setIsConfirmVisible(!isConfirmVisible);

    useEffect(() => {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setFeaturedEvent(randomEvent);
    }, []);

    return (
        <DefaultLayout>
            <div className={styles.container}>
                {/* Background */}
                {featuredEvent && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={featuredEvent.image}
                            alt={featuredEvent.title}
                            className={styles.backgroundImage}
                        />
                    </motion.div>
                )}

                {/* Event Info */}
                {loading ? (
                    <div className="absolute left-0 top-0 flex justify-center items-center h-full">
                        <Spinner
                            classNames={{
                                wrapper:
                                    "absolute left-20 top-[250px] w-16 h-16 z-[1000]",
                            }}
                        />
                    </div>
                ) : (
                    <EventInfo event={featuredEvent} />
                )}

                {/* Register Form */}
                <div className={styles.registerBox}>
                    <p className={styles.title}>
                        Sign Up
                        <span
                            aria-label="emoji"
                            className={styles.emoji}
                            role="img"
                        >
                            👋
                        </span>
                    </p>
                    <Form
                        className={styles.form}
                        validationBehavior="native"
                        onSubmit={handleSubmit}
                    >
                        <Input
                            isRequired
                            label="Username"
                            labelPlacement="outside"
                            name="username"
                            placeholder="Enter your username"
                            type="text"
                            variant="bordered"
                            value={formValues.username}
                            onChange={handleInputChange}
                        />

                        <Input
                            isRequired
                            label="Email"
                            labelPlacement="outside"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            variant="bordered"
                            value={formValues.email}
                            onChange={handleInputChange}
                        />

                        <Input
                            isRequired
                            endContent={
                                <button
                                    type="button"
                                    onClick={toggleVisibility}
                                >
                                    <Icon
                                        className={styles.eyeIcon}
                                        icon={
                                            isVisible
                                                ? "solar:eye-closed-linear"
                                                : "solar:eye-bold"
                                        }
                                    />
                                </button>
                            }
                            label="Password"
                            labelPlacement="outside"
                            name="password"
                            placeholder="Enter your password"
                            type={isVisible ? "text" : "password"}
                            variant="bordered"
                            value={formValues.password}
                            onChange={handleInputChange}
                        />

                        <Input
                            isRequired
                            endContent={
                                <button
                                    type="button"
                                    onClick={toggleConfirmVisibility}
                                >
                                    <Icon
                                        className={styles.eyeIcon}
                                        icon={
                                            isConfirmVisible
                                                ? "solar:eye-closed-linear"
                                                : "solar:eye-bold"
                                        }
                                    />
                                </button>
                            }
                            label="Confirm Password"
                            labelPlacement="outside"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            type={isConfirmVisible ? "text" : "password"}
                            variant="bordered"
                            value={formValues.confirmPassword}
                            onChange={handleInputChange}
                        />

                        {error && <p className={styles.error}>{error}</p>}

                        <Button
                            className={styles.submitButton}
                            color="primary"
                            type="submit"
                        >
                            Sign Up
                        </Button>
                    </Form>
                    <p className={styles.loginText}>
                        <Link href="/login" size="sm">
                            Already have an account? Log In
                        </Link>
                    </p>
                </div>
            </div>
        </DefaultLayout>
    );
}
