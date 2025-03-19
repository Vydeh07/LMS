import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="text-center p-10 bg-gradient-to-r from-white- to-blue-200 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Learn anything, anytime, anywhere
      </h1>
      <p className="text-gray-700 max-w-md mx-auto mb-6 leading-relaxed">
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id
        veniam aliqua proident excepteur commodo do ea.
      </p>
      <div className="flex justify-center gap-4">
        <button className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-full shadow-md hover:bg-gray-100 transition">
          Get started
        </button>
        <button className="px-6 py-3 flex items-center gap-2 bg-white-500 text-blue-900 font-semibold rounded-full shadow-md hover:bg-blue-500 transition">
          Learn more
          <img src={assets.arrow_icon} alt="arrow_icon" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
