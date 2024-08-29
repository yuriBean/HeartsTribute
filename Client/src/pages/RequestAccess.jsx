import Layout from "../components/Layout/Layout";
import { addRequestedUserToProfile } from "../services/profileManager.service";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { notifyError, notifySuccess } from "../utils/toastNotifications";
import { useNavigate } from "react-router-dom";

export default function RequestAccess() {
  const navigate = useNavigate();
  const { profile_id } = useParams();
  const { user } = useAuth();
  const requestAccess = async () => {
    try {
      await addRequestedUserToProfile(profile_id, user.email);
      notifySuccess("Request Sent");
    } catch (error) {
      console.error(error);
      notifyError("Error sending request");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[40rem]">
        {user ? (<>
          <h1 className="text-xl md:text-2xl font-bold text-center text-primary">
            The owner of this profile wishes to keep it private. If
            you would like to request access, please send a request to the
            profile owner
          </h1>
          <button onClick={requestAccess} className="button-primary my-4">
            Request Access
          </button>
        </>) : (
          <>
            <h1 className="text-xl md:text-2xl font-bold text-center text-primary">
              The owner of this profile wishes to keep it private. If
              you would like to request access, please log in or create an account and send a request to the
              profile owner
            </h1>
            <div className="flex space-x-4">
              <button onClick={() => navigate("/login")} className="button-primary my-4 px-4 py-2">
                Login
              </button>
              <button onClick={() => navigate("/signup")} className="button-primary my-4 px-4 py-2">
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
