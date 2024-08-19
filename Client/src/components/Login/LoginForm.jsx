import { useState } from "react";
import InputPassword from "./InputPassword";
import InputText from "./InputText";
import GoogleLogo from "/Login/google.png";
import FacebookLogo from "/Login/facebook.png";
import { signinWithGoogle, signinWithFacebook } from "../../auth/socialAuthServices";
import { signin } from "../../auth/emailAuthServices";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
// import { set } from "date-fns";

export default function LoginForm( { qrid }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [recaptcha, setRecaptcha] = useState("");

  const onChange = (e) => {
    if (e.target.name === "Email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "Password") {
      setPassword(e.target.value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("login");
    setErrors([]); // Clear errors at the start of the submit
    if (!recaptcha) {
      setErrors(["Please verify captcha"]);
      return;
    }
    try {
      console.log(email, password);
      setLoading(true);
      await signin(email, password);
      setLoading(false);
      if(qrid){
      navigate(`/no-profile-connected?qrid=${qrid}`); 
      } else if (qrid === 'null' || qrid === undefined || !qrid) {
        navigate (`/`);
      }

    } catch (error) {
      setErrors([error.message]);
    } finally {
      setLoading(false);
    }
  };
  const onGoogleSignin = async () => {
    try {
      // setLoading(true);
      await signinWithGoogle(qrid);
      // setLoading(false);
    } catch (error) {
      setErrors([]);
      setErrors((errors) => [...errors, error.message]);
    }
  };

  const onFacebookSignin = async () => {
    try {
      await signinWithFacebook(qrid);
    } catch (error) {
      console.error("Facebook sign-in error:", error);
    }
  };  

  return (
    <div className="mx-4 flex h-full flex-col items-center justify-between space-y-4 md:space-y-0 px-4 md:px-16">
      <header className="mb-2 text-xl xl:text-2xl 2xl:text-3xl 3xl:mb-8 3xl:text-5xl">
        <img src="/hearts-logo.png" alt="" className="w-32" />
      </header>
      <main className="flex w-full flex-col justify-between space-y-2 md:mx-0 2xl:space-y-4">
        <header className="leading-12 mb-2 text-center">
          <h1 className="whitespace-nowrap text-xl font-medium md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl">
            Welcome to Hearts Tribute!
          </h1>
          <h3 className="whitespace-nowrap mt-2 text-sm text-secondaryDarkGray md:text-sm xl:text-base 2xl:text-xl 3xl:text-2xl">
            Please login to your account.
          </h3>
        </header>
        <form
          className="flex flex-col space-y-6 lg:space-y-8"
          onSubmit={onSubmit}
        >
          <InputText
            value={email}
            onChange={onChange}
            placeholder="Email"
            name={"Email"}
            type={email}
            icon={"/images/email.svg"}
          />

          <InputPassword
            value={password}
            onChange={onChange}
            placeholder="Password"
            icon={"/images/password.svg"}
            name={"Password"}
          />
          <Link
            to={"/forgot-password"}
            className="self-end font-medium text-[#9F9F9F] hover:underline 3xl:text-xl"
          >
            Forgot Password?
          </Link>

          <div className="mx-auto">
            <ReCAPTCHA
              sitekey="6LeZ3AYqAAAAAGbgF4w1cMBEc7AiBxy2kM13jA7B"
              onChange={(value) => setRecaptcha(value)}
            />
          </div>

          <button
            className="mx-auto w-1/2 rounded-lg border border-white bg-primary py-2 text-base font-semibold text-white hover:border-primary hover:bg-white hover:text-primary md:mx-0 md:w-full md:py-3 md:text-lg 2xl:py-6 2xl:text-xl 3xl:py-9 3xl:text-3xl"
            type="submit"
            disabled={loading}
          >
            {!loading ? "Login" : "Logging in..."}
          </button>

          {errors.map((error) => (
            <p className="text-sm text-red-500 3xl:text-lg">{error}</p>
          ))}
        </form>

        <div className="mx-auto flex w-full items-center justify-center xl:w-3/4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="text mx-4 text-center font-semibold text-secondaryDarkGray md:text-lg xl:text-xl 3xl:text-3xl">
            Or Login with
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="grid grid-cols-2 items-center justify-between space-x-4 px-6 lg:px-8 xl:space-x-16 xl:px-16 3xl:px-24">
          <button
            onClick={onGoogleSignin}
            className="flex w-full flex-grow items-center justify-center space-x-2 rounded-md border border-[#A8A8A8] px-1 py-2 xl:px-3 xl:py-3 2xl:py-6 3xl:py-9 3xl:text-4xl"
          >
            <img src={GoogleLogo} alt="Google Logo" />
            <span className="text-base font-semibold lg:text-lg 2xl:text-xl 3xl:text-3xl">
              Google
            </span>
          </button>
          <div className="w-full flex-grow flex flex-col">
            <button
              onClick={onFacebookSignin} // Call the Facebook sign-in function
              className="relative w-full flex flex-col justify-center items-center rounded-md border border-[#A8A8A8] px-1 py-2 xl:px-3 xl:py-3 2xl:py-6 3xl:py-9 3xl:text-4xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <img src={FacebookLogo} alt="Facebook Logo" />
                <span className="text-base font-semibold xl:text-xl 3xl:text-3xl">
                  Facebook
                </span>
              </div>
            </button>
          </div>
        </div>
        <footer className="mt-2 text-center font-medium text-secondaryDarkGray xl:text-xl 3xl:text-3xl">
          Don't have an account?{" "}
          <Link
            className="cursor-pointer font-semibold text-primary underline"
            to={`/signup?qrid=${qrid}`}
          >
            Sign Up
          </Link>
        </footer>
      </main>
      <div className="hidden tall:block"></div>
    </div>
  );
}
