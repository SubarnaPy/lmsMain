import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../../Redux/viewCourseSlice';
import { getFullDetailsOfCourse } from '../../Redux/courseSlice';
import VideoDetailsSidebar from '../../Components/Course/ViewCourse/VideoDetailsSidebar';
import { Button } from '@material-tailwind/react';

const ViewCourse = () => {
  const [showSidebar, setShowSidebar] = useState(false); // Manage sidebar visibility
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    dispatch(setCourseSectionData([]));
    dispatch(setEntireCourseData([]));
    dispatch(setCompletedLectures(0));
  }, []);

  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      const courseData = await dispatch(getFullDetailsOfCourse(courseId));
      dispatch(setCourseSectionData(courseData?.payload?.courseContent));
      dispatch(setEntireCourseData(courseData?.payload));
      dispatch(setCompletedLectures(courseData?.payload?.courseProgress || []));

      let lectures = 0;
      courseData.payload.courseContent.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    };

    setCourseSpecificDetails();
  }, [courseId]);

  return (
    <>
      <div className="relative flex h-full">
        {/* Sidebar */}
        <div
          className={`fixed z-50 top-0 left-0 h-full bg-white transform transition-transform md:translate-x-0 ${
            showSidebar ? 'translate-x-0' : 'hidden'
          } md:w-1/4 w-72 md:block`}
        >
          <VideoDetailsSidebar />
        </div>

        {/* Content */}
        <div className="flex-1 h-full overflow-auto">
          {/* Toggle Sidebar Button for Small Screens */}
          <div className="left-0 block p-4 m-auto pl-80 md:hidden">
            <Button
              onClick={() => setShowSidebar((prev) => !prev)}
              className="text-white bg-blue-500 rounded-md "
            >
              {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
            </Button>
          </div>

          <div className="py-1 mx-6 shadow-lg md:ml-[21rem]">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCourse;
