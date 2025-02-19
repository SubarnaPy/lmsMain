import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse, resetPaymentState } from '../../Redux/razorpaySlice';
import { getFullDetailsOfCourse } from '../../Redux/courseSlice';
import GetAvgRating from '../../utils/AvgRating';
import ConfirmationModal from '../../Components/Modal/ConfirmationModal';
import { formatDate } from '../../utils/formatDate';
import ReactStars from 'react-rating-stars-component';
import { IoIosInformationCircleOutline, IoIosStar } from 'react-icons/io';
import { BiVideo, BiTime } from 'react-icons/bi';
import { MdOutlineArrowForwardIos, MdVerified } from 'react-icons/md';
import CourseDetailsCard from '../../Components/Course/courseCart';
import { toast } from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../utils/AccountType';
import { addToCart } from '../../Redux/cartSlice';
import { FaUsers, FaPlayCircle, FaCartPlus, FaCertificate } from 'react-icons/fa';
import CourseReviewCard from '../../Components/Course/CourseReviewCard';
import ChatComponent from '../../Components/ChatSection/ChatComponent';
import { TextField, IconButton } from '@mui/material';
import { RiMoneyDollarCircleLine, RiShareLine, RiBookmarkLine } from 'react-icons/ri';
import { GiTeacher } from 'react-icons/gi';
import { BsGlobe, BsCalendar } from 'react-icons/bs';
import HomeLayout from "../../Layouts/HomeLayout";


