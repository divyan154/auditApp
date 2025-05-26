"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import ErrorAlert from "@/components/ErrorAlert";
import SubmitButton from "@/components/SubmitButton";
import api from "@/services/api";

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      const response = await api.post(
        "/login",
        {
          name: formData.name,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ⚠️ Important for cookie-based auth
        }
      );

      if (response.status === 200) {
        router.push("/dashboard"); // Refresh the page to get the updated user state
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {error && <ErrorAlert message={error} />}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput
            id="name"
            name="name"
            label="Username"
            value={formData.name}
            onChange={handleChange}
          />
          <FormInput
            id="password"
            name="password"
            label="Password"
            type="password"
            minLength={6}
            value={formData.password}
            onChange={handleChange}
          />

          <SubmitButton loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
