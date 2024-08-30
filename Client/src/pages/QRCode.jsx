import Spinner from "../components/Common/Spinner";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQRCode, getPrivateOwner } from "../services/qrcode.services";
import { requestAccess } from "../services/profileManager.service"; // Import the function to request access
import { notifySuccess, notifyError } from "../utils/toastNotifications";
import { useAuth } from "../utils/AuthContext";

export default function QRCode() {
    const navigate = useNavigate();
    const { qr_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [qrRecord, setQrRecord] = useState(null);
    const user = useAuth();


    const getQR = async () => {
        try {
            const QRrecord = await getQRCode(qr_id);
            setQrRecord(QRrecord);
            const isOwner = await getPrivateOwner(QRrecord.profile_id, user.uid);
            if (!QRrecord) {
                navigate("/404");
            } else {
                if (QRrecord.profile_id) {
                    if (QRrecord.profile_visibility || isOwner) 
                    // if (QRrecord) 
                        {
                        navigate(`/profile/${QRrecord.profile_id}`); 
                    } else {
                        setLoading(false);
                    }
                } else {
                    navigate(`/no-profile-connected?qrid=${qr_id}`);
                }
            }
        } catch (error) {
            console.log(error);
            navigate("/404"); 
        }
    };

    const handleRequestAccess = async () => {
        try {
            await requestAccess(qrRecord.profile_id); 
            notifySuccess("Access request sent successfully!");
            navigate("/"); 
        } catch (error) {
            console.error("Failed to send access request", error);
            notifyError("Failed to send access request. Please try again.");
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
            The owner of this profile wishes to keep it private. If
            you would like to request access, please send a request to the
            profile owner.
            </p>
            <button onClick={handleRequestAccess} className="bg-primary text-white px-4 py-2 rounded mt-4">
                Request Access
            </button>
        </div>
    );
}
