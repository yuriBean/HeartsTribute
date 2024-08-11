import Letter from "/VerifyEmail/letter.svg"
import { verifyEmail } from "../auth/emailAuthServices"
import { useLocation } from "react-router-dom";

export default function CompleteRegistration() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="min-h-screen flex  justify-center  md:px-16 md:py-8 ">
      <main className="w-full bg-white drop-shadow-md rounded-[30px] flex flex-col items-center py-16 px-8 md:px-20 lg:px-40 xl:px-60 2xl:px-80">
        <img src={Letter} alt="Letter" className="aspect-square w-60 xl:w-[250px] 3xl:w-[350px]" />
        <h1 className="text-2xl lg:text-3xl 2xl:text-5xl 3xl:text-7xl font-bold text-center  ">Verify Your Email</h1>
        <p className="text-lg lg:text-xl 2xl:text-3xl 3xl:text-5xl text-secondaryDarkGray text-center mt-4  ">We've sent a message to {email}. Please confirm your email by clicking the link in the message</p>
      </main>
    </div>
  )
}