import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import Youtube from 'react-youtube'

const CourseDetails = () => {
  const { id } = useParams();
  
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const { allCourses, calculateRating, calculateNoofLectures, calculateCourseDuration, calculateChapterTime, currency } = useContext(AppContext);

  useEffect(() => {
    const fetchCourseData = async() => {
      const findCourse = allCourses.find(course => course._id === id);
      setCourseData(findCourse);
    };
    
    if (allCourses.length > 0) {
      fetchCourseData();
    }
  }, [id, allCourses]);
  
  const toggleSection = (index) => {
    setOpenSections((prev) => (
      {...prev,
        [index] : !prev[index],
      }
    ))
  }

  return (
    courseData ? (
      <div className="relative min-h-screen bg-gray-50 flex flex-col">
        <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left flex-grow'>
          <div className='absolute top-0 left-0 w-full h-[500px] -z-10 bg-gradient-to-b from-cyan-100/70'></div>
          {/* Left Column */}
          <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md p-6 z-10 mb-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{courseData.courseTitle}</h1>
            <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>
            {/* review and Rating */}
            <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
              <p className="font-medium">{calculateRating(courseData)}</p>
              <div className='flex'>
                {[...Array(5)].map((_,i)=>(
                  <img 
                    key={i} 
                    src={i<Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} 
                    alt='' 
                    className='w-3.5 h-3.5'
                  />
                ))}
              </div>
              <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length >1  ? 'ratings' : 'rating'})</p>
              <p className="text-gray-500"> {courseData.enrolledStudents.length} {courseData.enrolledStudents.length >1 ? 'students':'student'}</p>
            </div>
            <p className='text-sm text-gray-500 mb-6'> Course by <span className='text-blue-600 underline font-medium cursor-pointer hover:text-blue-700'>GreatStack</span></p>
            <div className='pt-8 text-gray-800'>
              <h2 className='text-xl font-semibold mb-4 border-b pb-2'>Course Structure</h2>
              <div className='pt-5 space-y-3'>
                {courseData.courseContent.map((chapter,index)=>(
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div onClick={()=>toggleSection(index)} className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all">
                      <div className="flex items-center space-x-3">
                        <img src={assets.down_arrow_icon} alt='arrow_icon' className={`h-4 w-4 transition-transform duration-300 ${openSection[index] ? 'rotate-180' : ''}`}/>
                        <p className="font-medium">{chapter.chapterTitle}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                      </p>
                    </div>
                    <div className={`transition-all duration-500 overflow-hidden ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                      <ul className="divide-y divide-gray-100">
                        {chapter.chapterContent.map((lecture,i)=>(
                          <li key={i} className="p-3 flex items-center hover:bg-gray-50">
                            <img src={assets.play_icon} alt="play icon" className='h-4 w-4 mr-3 text-blue-500'/>
                            <div className="flex justify-between items-center w-full">
                              <p className="text-sm">{lecture.lectureTitle}</p>
                              <div className="flex items-center space-x-3">
                                {lecture.isPreviewFree && <p 
                                onClick={()=>setPlayerData({
                                  videoId: lecture.lectureUrl.split('/').pop()
                                })}
                                className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full cursor-pointer hover:bg-green-200 transition-colors">Preview</p>}
                                <p className="text-xs text-gray-500">
                                  {humanizeDuration(lecture.lectureDuration * 60 * 1000, {units:['h','m']})}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Course Description</h3>
              <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: courseData.courseDescription}}></p>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden max-w-sm w-full md:w-1/3 sticky top-4 mb-16">
            <div className="w-full h-52 relative">
              {playerData ? (
                <Youtube 
                  videoId={playerData.videoId} 
                  opts={{
                    playerVars: {
                      autoplay: 1
                    },
                    width: '100%',
                    height: '100%'
                  }} 
                  className="w-full h-full absolute inset-0"
                />
              ) : (
                <img 
                  src={courseData.courseThumbnail} 
                  alt={courseData.courseTitle} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className='pt-5 px-4 pb-4'>
              <div className="flex items-center mb-3">
                <img className='w-3.5 mr-2' src={assets.time_left_clock_icon} alt='time left clock icon'/>
                <p className='text-red-500 text-sm'><span className='font-medium'>5 days</span> left</p>
              </div>
              <div className="space-y-1 mb-3">
                <p className="text-lg font-bold text-blue-600">{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice/100).toFixed(2)}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-500 text-sm line-through">{currency}{courseData.coursePrice}</p>
                  <p className="text-green-600 text-sm font-medium">{courseData.discount}% off</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <img src={assets.star} alt='star-icon' className="w-4 h-4 mr-1"/>
                  <p className="text-sm font-medium text-gray-700">{calculateRating(courseData)}</p>
                </div>
                <div className='h-4 w-px bg-gray-500/40 mx-3'></div>
                <div className="flex items-center">
                  <img src={assets.time_clock_icon} alt='clock-icon' className="w-4 h-4 mr-1"/>
                  <p className="text-sm font-medium text-gray-700">{calculateCourseDuration(courseData)}</p>
                </div>
                <div className='h-4 w-px bg-gray-500/40 mx-3'></div>
                <div className="flex items-center">
                  <img src={assets.lesson_icon} alt='star-icon' className="w-4 h-4 mr-1"/>
                  <p className="text-sm font-medium text-gray-700">{calculateNoofLectures(courseData)} lessons</p>
                </div>
              </div>
              <button className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">{isAlreadyEnrolled ? 'Already Enrolled': 'Enroll Now'}</button>

              <div className="mt-6 space-y-3">
                <p className="font-medium text-gray-800">What's in the course?</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Lifetime access with free updates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Step-by-step, hands-on project guidance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Downloadable resources and source code</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Quizzes to test your knowledge</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <Footer/>
        </div>
      </div>
    ) : <Loading />
  );
};

export default CourseDetails;