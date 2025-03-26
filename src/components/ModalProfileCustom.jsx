import { useEffect, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    Button,
    Image,
    CardBody,
    CardHeader,
    CardFooter,
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
import { Link } from "@heroui/react";
import { useError } from "../contexts/errorContext";

export default function ModalProfileCustom({ isOpen, onClose, data }) {
    const { showError } = useError();
    const { isAuth, userId } = useContext(AuthContext);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        (async () => {
            if (!isAuth || !userId || !data) return;
            const userRef = doc(db, "users", userId);

            try {
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const following = data.address
                        ? userData.followingVenues
                        : userData.followingArtists;
                    setIsFollowing(following.includes(data.id));
                } else {
                    console.log("No such document!");
                }
            } catch (err) {
                console.error("Error fetching follow status:", err);
                showError(err.message || "Error fetching follow status.");
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
                if (data.address) {
                    await updateDoc(userRef, {
                        followingVenues: arrayRemove(data.id),
                    });
                } else {
                    await updateDoc(userRef, {
                        followingArtists: arrayRemove(data.id),
                    });
                }
                await updateDoc(followedRef, {
                    followedBy: arrayRemove(userId),
                });
                setIsFollowing(false);
            } else {
                // Follow
                if (data.address) {
                    await updateDoc(userRef, {
                        followingVenues: arrayUnion(data.id),
                    });
                } else {
                    await updateDoc(userRef, {
                        followingArtists: arrayUnion(data.id),
                    });
                }
                await updateDoc(followedRef, {
                    followedBy: arrayUnion(userId),
                });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
            showError(error.message || "Error updating follow status.");
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
                    className="w-[90%] max-w-2xl"
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
                            src={data.profileImage}
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
                            {data.website ? (
                                <p className="mt-4">
                                    <span className="font-semibold">
                                        External resource:
                                    </span>{" "}
                                    <Link
                                        showAnchorIcon
                                        href={data.website}
                                        target="_blank"
                                    >
                                        {data.website}
                                    </Link>
                                </p>
                            ) : null}

                            {/* Gallery */}
                            {data.additionalImages &&
                                data.additionalImages.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2">
                                            Gallery
                                        </h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {data.additionalImages.map(
                                                (imgUrl, index) => (
                                                    <Image
                                                        key={index}
                                                        alt={`Additional image ${index + 1}`}
                                                        className="object-cover rounded-md w-full h-24"
                                                        src={imgUrl}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </CardBody>

                        <CardFooter className="flex justify-end">
                            <Button onPress={onClose} color="primary">
                                Close
                            </Button>
                            {isAuth && (
                                <Button
                                    onPress={handleFollow}
                                    color={isFollowing ? "danger" : "success"}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
