"use client";

import React, { useState } from "react";
import Image from "next/image";
import lixerLogo from '@/assets/logos/Lixer.png';

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
              <label htmlFor="pool" className="block text-xs font-semibold text-gray-300 mb-2">Pool Address</label>
              <input
                type="text"
                name="pool"
                id="pool"
                required
                value={form.pool}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-gray-600 transition-all"
                placeholder="0x..."
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="token" className="block text-xs font-semibold text-gray-300 mb-2">Token Address</label>
              <input
                type="text"
                name="token"
                id="token"
                required
                value={form.token}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-black border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-gray-600 transition-all"
                placeholder="0x..."
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="wallet" className="block text-xs font-semibold text-gray-300 mb-2">Wallet Address</label>
              <input
                type="text"
                name="wallet"
                id="wallet"
                required
                value={form.wallet}
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
