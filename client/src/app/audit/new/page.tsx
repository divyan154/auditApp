// app/audit/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import opencage from "opencage-api-client";
type Question = {
  _id: string;
  questionType: string;
  text: string;
};

type AuditData = {
  outletName: string;
  location: string;
  cleanliness: number;
  image: File | null;
};

export default function AuditPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [auditData, setAuditData] = useState<AuditData>({
    location: "",
    outletName: "",
    image: null,
    cleanliness: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/questions");

        if (!response) throw new Error("Failed to fetch questions");
        const data = response.data;

        console.log(data);
        setQuestions(data);

        // Auto-detect location
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const displayLocation = await getHumanReadableLocation(
              latitude,
              longitude
            );
            setAuditData((prev) => ({
              ...prev,
              location: displayLocation,
            }));
          },
          (err) => {
            console.error("Geolocation error:", err);
            setError("Could not detect location. Please enter manually.");
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleInputChange = (
    field: keyof AuditData,
    value: string | number
  ) => {
    setAuditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (file: File) => {
    setAuditData((prev) => ({
      ...prev,
      image: file,
    }));
  };
  const getHumanReadableLocation = async (
    lat: number,
    lon: number
  ): Promise<string> => {
    try {
      const data = await opencage.geocode({
        key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
        q: `${lat}, ${lon}`,
        language: "fr",
      });
      if (data.status.code === 200 && data.results.length > 0) {
        const city = data.results[0].components.city;
        const state = data.results[0].components.state;
        const res = city + " , " + state;
        // console.log(state);
        return res;
      } else {
        console.log("status", data.status.message);
        console.log("total_results", data.total_results);
        return "";
      }
    } catch (error: any) {
      console.log("error", error.message);
      if (error.status && error.status.code === 402) {
        console.log("hit free trial daily limit");
        console.log("become a customer: https://opencagedata.com/pricing");
      }
      return "";
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("location", auditData.location);
      formData.append("outletName", auditData.outletName);
      formData.append("cleanliness", auditData.cleanliness.toString());
      if (auditData.image) {
        formData.append("image", auditData.image);
      }

      console.log(auditData);

      // Optional: view FormData entries (for debugging)

      const response = await axios.post(
        "http://localhost:3001/audit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if ( response.status !== 201) {
        throw new Error("Audit submission failed");
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading questions...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Form</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question._id} className="space-y-2">
              <label className="block text-sm font-medium">
                {question.text}
              </label>

              {question.questionType === "name" && (
                <input
                  type="text"
                  value={auditData.outletName}
                  onChange={(e) =>
                    handleInputChange("outletName", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              )}

              {question.questionType === "location" && (
                <input
                  type="text"
                  value={auditData.location}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-700"
                  disabled
                  required
                />
              )}

              {question.questionType === "rating" && (
                <select
                  onChange={(e) =>
                    handleInputChange("cleanliness", Number(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">Poor</option>
                  <option value="2">Average</option>
                  <option value="3">Good</option>
                  <option value="4">Very Good</option>
                  <option value="5">Excellent</option>
                </select>
              )}

              {question.questionType === "image" && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files[0])
                  }
                  className="w-full p-2 border rounded"
                  required
                  capture="environment"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Audit"}
        </button>
      </form>
    </div>
  );
}
