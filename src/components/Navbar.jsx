import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    `hover:text-blue-400 ${isActive ? "text-blue-400 font-semibold" : ""}`;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50 shadow-md mb-0">
      <h1 className="text-2xl font-bold tracking-wide">AlgoViz</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-sm">
        <NavLink to="/" className={linkClasses}>Home</NavLink>
        <NavLink to="/algorithms" className={linkClasses}>Algorithms</NavLink>
        <NavLink to="/about" className={linkClasses}>About</NavLink>
        <NavLink to="/login" className={linkClasses}>Login</NavLink>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden focus:outline-none text-2xl"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 flex flex-col items-center space-y-4 py-6 md:hidden">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className={linkClasses}>Home</NavLink>
          <NavLink to="/algorithms" onClick={() => setMenuOpen(false)} className={linkClasses}>Algorithms</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)} className={linkClasses}>About</NavLink>
          <NavLink to="/login" onClick={() => setMenuOpen(false)} className={linkClasses}>Login</NavLink>
        </div>
      )}
    </nav>
  );
}
