import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 px-6 md:px-36 py-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-700 pb-6">
        {/* Left Section */}
        <div className="md:w-1/3 mb-6 md:mb-0">
          <img src={assets.logo_dark} alt="Edemy Logo" className="w-24 mb-4" />
          <p className="text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </div>

        {/* Middle Section */}
        <div className="md:w-1/3 mb-6 md:mb-0">
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">About us</a></li>
            <li><a href="#" className="hover:text-white transition">Contact us</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy policy</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="md:w-1/3">
          <h3 className="text-white font-semibold mb-3">Subscribe to our newsletter</h3>
          <p className="text-sm mb-3">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <p className="text-center text-sm mt-6 text-gray-500">
        Copyright 2024 © Edemy. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
