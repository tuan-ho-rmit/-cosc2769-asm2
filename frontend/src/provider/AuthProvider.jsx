import { createContext, useState, useContext, useEffect } from "react";
import CircularProgress from '../components/CircularProgress/index'
import { baseUrl } from "../config";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isFetchedUser, setIsFetchedUser] = useState(false);
    const [isFetchingUser, setIsFetchingUser] = useState(false)

    const checkLoginStatus = async () => {
        setIsFetchingUser(true)
        try {
            const response = await fetch(`${baseUrl}/api/auth/check-auth`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                setIsFetchingUser(false)
                throw new Error("Unauthorized");
            }
            const resBody = await response.json();
            if (!resBody.rem && localStorage.getItem("loggedInBefore") === "true") {
                localStorage.removeItem("loggedInBefore");
            }
            setUser(response.ok ? { ...resBody.user } : null);
        } catch (err) {
            console.error(err.message);
            setIsFetchingUser(false)
        } finally {
            console.log('finally');
            setIsFetchingUser(false)
            setIsFetchedUser(true);
        }
    };
    useEffect(() => {
        checkLoginStatus();
    }, [setUser, setIsFetchedUser]);
    return (
        <AuthContext.Provider
            value={{ user, setUser, isFetchedUser, setIsFetchedUser }}
        >
            {isFetchingUser ? <div className="bg-black w-100 h-[100vh]" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress /></div> : children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a UserProvider");
    }
    return context;
}
