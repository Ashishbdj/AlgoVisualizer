import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", form);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 relative overflow-hidden">
      {/* Background Glow Animation */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500 opacity-20 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-purple-500 opacity-25 blur-3xl rounded-full bottom-10 right-10 animate-ping"></div>

      {/* Signup Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90 }}
        className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-14 w-[550px]"
      >
        <h2 className="text-5xl font-extrabold text-center text-white mb-10 tracking-wide drop-shadow-lg">
          Create Account ✨
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-4 text-gray-300 text-xl" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full bg-transparent border-b-2 border-gray-400 text-white text-lg pl-12 py-4 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-300 text-xl" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full bg-transparent border-b-2 border-gray-400 text-white text-lg pl-12 py-4 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-4 text-gray-300 text-xl" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              className="w-full bg-transparent border-b-2 border-gray-400 text-white text-lg pl-12 py-4 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147,51,234,0.6)" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all duration-200"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-gray-300 text-center mt-8 text-lg">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
