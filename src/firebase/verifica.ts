import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

function Verifica() {
    const [user, setUser] = useState(Object);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            setUser(user);
        });
    }, []);

    if (!user) {
        window.location.href = '/login';
        return null;
    }
}

export default Verifica;