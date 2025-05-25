"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Audit Platform</h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/register")}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Register
          </button>

          <button
            onClick={() => router.push("/login")}
            className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
