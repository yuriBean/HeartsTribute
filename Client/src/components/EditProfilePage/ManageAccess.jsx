import { useEffect, useState } from "react";
import Spinner from "../Common/Spinner";
import { useProfile } from "../Providers/EditProfileProvider";
import {
  addAllowedUserToProfile,
  removeAllowedUserFromProfile,
  removeRequestedUserFromProfile,
} from "../../services/profileManager.service";
import {
  notifySuccess,
  notifyError,
} from "../../utils/toastNotifications";
import { useNavigate } from "react-router-dom";

export default function ManageAccess() {
  const { profile, loading, getProfile } = useProfile();
  const [emailInput, setEmailInput] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const grantAccess = async (email) => {
    if (!validateEmail(email)) {
      notifyError("Please enter a valid email address");
      return;
    }
    try {
      await addAllowedUserToProfile(profile.id, email);
      notifySuccess("Access Granted");
      getProfile();
      setEmailInput(""); 
    } catch (error) {
      console.error(error);
      notifyError("Error granting access");
    }
  };

  const removeRequestedUser = async (email) => {
    try {
      await removeRequestedUserFromProfile(profile.id, email);
      notifySuccess("Request Removed");
      getProfile();
    } catch (error) {
      console.error(error);
      notifyError("Error removing request");
    }
  };

  const revokeAccess = async (email) => {
    try {
      await removeAllowedUserFromProfile(profile.id, email);
      notifySuccess("Access Revoked");
      profile.allowedUsers = profile.allowedUsers.filter(userEmail => userEmail !== email);
      getProfile();
    } catch (error) {
      console.error(error);
      notifyError("Error revoking access");
    }
  };

  useEffect(() => {}, []);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  return !loading && profile ? (
    <div className="space-y-4 px-2 py-10 mb-20">

      <div className="my-4">
        <h1 className="text-2xl font-bold my-2">Manage Access</h1>
        <p>Share your profile privately with chosen family members and friends.</p>
        <div className="flex flex-col md:flex-row justify-between items-center my-4">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter email to grant access"
            className="rounded-md border p-2 w-3/4"
          />
          <button
            onClick={() => grantAccess(emailInput)}
            className="button-primary mt-2 md:mt-0 md:ml-2"
          >
            Grant Access
          </button>
        </div>
      </div>
      <p className="text-sm my-5 md:text-lg text-left">
      These users will have access to this profile, even if it's private, and will be able to post tributes.
      </p>

      {profile.requestedUsers && profile.requestedUsers.length > 0 ? (
        <div className="space-y-4 my-2 py-1">
          <h1 className="text-2xl font-bold">
            Access Requests ({profile.requestedUsers.length})
          </h1>
          {profile.requestedUsers.map((email) => (
            <div className="flex flex-col md:flex-row justify-between items-center" key={email}>
              <h1 className="text-lg">{email}</h1>
              <div className="flex gap-x-4">
                <button
                  onClick={() => grantAccess(email)}
                  className="button-primary"
                >
                  Grant Access
                </button>
                <button
                  onClick={() => removeRequestedUser(email)}
                  className="button-primary bg-red-500"
                >
                  Remove Request
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
        <h1 className="text-2xl my-3 " >
        Pending access requests
        </h1>
        <p>
          No Access Requests at the moment
        </p>
        </>
      )}

      {profile.allowedUsers && profile.allowedUsers.length > 0 ? (
        <div className="space-y-4 my-2 py-1">
          <h1 className="text-2xl font-bold">
            Allowed Users ({profile.allowedUsers.length})
          </h1>
          {profile.allowedUsers.map((email) => (
            <div className="flex flex-col md:flex-row justify-between items-center" key={email}>
              <h1 className="text-lg">{email}</h1>
              <button
                onClick={() => revokeAccess(email)}
                className="button-primary bg-red-500"
              >
                Revoke Access
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
        <h1 className="text-2xl my-3"> Allowed Users</h1>
        <p> No Allowed Users</p>
        </>
      )}
      <div className="flex justify-end">
      <button onClick={handleCancel} className="button-primary bg-red-500">
          Cancel
        </button>
        </div>
    </div>
  ) : (
    <Spinner />
  );
}
