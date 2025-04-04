"use client";

import React, { useState, useEffect, useContext } from "react";
import {
    Button,
    Input,
    Checkbox,
    Link,
    Form,
    Image,
    Skeleton,
    Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import EventInfo from "../components/EventInfo";
import DefaultLayout from "../layouts/default";
import useForm from "../hooks/useForm";
import { useLogin } from "../hooks/useAuth";
import { loginSchema } from "../api/validationSchemas";
import styles from "./login.module.css";
import ButtonDynamic from "../components/ButtonDynamic";
import { useEventsStore } from "../contexts/eventsContext";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useError } from "../contexts/errorContext";
import ErrorModal from "../components/ModalError";
import { AuthContext } from "../contexts/authContext";

export default function Login() {
    const location = useLocation();
    const { accessLogRef } = useContext(AuthContext);
    const { error: modalError, showError } = useError();
    const [isVisible, setIsVisible] = useState(false);
    const [featuredEvent, setFeaturedEvent] = useState(null);
    const { events, loading } = useEventsStore();

    const log = useLogin();
    const route = "/events";

    useEffect(() => {
        if (location.state?.error) {
            console.log("error - ", location.state.error);

            if (!modalError) {
                showError(location.state.error);
            }
        }
    }, []);

    const initialValues = { email: "", password: "" };
    const { formValues, handleInputChange, handleSubmit, error } = useForm(
        initialValues,
        log,
        route,
        loginSchema
    );

    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setFeaturedEvent(randomEvent);
    }, [events]);

    return (
        <DefaultLayout>
            <ErrorModal />
            <div className={styles.container}>
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

                <div className={styles.loginBox}>
                    <p className={styles.title}>Log In 👋</p>
                    <Form
                        className={styles.form}
                        validationBehavior="native"
                        onSubmit={handleSubmit}
                    >
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

                        {error && <p className={styles.error}>{error}</p>}

                        <Button
                            className={styles.submitButton}
                            color="primary"
                            type="submit"
                        >
                            Log In
                        </Button>
                    </Form>

                    <p className={styles.signupText}>
                        <Link href="/register" size="sm">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </DefaultLayout>
    );
}
