
const CreateProfileModal = ({ onCreateProfile, onClose }) => {

  const handleSubmit = async (event) => {
    event.preventDefault();
    onCreateProfile();
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
        <h2 className="text-xl text-center font-semibold mb-8">
          Start by Linking a Profile to the QR Code!
        </h2>
        <form >
        
            <p className="my-5">Looks like you don't have a profile linked to this QR Code. Get started by creating a new profile or linking an existing one!</p>
          
          <button onClick={handleSubmit} className="bg-primary text-white rounded-md p-2 my-5 w-full">
            Get Started
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