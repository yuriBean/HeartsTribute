import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import { getUserProfiles, linkProfileToQR, createQRCode } from "../../services/profileManager.service";
import { useNavigate } from "react-router-dom";
const CreateProfileModal = ({ qrid, isOpen, onClose, onCreateProfile }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfiles = async () => {
      if (user) {
        const userProfiles = await getUserProfiles(user.uid);
        setProfiles(userProfiles);
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profiles.length === 0) {
      // Create a new profile
      navigate(`/profile-manager/tribute-tags?qrid=${qrid}`);
    } else {
      // Link existing profile
      if (selectedProfileId) {
        await linkProfileToQR(selectedProfileId, qrid);
        await createQRCode(selectedProfileId, qrid); // Ensure QR code is created
        onCreateProfile();
      } else {
        alert("Please select a profile to link.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
        <h2 className="text-xl text-center font-semibold mb-8">
          {profiles.length === 0 ? "Start by Creating a Profile!" : "Link QR Code to a Profile"}
        </h2>
        <form onSubmit={handleSubmit}>
          {profiles.length === 0 ? (
            <p className="my-5">Looks like you don't have a profile yet. Get started by creating a new profile!</p>
          ) : (
            <>
              <p className="my-5">Select a profile to link with the QR code:</p>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
              >
                <option value="">Select a profile</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.first_name} {profile.last_name}
                  </option>
                ))}
              </select>
            </>
          )}
          <button type="submit" className="bg-primary text-white rounded-md p-2 my-5 w-full">
            {profiles.length === 0 ? "Create Profile" : "Link Profile"}
          </button>
        </form>
        <button onClick={onClose} className="my-2 text-gray-600 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateProfileModal;