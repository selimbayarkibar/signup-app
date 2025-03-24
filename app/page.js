"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const errors = [];
    if (!name) errors.push("Name");
    if (!email) errors.push("Email");

    if (errors.length > 0) {
      setStatus(
        `⚠️ ${errors.join(" and ")} ${
          errors.length > 1 ? "are" : "is"
        } required.`
      );
      return;
    }

    const { error } = await supabase.from("users").insert([{ name, email }]);

    if (error) {
      if (
        error.message.toLowerCase().includes("check constraint") ||
        error.message.toLowerCase().includes("email")
      ) {
        setStatus("❌ Email must match the format user@domain.com");
      } else if (
        error.code === "23505" ||
        error.message.includes("duplicate key")
      ) {
        setStatus("A user with this email already exists.");
      } else {
        setStatus("❌ Error: " + error.message);
      }
    } else {
      setStatus("✅ Successfully signed up!");
      setName("");
      setEmail("");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">Sign Up Form</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Sign Up
          </button>
        </form>
        {status && (
          <p
            className={`mt-4 text-sm text-center ${
              status.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </main>
  );
}
