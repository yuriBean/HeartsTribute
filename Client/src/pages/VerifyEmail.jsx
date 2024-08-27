import { Link } from "react-router-dom";
import { verifyEmail, signout } from "../auth/emailAuthServices";
import { useState } from "react";
import { notifyError, notifySuccess } from "../utils/toastNotifications";

export default function VerifyEmail() {
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            await verifyEmail();
            notifySuccess("Verification email sent! Please check your inbox.");
        } catch (err) {
            console.log("Failed to send verification email. Please try again.", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen justify-center md:px-16 md:py-8">
            <main className="flex w-full flex-col items-center rounded-[30px] bg-white px-8 py-16 drop-shadow-md md:px-20 lg:px-40 xl:px-60 2xl:px-80">
                <h1 className="mt-8 text-center text-3xl font-semibold text-primary md:text-4xl xl:text-5xl">
                    A verification email has been sent to your inbox.
                </h1>
                <p className="mt-4 text-center text-secondaryDarkGray">
                   You may close this window.
                </p>
                {/* <button
                    onClick={handleVerify}
                    className="mt-8 rounded-lg bg-primary px-8 py-4 text-white"
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send Verification Email"}
                </button> */}
                <br />
                <Link to={'/signout'}>Sign Out</Link>
            </main>
        </div>
    );
}
