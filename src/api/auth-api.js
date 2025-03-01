import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

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
    login,
    register,
    logout,
};
