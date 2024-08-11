import React, { useState } from "react";

const CreateProfileModal = ({ isOpen, onClose, onCreateProfile }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateProfile();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
        <h2 className="text-xl text-center font-semibold mb-8">Start by Creating a Profile!</h2>
        <form onSubmit={handleSubmit}>
            <p className="my-5 ">You don't have a profile yet.</p>        
          <button type="submit" className="bg-primary text-white rounded-md p-2 my-5 w-full ">Create Profile</button>
        </form>
        <button onClick={onClose} className="my-2 text-gray-600 hover:underline ">Close</button>
      </div>
    </div>
  );
};

export default CreateProfileModal;