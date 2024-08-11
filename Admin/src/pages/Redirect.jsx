import { useEffect } from "react";
import { redirect } from "react-router-dom";

export default function Redirect() {
    useEffect(() => {
        window.location.href = "https://www.app.heartstribute.com/login";
    }, []);
    return <div>Redirect</div>;
}
