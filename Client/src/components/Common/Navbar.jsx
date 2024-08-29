import { useState, useEffect } from "react";
import Hamburger from "/images/hamburger.png";
import Cross from "/images/close.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 z-10 flex w-full justify-between border-b bg-white px-6 md:px-10">
        <div>
          <Link to="https://heartstribute.com">
            <img src="/hearts-logo.png" alt="" className="w-36 md:w-48" />
          </Link>
        </div>
        <div className="hidden gap-6 md:flex md:items-center">
          <ul className="mr-18 flex space-x-12 items-center">
            <Link to="/discover">Discover</Link>

            <a target="__blank" href="https://heartstribute.com/contact">
              Contact
            </a>
            {user && (
              <Link to="/profile-manager/tribute-tags">
                <button className="rounded-ful w-9">
                  <img
                    src={
                      user.profile_picture || "/images/placeholder-profile.jpg"
                    }
                    className="aspect-square rounded-full object-cover"
                    alt=""
                  />
                </button>
              </Link>
            )}

            <Link
              className="rounded-md bg-black px-6 py-2 font-bold text-white"
              to="https://www.heartstribute.com/product/tribute-tag/"
            >
              Buy Now
            </Link>
          </ul>
          {user ? (
            <>
              <Link to="/signout">
                <button className="rounded-md bg-black px-6 py-2 font-bold text-white">
                  Sign Out
                </button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <button className="rounded-md bg-black cursor-pointer px-6 py-2 font-bold text-white">
                Login
              </button>
            </Link>
          )}
        </div>
        <div className="md:hidden flex items-center ">
          <div className="" onClick={() => setOpen(!open)}>
            <img
              src={open ? Cross : Hamburger}
              className="self-center w-5"
            />
          </div>
        </div>
      </nav>

      {/* Menu show after clicking ham on small devices */}

      <div
        className={`fixed flex flex-col items-center justify-center bottom-0 z-[1] h-screen w-3/4 bg-black text-center text-xl text-white transition-all duration-500 ease-in md:hidden ${open ? "right-[0px]" : "hidden"}`}
      >
        <ul className="flex flex-col space-y-6">
          <Link to="/discover">Discover</Link>

          <Link to="https://www.heartstribute.com/product/tribute-tag/">Buy Now</Link>
          <a target="__blank" href="https://heartstribute.com/contact">
            Contact
          </a>

          {user ? (
            <>
              <Link to="/profile-manager/tribute-tags">Profile Manager Settings</Link>
              <Link to="/signout">Sign out</Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </ul>
      </div>
    </>
  );
}
