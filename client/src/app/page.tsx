"use client";
import React from "react";
import { useRouter } from "next/navigation";
export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen  min bg-gray-50 text-[#000]">
      <h1>Welcome to audit platform</h1>{" "}
      <div className="flex flex-col">
        <button
          onClick={() => {
            router.push("/register");
          }}
        >
          Register
        </button>

        <button
          onClick={() => {
            router.push("/login");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
