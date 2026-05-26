// src/components/ForgetPassword/ResetPasswordVerifyOtp.jsx
import React from 'react';
import OtpVerification from '../OtpVerification';

function ResetPasswordVerifyOtp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-xl">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Verify OTP to Reset Password
        </h2>
        <OtpVerification nextRoute="/reset-password" />
      </div>
    </div>
  );
}

export default ResetPasswordVerifyOtp;
