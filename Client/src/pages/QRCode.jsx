import Spinner from "../components/Common/Spinner";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQRCode } from "../services/qrcode.services";
import { requestAccess } from "../services/profileManager.service"; // Import the function to request access

export default function QRCode() {
    const navigate = useNavigate();
    const { qr_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [qrRecord, setQrRecord] = useState(null);

    const getQR = async () => {
        try {
            const QRrecord = await getQRCode(qr_id);
            setQrRecord(QRrecord);
            if (!QRrecord) {
                navigate("/404");
            } else {
                if (QRrecord.profile_id) {
                    if (QRrecord.profile_visibility) 
                    // if (QRrecord) 
                        {
                        navigate(`/profile/${QRrecord.profile_id}`); // Redirect to public profile
                    } else {
                        setLoading(false);
                    }
                } else {
                    navigate(`/no-profile-connected?qrid=${qr_id}`);
                    console.log(qr_id);
                }
            }
        } catch (error) {
            console.log(error);
            navigate("/404"); // In case of error, navigate to 404
        }
    };

    const handleRequestAccess = async () => {
        try {
            console.log("Profile ID for access request:", qrRecord.profile_id);
            await requestAccess(qrRecord.profile_id); // Function to request access
            alert("Access request sent successfully!");
            navigate("/"); // Redirect to home or another page
        } catch (error) {
            console.error("Failed to send access request", error);
            alert("Failed to send access request. Please try again.");
        }
    };

    useEffect(() => {
        if (!qr_id) {
            navigate("/404");
        } else {
            getQR();
        }
    }, []);

    if (loading) {
        return <Spinner text="Redirecting to Profile..." />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Profile Access</h1>
            <p className="mt-4">
                This profile is private. Would you like to request access?
            </p>
            <button onClick={handleRequestAccess} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                Request Access
            </button>
        </div>
    );
}
