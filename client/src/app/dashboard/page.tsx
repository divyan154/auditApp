"use client";

import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  // Fetch user info from backend
  useEffect(() => {
    api
      .get("/user")
      .then((res) => {
        console.log("User data fetched successfully:", res.data);
        setUsername(res.data.name); // assuming res.data is the username
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          router.push("/register");
        } else {
          console.error("An unexpected error occurred:", err);
        }
      });
  }, []);

  const handleLogout = async () => {
    await api.post("/logout", {
      credentials: "include",
    });

    router.push("/register");
    toast.success("Logged out successfully!");
  };

  const goToAuditPage = () => {
    router.push("/audit/new");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-600">
          Welcome, {username} 👋
        </h1>

        <div className="space-y-4">
          <button
            onClick={goToAuditPage}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Make New Audit
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
