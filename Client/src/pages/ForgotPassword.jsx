import { useState } from "react";
import { forgotPassword } from "../auth/emailAuthServices";
import InputText from "../components/Login/InputText";
import { useSearchParams } from "react-router-dom";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const qrid = searchParams.get("qrid");

  const [email, setEmail] = useState("");
  const onChange = (e) => {
    if (e.target.name === "Email") {
      setEmail(e.target.value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email, qrid);
      alert("Check your email for reset link");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center h-full md:w-1/3 mx-auto">
      <header className="mx-auto">
        <img src="/hearts-logo.png" alt="" className="w-32" />
      </header>
      <br />
      <br />
      <br />
      <main className="flex flex-col justify-between w-full space-y-8 p-4">
        <header className="text-center leading-12 mb-4">
          <h1 className="font-medium md:text-4xl lg:text-5xl whitespace-nowrap xl:text-[64px]">
            Forgot Password?
          </h1>
          <br />
          <br />
          <h3 className="text-sm md:text-lg xl:text-3xl whitespace-nowrap text-secondaryDarkGray">
            Enter your email to reset your password.
          </h3>
        </header>
        <form className="flex flex-col" onSubmit={onSubmit}>
          <InputText
            value={email}
            onChange={onChange}
            placeholder="Email"
            name="Email"
            type={email}
          />
          <br />
          <button
            className="py-4 md:text-lg xl:text-xl md:py-5 xl:py-7  font-semibold bg-primary text-white hover:text-primary hover:bg-white border border-white hover:border-primary rounded-lg "
            type="submit"
          >
            Send Reset Email
          </button>
        </form>
      </main>
    </div>
  );
}
