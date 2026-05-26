import React from 'react';
import OtpVerification from '../OtpVerification';

function OtpVerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 border border-gray-200 rounded-lg shadow bg-white">
        <h2 className="text-2xl font-semibold text-center mb-4">Verify OTP</h2>
        <OtpVerification nextRoute="/complete-registration" />
      </div>
    </div>
  );
}

export default OtpVerificationPage;
