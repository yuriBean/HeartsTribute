// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
    } from "firebase/auth";
import { auth } from "../../firebase";
import { getUserWithEmail } from "../services/userProfile.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;
        unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userData = await getUserWithEmail(user.email);
                userData.emailVerified = user.emailVerified;
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            } else {
                setUser(null);
                localStorage.removeItem("user");
            }
            setLoading(false);
        });
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const getUser = async () => {
        const userFromLocalStorage = JSON.stringify(
            localStorage.getItem("user"),
        );
        if (user && !userFromLocalStorage) {
            const userData = await getUserWithEmail(user.email);
            userData.emailVerified = user.emailVerified;
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            return userFromLocalStorage;
        }
    };
    const updateLocalStorage = async (email) => {
        const userData = await getUserWithEmail(email);
        userData.emailVerified = user.emailVerified;
        localStorage.setItem("user", JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, getUser, updateLocalStorage }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
