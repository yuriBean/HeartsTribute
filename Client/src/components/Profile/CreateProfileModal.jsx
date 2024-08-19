
const CreateProfileModal = ({ onCreateProfile, onClose }) => {

  const handleSubmit = async (event) => {
    event.preventDefault();
    onCreateProfile();
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-7 w-11/12 max-w-md shadow-lg">
        <h2 className="text-xl text-center font-semibold mb-8">
          Activate Your Tribute Tag
        </h2>
        <form >
        
            <p className="my-5">Let’s get you started with setting up your Tribute Tag.</p>
          
          <button onClick={handleSubmit} className="bg-primary text-white rounded-md p-2 my-5 w-full">
            Get Started
          </button>
        </form>
        <button onClick={onClose} className="my-1 text-gray-600 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateProfileModal;