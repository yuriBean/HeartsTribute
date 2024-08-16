import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import {
    createQRCode,
    getQRCodeIDs,
    removeUsedID,
} from "../queries/qrcode";

import { uploadImage } from "../queries/imgUploader";
import { useSearchParams } from "react-router-dom";
import UnusedIDsTable from "../components/UnusedIDsTable";

export default function CreateQRCode() {
    const [searchParams, setSearchParams] = useSearchParams();
    const websiteUrl = "https://www.app.heartstribute.com/";
    const qrCodeRef = useRef(null);
    const [profile_id, setProfileId] = useState("");
    const [qrIsVisible, setQrIsVisible] = useState(false);
    const [qrID, setQrID] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [qrids, setQrids] = useState([]);
    const [usedIds, setUsedIds] = useState([]); // Define usedIds state
    const [loading, setLoading] = useState(false);

    const handleQrCodeGenerator = async () => {
        try {
            console.log("button clicked for generator ");
            setDisabled(true);
            console.log("Current QR IDs:", qrids);
            console.log("Entered QR ID:", qrID);
    
            if (!qrids.some(qr => qr.id === qrID)) {
                alert("Invalid QR ID or QR ID already exists");
                setQrID("");
                setDisabled(false);
                return;
            }
            
            let qrCodeValue;
            if (profile_id) {
                qrCodeValue = websiteUrl + 'profile/' + profile_id;
            } else {
                qrCodeValue = websiteUrl + 'login?qrid=' + qrID;
            }

            setQrID(qrCodeValue);
            setQrIsVisible(true);
            setTimeout(async () => {
                const qrCodeImageUrl = await htmlToImage.toBlob(qrCodeRef.current);
                console.log(qrCodeImageUrl);
                // Upload the blob to storage and get the URL
                const imageUrl = await uploadImage(qrCodeImageUrl, true);
                console.log(imageUrl);
                let data = {
                    qr_id: qrID,
                    image: imageUrl,
                    profile_id: profile_id || null,
                    active: true,
                };
                await createQRCode(data);
                await removeUsedID(qrID);
                getQRIds();
                downloadQRCode();
                setDisabled(false);
            }, 100);
        } catch (error) {
            console.error("Error generating QR code:", error);
            setDisabled(false);
        }
    };    
    const downloadQRCode = () => {
        htmlToImage
            .toJpeg(qrCodeRef.current)
            .then(function (dataUrl) {
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = `${profile_id + "__" + new Date()}.png`;
                link.click();
            })
            .catch(function (error) {
                console.error("Error generating QR code:", error);
            });
    };

    const getQRIds = async () => {
        setLoading(true);
        const data = await getQRCodeIDs();
        setQrids(data.idsAvailable);
        console.log(data);
        setLoading(false);
    };

    const getUsedIds = async () => {
        const fetchedUsedIds = await getUsedQRCodeIDs(); // Fetch used QR IDs
        setUsedIds(fetchedUsedIds.usedIds); // Set the used IDs in state
    };

    useEffect(() => {
        getQRIds();
        getUsedIds(); // Fetch used IDs when the component mounts
    }, []);

    useEffect(() => {
        if (searchParams.has("profile_id")) {
            const profileIdFromParams = searchParams.get("profile_id");
            console.log(profileIdFromParams);
            setProfileId(profileIdFromParams);
        }
    }, [searchParams]);

    return !loading ? (
        <div className="overflow-y-auto">
            <h1>QR Code Generator</h1>
            <div className="qrcode__container--parent flex flex-col">
                <div className="qrcode__input">
                    <input
                        type="text"
                        placeholder="Enter QR ID"
                        value={qrID}
                        onChange={(e) => setQrID(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter Profile ID"
                        value={profile_id}
                        onChange={(e) => setProfileId(e.target.value)}
                    />

                    <button
                        onClick={handleQrCodeGenerator}
                        className="bg-primary disabled:opacity-50"
                        disabled={disabled}
                    >
                        Generate QR Code & Save Record In database
                    </button>
                </div>
                {qrIsVisible && (
                    <div className="qrcode__download">
                        <div
                            className="qrcode__image bg-white p-1 "
                            ref={qrCodeRef}
                        >
                            <QRCode value={qrID} size={300} />
                        </div>
                        <button onClick={downloadQRCode} className="bg-primary">
                            Download QR Code
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-5">
                <UnusedIDsTable ids={qrids} usedIds={usedIds} loading={loading} /> {/* Pass usedIds */}
            </div>
        </div>
    ) : (
        <p>Loading...</p>
    );
}