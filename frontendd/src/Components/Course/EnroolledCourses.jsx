import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, getUserEnrolledCourses } from '../../Redux/profileSlice';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import CourseDuration from '../../utils/secToDurationFrontend';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const dispatch = useDispatch();

  const getEnrolledCourses = async () => {
    try {
      const response = await dispatch(getUserEnrolledCourses());
      if (response.payload !== null || undefined) {
        setEnrolledCourses(response?.payload?.courses);
        setProgressData(response?.payload?.courseProgress);
        await dispatch(getProfile());
      }
    } catch (error) {
      console.log('Unable to Fetch Enrolled Courses');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  const totalNoOfLectures = (course) => {
    let total = 0;
    course.courseContent.forEach((section) => {
      total += section.subSection.length;
    });
    return total;
  };

  const TRUNCATE_LENGTH = 20;

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden transition-all duration-300 transform bg-white cursor-pointer rounded-xl hover:scale-105 hover:shadow-2xl"
        >
          {/* Image Placeholder with Padding */}
          <div className="p-2">
            <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Content Placeholder */}
          <div className="p-6">
            <div className="w-3/4 h-6 mb-4 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-full h-4 mb-2 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-2/3 h-4 mb-4 bg-gray-200 rounded-full animate-pulse"></div>

            {/* Progress Bar Placeholder */}
            <div className="flex items-center justify-between mt-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 ml-4">
                <div className="w-1/2 h-4 mb-2 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-full h-2 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Metadata Placeholder */}
            <div className="flex items-center justify-between mt-4">
              <div className="w-1/3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-1/4 h-3 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">My Enrolled Courses</h1>
      {isLoading ? (
        <LoadingSkeleton />
      ) : !enrolledCourses?.length ? (
        <p className="text-center text-gray-700">You have not enrolled in any course yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course, i) => {
            const progress = progressData?.find((p) => p.courseID === course._id);
            const completedVideos = progress?.completedVideos?.length || 0;
            const totalVideos = totalNoOfLectures(course);
            const progressPercentage = (completedVideos / totalVideos) * 100;

            return (
              <div
                key={course._id}
                className="relative overflow-hidden transition-all duration-300 transform bg-white cursor-pointer rounded-xl hover:scale-105 hover:shadow-2xl"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]._id}`
                  );
                }}
              >
                {/* Course Thumbnail with Padding */}
                <div className="p-2">
                  <img
                    src={course?.thumbnail?.secure_url}
                    alt={course?.title}
                    className="object-cover w-full h-48 rounded-lg"
                  />
                </div>

                {/* Course Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {course.description.split(' ').length > TRUNCATE_LENGTH
                      ? course.description
                          .split(' ')
                          .slice(0, TRUNCATE_LENGTH)
                          .join(' ') + '...'
                      : course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="w-16 h-16">
                      <CircularProgressbar
                        value={progressPercentage}
                        text={`${Math.round(progressPercentage)}%`}
                        styles={buildStyles({
                          pathColor: '#7C3AED',
                          textColor: '#7C3AED',
                          trailColor: '#EDE9FE',
                          textSize: '24px',
                        })}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        {completedVideos} / {totalVideos} lectures completed
                      </p>
                      <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-purple-400 rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Course Metadata */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-500">Created: {formatDate(course.createdAt)}</p>
                    <div className="text-sm text-gray-700">
                      <CourseDuration course={course} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;