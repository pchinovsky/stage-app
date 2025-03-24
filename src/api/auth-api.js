import { auth, db } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const updateUser = async (userId, updateData) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, updateData);
        console.log("User data updated successfully - ", updateData);
    } catch (error) {
        console.error("Err updating user data - ", error);
        throw error;
    }
}

const login = async (data) => {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    return {
        accessToken: await userCredential.user.getIdToken(),
        user: userCredential.user,
    };
};

const register = async (data) => {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    return {
        accessToken: await userCredential.user.getIdToken(),
        user: userCredential.user,
    };
};

const logout = async () => await signOut(auth);

export default {
    updateUser,
    login,
    register,
    logout,
};
