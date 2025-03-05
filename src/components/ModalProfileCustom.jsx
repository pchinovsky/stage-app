import { useEffect, useContext } from "react";
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
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../contexts/authContext";

export default function ModalProfileCustom({ isOpen, onClose, data }) {
    const { isAuth, userId } = useContext(AuthContext);

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
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                following: arrayUnion(data.id),
            });
            console.log(`Followed ${data.name}`);
        } catch (error) {
            console.error("Error following:", error);
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
                            <Button onPress={handleFollow} color="secondary">
                                Follow
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
