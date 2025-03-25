import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser-new";
import { Card, Spacer, Button, Link } from "@heroui/react";

const ManagerGuard = ({ mode = "route", children, fallback }) => {
    const { currentUser, loading } = useUser();

    if (loading) return <div>Loading...</div>;

    const isManager =
        currentUser &&
        currentUser.managedVenue &&
        currentUser.managedVenue.trim() !== "";

    if (!isManager) {
        if (mode === "route") {
            return fallback ? (
                fallback
            ) : (
                <div className="flex justify-center items-center min-h-screen bg-background p-4">
                    <Card className="max-w-md w-full p-4 text-center">
                        <p className="font-bold">Access Denied</p>
                        <Spacer y={2} />
                        <p>
                            You do not have permission to access this page.
                            Please contact admin.
                        </p>
                        <Spacer y={4} />
                        <Button
                            as={Link}
                            href="/events"
                            color="primary"
                            variant="flat"
                        >
                            Back to Events
                        </Button>
                    </Card>
                </div>
            );
        } else {
            return null;
        }
    }

    return <>{children}</>;
};

export default ManagerGuard;
