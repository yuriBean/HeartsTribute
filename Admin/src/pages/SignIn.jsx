import { signin } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrors([]);
            setErrors([...errors, "Please fill all the fields"]);
            return;
        }
        setErrors([]);
        try {
            setLoading(true);
            await signin(email, password);
            console.log(email, password);
            setLoading(false);
            navigate("/admin/default");
        } catch (error) {
            setErrors([]);
            setErrors([...errors, error.message]);
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50">
            <div className="flex h-full w-full items-center  justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
                {/* Sign in section */}
                <form
                    onSubmit={(e) => handleSignIn(e)}
                    className=" mx-auto w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]"
                >
                    <h1 className="">
                        <img src="/hearts-logo.png" alt="" className="w-32 mx-auto" />
                    </h1>
                    <h4 className="mb-2.5 mt-4 text-4xl font-bold text-primary ">
                        Sign In
                    </h4>
                    {/* Email */}
                    <input
                        type="email"
                        className="mt-2 w-full rounded-xl border border-gray-200 py-[12px] px-4 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* Password */}
                    <input
                        type="password"
                        className="mt-2 w-full rounded-xl border border-gray-200 py-[12px] px-4 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.length > 0 && (
                        <div className="mt-2 w-full rounded-xl bg-red-100 px-4 py-2 text-red-500">
                            {errors.map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}

                    {/* Checkbox */}
                    <button className="linear mt-2 w-full rounded-xl bg-primary py-[12px] text-base font-medium text-white transition duration-200 hover:bg-opacity-80 ">
                        {loading ? "Loading..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
