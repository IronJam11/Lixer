"use client";

import React, { useState } from "react";
import Image from "next/image";
import lixerLogo from '@/assets/logos/Lixer.png';

export default function SubscribePage() {
  const [form, setForm] = useState({
    email: "",
    address: ""
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Create FormData
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("address", form.address);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://lixer.onrender.com";
  fetch(`${apiUrl}/subscriptions/subscribe`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          setSubmitted(true);
        } else {
          alert("Subscription failed. Please try again.");
        }
      })
      .catch(() => {
        alert("Network error. Please try again.");
      });
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-satoshi">
      <div className="w-full max-w-md bg-gray-950 rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <Image src={lixerLogo} alt="Lixer Logo" width={48} height={48} className="mb-2 drop-shadow-lg" />
          <h1 className="text-2xl font-bold text-teal-300 tracking-tight mb-1">Subscribe for Pool Alerts</h1>
          <p className="text-gray-400 text-sm">Get notified for pool, token, and wallet activity</p>
        </div>
        {submitted ? (
          <div className="text-center text-teal-300 text-lg font-medium py-12 animate-in fade-in">Thank you for subscribing!</div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-gray-600 transition-all"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-xs font-semibold text-gray-300 mb-2">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                required
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-gray-600 transition-all"
                placeholder="0x..."
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors shadow-sm"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
