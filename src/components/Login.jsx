import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", form);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 overflow-hidden relative">
      {/* Background Glow Effects */}
      <div className="absolute w-96 h-96 bg-purple-500 opacity-30 blur-3xl rounded-full top-16 left-16 animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-20 blur-3xl rounded-full bottom-16 right-16 animate-ping"></div>

      {/* Animated Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="relative bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-14 w-[550px] border border-white/20"
      >
        <h2 className="text-5xl font-extrabold text-center text-white mb-10 tracking-wide drop-shadow-lg">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
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
              className="w-full bg-transparent border-b-2 border-gray-400 text-white text-lg pl-12 py-4 focus:outline-none focus:border-indigo-400 transition"
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
              placeholder="Enter your password"
              className="w-full bg-transparent border-b-2 border-gray-400 text-white text-lg pl-12 py-4 focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99,102,241,0.5)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all duration-200"
          >
            Login
          </motion.button>
        </form>

        <p className="text-gray-300 text-center mt-8 text-lg">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
