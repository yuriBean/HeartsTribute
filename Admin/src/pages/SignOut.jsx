import { useEffect } from "react";
import { signout } from "../services/auth.service";

export default function SignOut() {
    useEffect(() => {
        signout();
    }, []);
    return <div>Signing Out...</div>;
}
