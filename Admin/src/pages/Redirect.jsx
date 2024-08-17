import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Redirect() {
    const [searchParams] = useSearchParams();
    const qrid = searchParams.get("qrid");

    useEffect(() => {
        window.location.href = `https://www.app.heartstribute.com/login?qrid=${qrid}`;
    }, []);
    return <div>Redirect</div>;
}
