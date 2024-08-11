import { Link } from "react-router-dom";
import { verifyEmail, signout } from "../auth/emailAuthServices";

export default function VerifyEmail() {
    return (
        <div className="flex min-h-screen justify-center md:px-16 md:py-8">
            <main className="flex w-full flex-col items-center rounded-[30px] bg-white px-8 py-16 drop-shadow-md md:px-20 lg:px-40 xl:px-60 2xl:px-80">
                <h1 className="mt-8 text-center text-3xl font-semibold text-primary md:text-4xl xl:text-5xl">
                    Your email is not verified
                </h1>
                <p className="mt-4 text-center text-secondaryDarkGray">
                    To access your account verify your email
                </p>
                <button
                    onClick={verifyEmail}
                    className="mt-8 rounded-lg bg-primary px-8 py-4 text-white"
                >
                    Send Verification Email
                </button>
                <br />
                <Link to={"/signout"}>Sign Out</Link>
            </main>
        </div>
    );
}
