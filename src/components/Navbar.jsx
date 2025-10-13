import React, { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50">
      <h1 className="text-2xl font-bold">AlgoViz</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-sm">
        <a href="/" className="hover:text-blue-400">Home</a>
        <a href="#categories" className="hover:text-blue-400">Algorithms</a>
        <a href="/about" className="hover:text-blue-400">About</a>
        <a href="/login" className="hover:text-blue-400">Login</a>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden focus:outline-none"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 flex flex-col items-center space-y-4 py-6 md:hidden">
          <a href="/" className="hover:text-blue-400">Home</a>
          <a href="#categories" className="hover:text-blue-400">Algorithms</a>
          <a href="/about" className="hover:text-blue-400">About</a>
          <a href="/login" className="hover:text-blue-400">Login</a>
        </div>
      )}
    </nav>
  );
}
