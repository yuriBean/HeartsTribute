import { useEffect, useRef } from "react";

export default function Spinner({ text = "Loading..." }) {
    const spinnerRef = useRef(null);

    useEffect(() => {
        if (spinnerRef.current) {
            spinnerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            
            // Set a timeout to scroll to the top after 5 seconds
            const timeoutId = setTimeout(() => {
                window.scrollTo(0,0);
            }, 1500);

            // Cleanup function to clear the timeout if the component unmounts
            return () => clearTimeout(timeoutId);
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
