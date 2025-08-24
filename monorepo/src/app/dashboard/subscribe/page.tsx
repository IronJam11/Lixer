"use client";

import React, { useState } from "react";

export default function SubscribePage() {
  const [form, setForm] = useState({
    email: "",
    pool: "",
    token: "",
    wallet: ""
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    // TODO: handle actual subscribe logic
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-teal-300 mb-6 text-center">Subscribe for Pool Alerts</h1>
        {submitted ? (
          <div className="text-center text-teal-300 text-lg font-medium py-8">Thank you for subscribing!</div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="pool" className="block text-sm font-medium text-gray-300 mb-1">Pool Address</label>
              <input
                type="text"
                name="pool"
                id="pool"
                required
                value={form.pool}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0x..."
              />
            </div>
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-1">Token Address</label>
              <input
                type="text"
                name="token"
                id="token"
                required
                value={form.token}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0x..."
              />
            </div>
            <div>
              <label htmlFor="wallet" className="block text-sm font-medium text-gray-300 mb-1">Wallet Address</label>
              <input
                type="text"
                name="wallet"
                id="wallet"
                required
                value={form.wallet}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0x..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
