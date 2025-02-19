import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../Redux/courseSlice";
import { useEffect, useState } from "react";
import HomeLayout from "../../Layouts/HomeLayout";
import CourseCard from "../../Components/Course/courseCard";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaFire, FaClock } from 'react-icons/fa';

function CourseList() {
  const dispatch = useDispatch();
  const { coursesData } = useSelector((state) => state.course);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [sortBy, setSortBy] = useState("latest"); // Default sorting: latest
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Fetch courses
  async function loadCourses() {
    const res = await dispatch(getAllCourses());
    console.log(res);
    if (res.payload) {
      setFilteredCourses(res.payload); // Initialize filtered courses
      setLoading(false);
    }
  }

  // Apply sorting
  const applySorting = (criteria) => {
    let sortedCourses = [...coursesData];
    switch (criteria) {
      case "priceHighToLow":
        sortedCourses.sort((a, b) => b.price - a.price);
        break;
      case "priceLowToHigh":
        sortedCourses.sort((a, b) => a.price - b.price);
        break;
      case "popularity":
        sortedCourses.sort((a, b) => b.studentEnrolled.length - a.studentEnrolled.length);
        break;
      case "latest":
        sortedCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        sortedCourses = coursesData;
    }
    setFilteredCourses(sortedCourses);
    setSortBy(criteria);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 flex flex-col pb-10 flex-wrap gap-10 text-lime-900">
        <h1 className="px-4 text-2xl font-semibold text-center sm:px-10 sm:text-3xl sm:text-left">
          Explore the courses made by{" "}
          <span className="font-bold text-yellow-500">Industry Experts</span>
        </h1>

        {/* Main Content */}
        <div className="flex flex-col gap-8 px-4 sm:px-8 lg:flex-row">
          {/* Sidebar for Filters */}
          <div className={`w-full p-4 sm:p-6 bg-white rounded-lg shadow-lg ${isMobile ? 'mb-4' : 'lg:w-1/4'}`}>
            <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
              <FaFilter className="text-purple-600" />
              Filters
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => applySorting("priceHighToLow")}
                className={`w-full flex items-center gap-2 p-3 rounded-lg ${
                  sortBy === "priceHighToLow"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-all duration-300`}
              >
                <FaSortAmountDown />
                Price: High to Low
              </button>
              <button
                onClick={() => applySorting("priceLowToHigh")}
                className={`w-full flex items-center gap-2 p-3 rounded-lg ${
                  sortBy === "priceLowToHigh"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-all duration-300`}
              >
                <FaSortAmountUp />
                Price: Low to High
              </button>
              <button
                onClick={() => applySorting("popularity")}
                className={`w-full flex items-center gap-2 p-3 rounded-lg ${
                  sortBy === "popularity"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-all duration-300`}
              >
                <FaFire />
                Popularity
              </button>
              <button
                onClick={() => applySorting("latest")}
                className={`w-full flex items-center gap-2 p-3 rounded-lg ${
                  sortBy === "latest"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-all duration-300`}
              >
                <FaClock />
                Latest
              </button>
            </div>
          </div>

          {/* Course Cards */}
          <div className="flex justify-center w-full lg:w-3/4">
            {loading ? (
              <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-lg">
                      <Skeleton height={200} />
                      <Skeleton height={24} className="mt-4" />
                      <Skeleton height={16} className="mt-2" />
                      <Skeleton height={16} className="mt-2" />
                    </div>
                  ))}
                </div>
              </SkeletonTheme>
            ) : (
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses?.map((element) => (
                  <CourseCard key={element._id} data={element} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default CourseList;