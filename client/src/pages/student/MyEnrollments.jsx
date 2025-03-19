import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import {Line} from 'rc-progress'
import Footer from '../../components/student/Footer'

const MyEnrollments = () => {
  const {enrolledCourses, calculateCourseDuration,navigate} = useContext(AppContext)
  const[progressArray, setprogressArray] = useState([
    {lectureCompleted : 7, totalLectures:7},
    {lectureCompleted : 2, totalLectures:5},
    {lectureCompleted : 4, totalLectures:8},
    {lectureCompleted : 1, totalLectures:6},
    {lectureCompleted : 5, totalLectures:9},
    {lectureCompleted : 2, totalLectures:4},
    {lectureCompleted : 3, totalLectures:7},
    {lectureCompleted : 1, totalLectures:5},
    {lectureCompleted : 6, totalLectures:10},
    {lectureCompleted : 4, totalLectures:6},
    {lectureCompleted : 2, totalLectures:3},
    {lectureCompleted : 5, totalLectures:7},
    {lectureCompleted : 3, totalLectures:8},
    
  ])
  return (
    <>
    <div className='md:px-36 px-8 pt-10'>
       <h1 className='text-3xl font-bold mb-4'>My Enrollments</h1>
       <table className='w-full table-auto'>
       <thead className='bg-gray-200'>
        <tr>
          <th className='px-4 py-3 font-semibold truncate text-left'>Course</th>
          <th className='px-4 py-3 font-semibold truncate text-left'>Duration</th>
          <th className='px-4 py-3 font-semibold truncate text-left'>Completed</th>
          <th className='px-4 py-3 font-semibold truncate text-left'>Status</th>
        </tr>
       </thead>
       <tbody>
        {enrolledCourses.map((course,index)=>(
           <tr key={index} className='border-b border-gray-200'>
            <td className='flex items-center py-4'>
              <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28 mr-4'/>
              <div>
                <p className='text-lg font-medium'>
                  {course.courseTitle}
                </p>
                <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100)/progressArray[index].totalLectures:0 } className='bg-gray-300 rounded-full w-40 h-2 mt-2' />
              </div> 
            </td>
            <td className='py-4'>
              {calculateCourseDuration(course)}
            </td>
            <td className='py-4'>
               {progressArray[index] && `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`} <span className='text-gray-600'>Lectures</span>
            </td>
            <td className='py-4'>
              <button onClick={()=> navigate('/player/' + course._id)} className={`px-4 py-2 rounded-full ${progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
              {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 ? 'Completed': 'On Going' }
              </button>
            </td>
           </tr>
        ))}
       </tbody>

       </table>
    </div>
    <Footer/>
    </>
  )
}

export default MyEnrollments
