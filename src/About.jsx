import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function About() {
  const developers = [
    {
      name: "Ashish Kumar",
      role: "Full Stack Developer",
      img: "ashish.jpg",
      desc: "Expert in crafting responsive and interactive UIs using React.js, Tailwind CSS, and Framer Motion. Loves building user-friendly design systems. Passionate about backend architecture, building robust REST APIs, and optimizing performance using Node.js, Express, and MongoDB",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      instagram: "https://instagram.com/",
    },
    {
      name: "Ayush Srivastava",
      role: "Frontend Developer",
      img: "ayush.jpg",
      desc: "Expert in crafting responsive and interactive UIs using React.js, Tailwind CSS, and Framer Motion. Loves building user-friendly design systems.",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      instagram: "https://instagram.com/",
    },
    {
      name: "RaviRanjan Pathak",
      role: "Frontend and Algorithm Specialist",
      img: "ravi.jpg",
      desc: "Expert in crafting responsive and interactive UIs using React.js, Tailwind CSS, and Framer Motion. Loves building user-friendly design systems. Loves to visualize and optimize algorithms for better understanding. Specializes in DSA, pathfinding, and sorting algorithm visualizations.",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      instagram: "https://instagram.com/",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center py-20 px-4">
      
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"
      >
        Meet Our Developers
      </motion.h1>

      {/* Project Mission */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-3xl text-center text-gray-300 mb-16"
      >
        <p className="mb-4">
          <span className="text-cyan-400 font-semibold">AlgoViz</span> is a
          visual learning platform designed to make algorithms easier to
          understand through interactive animations and real-time data
          visualization. Our mission is to simplify complex computer science
          concepts for students, developers, and enthusiasts.
        </p>
        <p>
          We believe that visual learning helps in building a stronger conceptual
          foundation. Each algorithm is carefully implemented, tested, and
          animated for clarity and engagement.
        </p>
      </motion.div>

      {/* Divider */}
      <div className="w-40 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-16"></div>

      {/* Developer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        {developers.map((dev, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3, duration: 0.8 }}
            className="bg-gray-800 rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition duration-300 hover:shadow-cyan-500/50"
          >
            <motion.img
              src={dev.img}
              alt={dev.name}
              className="w-28 h-28 rounded-full mx-auto border-4 border-cyan-400 mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <h2 className="text-2xl font-semibold mb-1">{dev.name}</h2>
            <h3 className="text-cyan-400 mb-3">{dev.role}</h3>
            <p className="text-gray-300 text-justify mb-4">{dev.desc}</p>

            {/* Social Links */}
            <div className="flex justify-center gap-4 text-2xl mt-4">
              <motion.a
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: "#00FFFF" }}
                className="text-gray-400 hover:text-cyan-400"
              >
                <FaGithub />
              </motion.a>
              <motion.a
                href={dev.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: "#0A66C2" }}
                className="text-gray-400 hover:text-blue-500"
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href={dev.instagram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: "#E1306C" }}
                className="text-gray-400 hover:text-pink-500"
              >
                <FaInstagram />
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-20 text-gray-500 text-sm"
      >
        © {new Date().getFullYear()} AlgoViz Team. All rights reserved.
      </motion.footer>
    </div>
  );
}
