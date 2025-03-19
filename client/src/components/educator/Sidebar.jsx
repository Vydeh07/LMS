import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  
  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];
  
  return isEducator && (
    <div className=" bg-white-50 h-screen">
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === '/educator'}
          className={({ isActive }) => 
            `flex items-center h-14 px-6 ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            }`
          }
        >
          <div className="flex items-center">
            <img src={item.icon} alt="" className="w-5 h-5" />
            <span className="ml-5 text-md font-medium ">{item.name}</span>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;