const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.auth);
   console.log(role)
  const user = useSelector((state) => state.profile.data);
  const { cart } = useSelector((state) => state.cart);
  const { url, error } = useSelector((state) => state.razorpay) || {};
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [courseData, setCourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [meetingCode, setMeetingCode] = useState('');
  const [isActive, setIsActive] = useState([]);

  useEffect(() => {
    if (url) {
      window.location.href = url;
    }
  }, [url]);

  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await dispatch(getFullDetailsOfCourse(courseId));
        if (result.payload) {
          setCourseData(result.payload);
        }
      } catch (error) {
        toast.error('Could not fetch course details');
        console.error('Error fetching course details:', error);
      }
    };
    getCourseFullDetails();
  }, [courseId]);

  useEffect(() => {
    if (courseData) {
      const enrolled = courseData.studentEnrolled?.find((student) => student === user?._id);
      if (enrolled) setAlreadyEnrolled(true);
    }
  }, [courseData, user?._id]);

  useEffect(() => {
    let lectures = 0;
    courseData?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [courseData]);

  const handleActive = (id) => {
    setIsActive(!isActive.includes(id) ? isActive.concat(id) : isActive.filter((e) => e !== id))
  };

  const handleAddToCart = () => {
    if (token) {
      dispatch(addToCart(courseData));
      toast.success('Course added to cart!');
    } else {
      navigate('/login');
    }
  };

  const handleBuyCourse = async () => {
    if (token) {
      await dispatch(buyCourse({ courses: [courseId], user, navigate }));
      return;
    }
    setConfirmationModal({
      text1: 'You are not logged in',
      text2: 'Please log in to purchase the course.',
      btn1Text: 'Log In',
      btn2Text: 'Cancel',
      btn1Handler: () => navigate('/login'),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleJoinVideoCall = () => {
    navigate(`/${meetingCode}`);
  };

  useEffect(() => {
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="custom-loader"></div>
      </div>
    );
  }

  const {
    _id: course_id,
    title,
    description,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentEnrolled,
    createdAt,
  } = courseData;

  return (
    
    <HomeLayout>
      {/* Hero Section */}
      <div className="relative w-full py-12 bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="container px-4 mx-auto">
        <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Course Thumbnail (Mobile Only) */}
          <div className="relative block max-h-[20rem] lg:hidden">
            <div className="absolute inset-0 rounded-lg"></div>
            <img 
              src={thumbnail?.secure_url} 
              className="object-cover w-full rounded-lg shadow-2xl aspect-video" 
              alt={title} 
            />
          </div>

          {/* Course Details */}
          <div className="z-30 flex flex-col items-center justify-center gap-4 p-3 text-lg text-white lg:items-start">
            
            <h1 className="text-4xl font-bold sm:text-[42px] text-center lg:text-left">{title}</h1>
            
            <p className="text-center text-gray-200 lg:text-left">
              {description.split(" ").length > 15
                ? description.split(" ").slice(0, 15).join(" ") + "..."
                : description}
            </p>

            {/* Ratings & Student Enrollment */}
            <div className="flex flex-wrap items-center gap-3 text-md">
              <ReactStars count={5} value={GetAvgRating(ratingAndReviews)} size={24} activeColor="#ffd700" />
              <span className="font-semibold text-yellow-300">
                {GetAvgRating(ratingAndReviews)}
              </span>
              <span className="text-gray-300">({ratingAndReviews.length} reviews)</span>
              <div className="flex items-center gap-2">
                <FaUsers className="text-lg text-white" />
                <span>{studentEnrolled.length} students</span>
              </div>
            </div>

            {/* Instructor & Creation Date */}
            <div className="right-0 flex flex-wrap gap-5 text-lg">
              <p className="flex items-center gap-2">
                <GiTeacher className="text-xl" />
                <span>Created by {instructor.fullName}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-5 text-lg">
              <p className="flex items-center gap-2">
                <BsCalendar className="text-xl" />
                <span>Created on {formatDate(createdAt)}</span>
              </p>
            </div>

           
          </div>

        </div>
      </div>
    </div>

  

      {/* Course Buy Card (Desktop) */}
      <div className="right-[0px] fixed top-[58px] mx-auto hidden min-h-[600px] w-1/3 max-w-[300px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
        <CourseDetailsCard
          course={courseData}
          setConfirmationModal={setConfirmationModal}
          handleBuyCourse={handleBuyCourse}
        />
      </div>

      {/* What You Will Learn Section */}
      <div className="container lg:w-[800px] px-4 py-6 ">
  <div className="p-8 bg-white rounded-lg ">
    <h2 className="flex items-center gap-2 mb-6 text-3xl font-bold">
      <RiBookmarkLine className="text-purple-600" />
      What You Will Learn
    </h2>
    {/* Use dangerouslySetInnerHTML to render HTML content */}
    <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: whatYouWillLearn }} />
  </div>
</div>


      {/* Course Content Section */}
      <div className="container px-4 py-12 mx-auto">
      <div className="p-8 bg-white shadow-xl rounded-xl">
        {/* Heading */}
        <h2 className="flex items-center gap-3 mb-6 text-3xl font-bold text-gray-800">
          <BiVideo className="text-4xl text-purple-600" />
          Course Content
        </h2>

        {/* Course Sections */}
        <div className="space-y-6">
          {courseContent.map((section) => (
            <div
              key={section._id}
              className="overflow-hidden transition-all border border-gray-200 rounded-lg shadow-md bg-gray-50 hover:shadow-lg"
            >
              {/* Section Header */}
              <div
                onClick={() => handleActive(section._id)}
                className="flex items-center justify-between p-5 transition-all duration-300 bg-gray-100 cursor-pointer hover:bg-gray-200"
              >
                <div className="flex items-center gap-4">
                  <MdOutlineArrowForwardIos
                    className={`transform transition-transform text-gray-600 ${
                      isActive.includes(section._id) ? "rotate-90" : "rotate-0"
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <span className="text-sm text-gray-600">
                  {section.subSection.length} Lectures
                </span>
              </div>

              {/* Subsections */}
              {isActive.includes(section._id) && (
                <div className="p-1 text-xl bg-white border-t border-gray-200">
                  {section.subSection.map((subSection) => (
                    <div
                      key={subSection._id}
                      className="flex items-center gap-3 px-4 py-2 transition rounded-md hover:bg-gray-100"
                    >
                      <BiVideo className="text-lg text-purple-500" />
                      <p className="text-sm text-gray-800">{subSection.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  

      {/* Instructor Section */}
      <div className="container px-4 py-12 mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h2 className="flex items-center gap-2 mb-6 text-3xl font-bold">
            <GiTeacher className="text-purple-600" />
            About the Instructor
          </h2>
          <div className="flex items-center gap-6">
            <img
              src={instructor.avatar?.secure_url}
              alt={instructor.fullName}
              className="object-cover w-24 h-24 rounded-full shadow-md"
            />
            <div>
              <h3 className="text-2xl font-semibold">{instructor.fullName}</h3>
              <p className="text-gray-700">{instructor.additionalDetails?.about}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container px-4 py-12 mx-auto">
        <h2 className="flex items-center gap-2 mb-6 text-3xl font-bold">
          <IoIosStar className="text-purple-600" />
          Student Reviews
        </h2>
        <CourseReviewCard reviews={ratingAndReviews} />
      </div>

      {/* Live Class Section */}
      {(alreadyEnrolled || (role=='INSTRUCTOR') ) && (
        <div className="container px-4 py-12 mx-auto">
          <button
            onClick={() => navigate(`/course/${courseId}/live`)}
            className="px-8 py-3 font-bold text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 hover:scale-105"
          >
            <FaPlayCircle className="inline-block mr-2" />
            Join Live Class
          </button>
        </div>
      )}

      {/* Chat Component */}
      <ChatComponent courseId={courseId} userId={user._id} />

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </HomeLayout>
  );
};

export default CourseDetails;