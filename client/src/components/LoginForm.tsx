import React from 'react'
import axios from "axios";
import FormInput from "@/components/FormInput";
import ErrorAlert from "@/components/ErrorAlert";
import SubmitButton from "@/components/SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
     const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        {
          formData: {
            name: formData.name,
            password: formData.password,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      if (!response) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/dashboard");
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
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              minLength={6}
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <SubmitButton loading={loading} />
          </form>
        </div>
      </div>
  )
}

export default LoginForm