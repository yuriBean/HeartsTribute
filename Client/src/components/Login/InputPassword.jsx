import { useState } from "react";
import hide from "/Login/hide.png";
import show from "/Login/show.png";

export default function InputPassword({ placeholder , value , onChange , icon = null, name}) {
  const [showPassword, setShowPassword] = useState(false);
  return (

    <div className="relative">
      <input
        className="px-8 py-3 xl:py-4 2xl:py-6 3xl:py-8 pl-10 md:pl-12  rounded-xl text-lg 2xl:text-xl 3xl:text-3xl bg-secondaryGray outline-none w-full"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
      />
      {icon && <img src={icon} alt="" className="h-6 w-6 md:bottom-1 md:w-8 md:h-8 bottom-0 aspect-square  left-2 absolute tranform -translate-y-1/2" />}
      <img
        src={showPassword ? show : hide}
        alt="Toggle Password Visibility"
        className="absolute right-4 top-1/2 transform -translate-y-1/2"
        onClick={() => setShowPassword((prev) => !prev)}
      />
    </div>

  );
};