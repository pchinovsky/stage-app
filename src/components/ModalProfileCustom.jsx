import { useEffect, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    Button,
    Image,
    CardBody,
    CardHeader,
    CardFooter,
    user,
} from "@heroui/react";
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../contexts/authContext";

export default function ModalProfileCustom({ isOpen, onClose, data }) {
    const { isAuth, userId } = useContext(AuthContext);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        (async () => {
            if (!isAuth || !userId || !data) return;
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const following = userData.following || [];
                setIsFollowing(following.includes(data.id));
            } else {
                console.log("No such document!");
            }
        })();
    }, [isAuth, userId, data]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen || !data) return null;

    const handleFollow = async () => {
        if (!isAuth || !userId || !data) return;

        try {
            const userRef = doc(db, "users", userId);
            const followedRef = data.address
                ? doc(db, "venues", data.id)
                : doc(db, "artists", data.id);

            if (isFollowing) {
                // Unfollow
                await updateDoc(userRef, {
                    following: arrayRemove(data.id),
                });
                await updateDoc(followedRef, {
                    followedBy: arrayRemove(userId),
                });
                setIsFollowing(false);
            } else {
                // Follow
                await updateDoc(userRef, {
                    following: arrayUnion(data.id),
                });
                await updateDoc(followedRef, {
                    followedBy: arrayUnion(userId),
                });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
            >
                <motion.div
                    className="w-[90%] max-w-lg"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card className="border border-gray-200 shadow-xl p-4">
                        <CardHeader className="text-center font-bold text-xl">
                            {data.name}
                        </CardHeader>

                        <Image
                            alt={data.name}
                            className="object-cover shadow-none rounded-md"
                            height={250}
                            src={data.image}
                            width="100%"
                        />

                        <CardBody className="text-gray-700 text-sm mt-2">
                            <p>
                                {data.description ||
                                    "No description available."}
                            </p>
                            {data.address ? (
                                <p className="mt-5">
                                    <span className="font-semibold">
                                        Location:
                                    </span>{" "}
                                    {data.address}
                                </p>
                            ) : null}
                        </CardBody>

                        <CardFooter className="flex justify-end">
                            <Button onPress={onClose} color="primary">
                                Close
                            </Button>
                            <Button
                                onPress={handleFollow}
                                color={isFollowing ? "danger" : "success"}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
