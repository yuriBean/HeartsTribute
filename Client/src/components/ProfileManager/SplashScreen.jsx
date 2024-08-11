import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserProfiles, linkProfileToQR } from '../../services/profileManager.service'; // Adjust the import based on your service structure
import Modal from 'react-modal'; // Ensure you have Modal installed
import Spinner from '../../components/Common/Spinner';

const SplashScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uniqueId = queryParams.get('id');
  
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  useEffect(() => {
    if (uniqueId) {
      localStorage.setItem('tributeTagId', uniqueId);
    }
    fetchUserProfiles();
  }, [uniqueId]);

  const fetchUserProfiles = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const profiles = await getUserProfiles(user.id);
      const unlinkedProfiles = profiles.filter(profile => !profile.qr_id); // Assuming qr_id indicates linkage
      setProfiles(unlinkedProfiles);
      setLoading(false);
      if (unlinkedProfiles.length > 0) {
        setIsModalOpen(true);
      } else {
        // No profiles found, navigate to create profile
        navigate('/create-profile', { state: { qrId: uniqueId } });
      }
    } catch (error) {
      console.log("Failed to fetch user profiles", error);
      setLoading(false);
    }
  };

  const handleProfileLinking = async () => {
    try {
      await linkProfileToQR(selectedProfileId, uniqueId);
      alert("Profile linked successfully!");
      navigate(`/profile/${selectedProfileId}`);
    } catch (error) {
      console.error("Failed to link profile", error);
    }
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return <Spinner text="Loading..." />;
  }

  return (
    <div className="splash-screen flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to Hearts Tribute</h1>
      <p className="mt-4 text-center">
        This Tribute Tag isn't registered yet. To get started - please create an account or sign in if you already have an account.
      </p>
      <div className="mt-6">
        <button onClick={handleCreateAccount} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Create an Account
        </button>
        <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded">
          Log In
        </button>
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>Select a Profile to Link</h2>
        <p>Please select a profile to link with the scanned tribute tag:</p>
        <ul>
          {profiles.map(profile => (
            <li key={profile.id}>
              <label>
                <input
                  type="radio"
                  value={profile.id}
                  onChange={() => setSelectedProfileId(profile.id)}
                />
                {profile.name} {/* Adjust based on your profile structure */}
              </label>
            </li>
          ))}
        </ul>
        <button onClick={handleProfileLinking} disabled={!selectedProfileId}>
          Link Profile
        </button>
      </Modal>
    </div>
  );
};

export default SplashScreen;