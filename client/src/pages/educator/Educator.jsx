import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/educator/Navbar';
import Sidebar from '../../components/educator/Sidebar';
import Footer from '../../components/educator/Footer';

const Educator = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar */}
      <Navbar />
      
      {/* Main Layout */}
      <div className='flex'>
        {/* Sidebar */}
        <div className='w-64 bg-gray-50 border-r border-gray-200 min-h-screen'>
          <Sidebar />
        </div>
        
        {/* Content Area */}
        <div className='flex-1 p-6'>
          <div className='bg-white shadow-lg rounded-2xl p-6'>
            <Outlet />
          </div>
        </div>
        
      </div>
      <Footer/>
    </div>
  );
};

export default Educator;