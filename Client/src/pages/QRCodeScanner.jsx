import React from 'react';
import { useNavigate } from 'react-router-dom';
import QrReader from 'react-qr-reader';

const QRCodeScanner = () => {
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      // Redirect to the login page when a valid QR code is scanned
      navigate('/login');
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return ( 
    <div>
      <QrReader
        onScan={handleScan}
        onError={handleError}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default QRCodeScanner;