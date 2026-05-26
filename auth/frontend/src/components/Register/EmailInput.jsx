import React from 'react';
import EmailOtpInput from '../EmailOtpInput';
function EmailInputPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 border border-gray-200 rounded-lg shadow bg-white">
        <h2 className="text-2xl font-semibold text-center mb-4">Enter your email</h2>
        <EmailOtpInput redirectTo="/verify-otp" />
      </div>
    </div>
  );
}

export default EmailInputPage;
