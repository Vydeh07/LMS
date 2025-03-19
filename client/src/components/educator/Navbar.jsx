import React from 'react';
import { assets, dummyEducatorData } from '../../assets/assets';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md w-full">
      {/* Logo */}
      <Link to='/' className="flex items-center">
        <img src={assets.logo} className="w-28 lg:w-32" alt="Logo" />
      </Link>
      
      {/* User Info */}
      <div className="flex items-center space-x-4 ">
        <p className="text-gray-700 font-medium text-lg">Hi! {user ? user.fullName : 'Developers'}</p>
        {user ? (
          <UserButton />
        ) : (
          <img src={assets.profile_img} className="w-10 h-10 rounded-full border border-gray-300" alt="Profile" />
        )}
      </div>
    </div>
  );
};

export default Navbar;