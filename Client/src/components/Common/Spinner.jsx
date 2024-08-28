import { useEffect, useRef } from "react";

export default function Spinner({ text = "Loading..." }) {
    const spinnerRef = useRef(null);

    useEffect(() => {
        if (spinnerRef.current) {
            spinnerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, []);

    return (
        <div
            ref={spinnerRef}
            className="flex h-screen flex-col items-center justify-center"
        >
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-[#346164]"></div>
            <br />
            <h1 className="text-2xl font-semibold">{text}</h1>
        </div>
    );
}
