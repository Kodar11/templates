"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"; // Make sure you have next-auth installed
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: false }); // Prevent automatic redirection
    setLoading(false);

    // After logout, you can manually redirect like this:
    router.push("/login"); 
  };

  return (
    <nav className="flex items-center justify-between bg-blue-600 text-white p-4 shadow-md">
      <div className="text-2xl font-bold">MyWebsite</div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition disabled:opacity-50"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </nav>
  );
}
