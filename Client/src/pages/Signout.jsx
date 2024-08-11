import { useNavigate } from "react-router-dom";
import { signout } from "../auth/emailAuthServices";
import Spinner from "../components/Common/Spinner";
import { useEffect } from "react";

export default function Signout() {
  const navigate = useNavigate();
  useEffect(() => {
    signout();
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }, []);
  return (
    <Spinner text="Signing Out...." />
  )
}

