import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 p-6 rounded-lg border border-green-500 shadow-lg">
            <div className="font-mono text-green-500 space-y-4">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <span className="animate-pulse">_</span>
              </div>
              <div className="text-sm">
                <p className="mb-2">/* ========================================== */</p>
                <p className="mb-2">/* SECURITY CHALLENGE: FIND THE VULNERABILITIES */</p>
                <p className="mb-2">/* ========================================== */</p>
                <p className="mt-4 mb-2">Welcome to the Security Challenge!</p>
                <p className="mb-2">Your mission, should you choose to accept it:</p>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Identify potential security vulnerabilities</li>
                  <li>Test for authentication bypasses</li>
                  <li>Look for injection points</li>
                  <li>Analyze session management</li>
                  <li>Check for data exposure</li>
                </ul>
                <p className="mt-4 text-green-400">Happy Hacking!</p>
                <p className="text-xs mt-4 text-gray-500">Note: This is a controlled environment for educational purposes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
