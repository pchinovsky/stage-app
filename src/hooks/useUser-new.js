import { useUsersStore } from "../contexts/usersContext";

export function useUser() {
    const { currentUser, allUsers, loading, error } = useUsersStore();

    console.log("--- useUser new -", currentUser, loading);


    const fetchUsersByIds = (userIds) => {
        if (!userIds || userIds.length === 0) return [];
        return allUsers.filter((user) => userIds.includes(user.id));
    };

    return { currentUser, allUsers, loading, error, fetchUsersByIds };
}
