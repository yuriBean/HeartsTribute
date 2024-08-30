import { useState, useEffect } from "react";
import InputPassword from "../Login/InputPassword";
import InputText from "../Login/InputText";
import { signup, checkUserProfiles, linkTributeTag, createProfile } from "../../auth/emailAuthServices";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SignupForm({ qrid }) {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [terms, setTerms] = useState(false);
  const [tributeTagID, setTributeTagID] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchedTagID = "unique-tribute-tag-id"; 
    setTributeTagID(fetchedTagID);
  }, []);

  const validator = (firstName, lastName, password, confirmPassword, terms) => {
    const newErrors = [];
    if (firstName.length < 1) {
      newErrors.push("First name is required");
    }
    if (lastName.length < 1) {
      newErrors.push("Last name is required");
    }
    if (password.length < 6) {
      newErrors.push("Password should be at least 6 characters long");
    }
    if (password !== confirmPassword) {
      newErrors.push("Passwords do not match");
    }
    if (!terms) {
      newErrors.push("Please agree to terms and conditions");
    }
    console.log(newErrors);
    return newErrors;
  };

  const onChange = (e) => {
    if (e.target.name === "FirstName") {
      setFirstName(e.target.value);
    }
    if (e.target.name === "LastName") {
      setLastName(e.target.value);
    }
    if (e.target.name === "Email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "Password") {
      setPassword(e.target.value);
    }
    if (e.target.name === "ConfirmPassword") {
      setConfirmPassword(e.target.value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); // Clear errors before validation
    const validationErrors = validator(
      firstName,
      lastName,
      password,
      confirmPassword,
      terms
    );
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const user = await signup(email, password, firstName, lastName, qrid);
      setLoading(false);
      if (profiles.length > 0) {
        showProfileSelectionPopup(profiles, tributeTagID);
      } else {
        await createProfile(user.uid, firstName, lastName, tributeTagID);
      }
      navigate(`/complete-registration?qrid=${qrid}`, { state: { email: email } });
    } catch (error) {
      setErrors([]);
      setErrors([error.message]);
    } finally {
      setLoading(false);
    }
  };

  const showProfileSelectionPopup = (profiles, tagID) => {
    const selectedProfileID = prompt("Select a profile ID to link with tribute tag: " + tagID, profiles[0]?.id || ""); // Simplified example
    if (selectedProfileID) {
      linkTributeTag(selectedProfileID, tagID);
      navigate(`/profile-linked-successfully?qrid=${qrid}`);
    }
  };


  return (
    <div className="mx-4 flex h-full flex-col items-center justify-between space-y-4 md:space-y-0 px-4 md:px-16">
      <header className="text-3xl md:mb-0 xl:text-4xl 2xl:text-5xl 3xl:mb-8 3xl:text-7xl">
        <img src="/hearts-logo.png" alt="" className="w-32" />
      </header>
      <form
        className="xl::space-y-8 flex w-full flex-col justify-between space-y-4 lg:space-y-6"
        onSubmit={onSubmit}
      >
        <header className="leading-12 mb-2 text-center">
          <h1 className="whitespace-nowrap text-xl font-medium md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl">
            Welcome to Hearts Tribute!
          </h1>
          <h3 className="whitespace-nowrap text-sm mt-2 text-secondaryDarkGray md:text-sm xl:text-base 2xl:text-xl 3xl:text-2xl">
            Please fill the information to create your account.
          </h3>
        </header>
        <InputText
          value={firstName}
          onChange={onChange}
          placeholder="First Name"
          type="text"
          name="FirstName"
        />
        <InputText
          value={lastName}
          onChange={onChange}
          placeholder="Last Name"
          type="text"
          name="LastName"
        />
        <InputText
          icon={"/images/email.svg"}
          value={email}
          onChange={onChange}
          placeholder="Email"
          type="email"
          name="Email"
        />
        <InputPassword
          icon={"/images/password.svg"}
          value={password}
          onChange={onChange}
          placeholder="Password"
          name="Password"
        />
        <InputPassword
          icon={"/images/password.svg"}
          value={confirmPassword}
          onChange={onChange}
          placeholder="Confirm Password"
          name="ConfirmPassword"
        />

        {/* Agree to terms and conditions check box */}
        <div className="flex items-center space-x-2">
          <input
            onChange={() => setTerms(!terms)}
            value={terms}
            name="terms"
            id="terms"
            type="checkbox"
            className="h-4 w-4"
          />
          <label className="text-xs" htmlFor="terms">
            I agree to the{" "}
            <a
              className="underline text-blue-600"
              target="__blank"
              href="https://www.heartstribute.com/terms-of-service/"
            >
              terms and conditions
            </a>
          </label>
        </div>

        <div className="flex flex-col space-y-2">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>
        <button
          className="mx-auto w-1/2 rounded-lg border border-white bg-primary py-2 text-base font-semibold text-white hover:border-primary hover:bg-white hover:text-primary md:mx-0 md:w-full md:py-3 md:text-lg 2xl:py-6 2xl:text-xl 3xl:py-9 3xl:text-3xl"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "CREATE ACCOUNT"}
        </button>
        <footer className="text-center font-medium text-secondaryDarkGray xl:text-xl 3xl:text-3xl">
          Already have an account?{" "}
          <Link
            className="cursor-pointer font-semibold text-primary underline"
            to={`/login?qrid=${qrid}`}
          >
            Log In
          </Link>
        </footer>
      </form>
      <div className="hidden lg:block tall:block"></div>
    </div>
  );
}
