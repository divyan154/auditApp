"use client";

import LoginForm from "@/components/LoginForm";
import Link from "next/link";


export default function LoginPage() {
 

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          New User?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register
          </Link>
        </p>
      </div>
      <LoginForm/>
      
    </main>
  );
}
