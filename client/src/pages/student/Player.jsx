import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const getCourseData = () => {
      enrolledCourses.forEach((course) => {
        if (course._id === courseId) {
          setCourseData(course);
        }
      });
    };
    getCourseData();
  }, [enrolledCourses, courseId]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Column */}
        <div className="w-full md:w-1/3 bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Course Structure</h2>
          <div className="space-y-3">
            {courseData && courseData.courseContent.map((chapter, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleSection(index)}
                  className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-all rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={assets.down_arrow_icon}
                      alt='arrow_icon'
                      className={`h-4 w-4 transition-transform duration-300 ${openSections[index] ? 'rotate-180' : ''}`}
                    />
                    <p className="font-medium">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>
                <div className={`transition-all duration-500 overflow-hidden ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className="divide-y divide-gray-100 bg-white p-3 rounded-lg">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="p-3 flex items-center justify-between hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <img
                            src={false ? assets.blue_tick_icon : assets.play_icon}
                            alt="play icon"
                            className='h-4 w-4 text-blue-500'
                          />
                          <p className="text-sm">{lecture.lectureTitle}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          {lecture.lectureUrl && (
                            <p
                              onClick={() =>
                                setPlayerData({
                                  ...lecture,
                                  chapter: index + 1,
                                  lecture: i + 1,
                                })
                              }
                              className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full cursor-pointer hover:bg-green-200 transition-colors"
                            >
                              Watch
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h1 className="text-lg font-semibold mb-2">Rate This Course</h1>
            <Rating initialRating={0} />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-2/3 bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
          {playerData ? (
            <div className="w-full h-80 mb-4">
              <YouTube
                videoId={playerData.lectureUrl.split('/').pop()}
                className="w-full h-full rounded-lg"
              />
            </div>
          ) : (
            <div className="w-full h-80 mb-4">
              <img
                src={courseData ? courseData.courseThumbnail : ''}
                alt='Course Thumbnail'
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          )}
          {playerData ? (
            <div className="w-full p-4 bg-white rounded-lg shadow-lg mt-16">
              <p className="text-lg font-semibold text-center">{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full">
                {false ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          ) : (
            <div className="w-full p-4 bg-white rounded-lg shadow-lg mt-16">
              <p className="text-lg font-semibold text-center">Course Preview</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
