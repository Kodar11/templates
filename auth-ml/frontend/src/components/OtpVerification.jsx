import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function OtpVerification({ nextRoute = '/complete-registration' }) {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/verify-otp', { email, otp });

      if (res.data.success) {
        toast.success('OTP verified');
        navigate(nextRoute, { state: { email } });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('OTP verification failed');
    }
  };

  if (!email) {
    return (
      <div className="text-center text-red-600 text-sm">
        Invalid access. Please go back and re-enter your email.
      </div>
    );
  }

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
          One-Time Password (OTP)
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          placeholder="Enter the 6-digit code"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Verify OTP
        </button>
      </div>
    </form>
  );
}

export default OtpVerification;
