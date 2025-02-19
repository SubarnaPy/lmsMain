import { FiMenu } from 'react-icons/fi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Logout  } from '../../Redux/authSlice';
import { getProfile } from '../../Redux/profileSlice';
import { searchCourse } from '../../Redux/courseSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { isLoggedIn, role } = useSelector((state) => (state.auth));

  const handleLogout = async (e) => {
    e.preventDefault();
    const res = await dispatch(Logout());
    if (res?.payload?.success) {
      navigate('/');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await dispatch(searchCourse(searchQuery));
      navigate('/courses'); // Navigate to the courses page to display the search results
    }
  };

  const handleProfileClick = async () => {
     const res = await dispatch(getProfile());
     console.log(res);
    if (res?.payload.success) {
      navigate('/dashboard/my-profile');
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleCoursesClick = () => {
    navigate('/courses');
  };

  const handleCreateCourseClick = () => {
    navigate('/course/create');
  };

  const handleAdminDashboardClick = () => {
    navigate('/admin/dashboard');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };
  const handleAboutClick = () => {
    navigate('/about');
  };

  return (
    <nav className="relative z-[60] top-0 font-semibold left-0  flex items-center justify-between text-[#070707] w-full p-4  shadow-md">
      <div className="font-sans text-xl" onClick={handleHomeClick}>
       EDUCATION SIGHT
      </div>

      {/* Search Bar for Desktop */}
      <form onSubmit={handleSearchSubmit} className="items-center w-[10%] justify-center flex-grow hidden mx-4 md:flex">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 w-[70%] text-black shadow-md rounded-l-md"
          placeholder="Search courses..."
        />
        <button
          type="submit"
          className="px-4 py-2 shadow-md bg-slate-400 rounded-r-md hover:bg-slate-300"
        >
          Search
        </button>
      </form>

      {/* Desktop Links */}
      <div className="items-center hidden md:flex">
        <button onClick={handleHomeClick} className="p-2 rounded hover:bg-[#d3ad31]">Home</button>
        <button onClick={handleCoursesClick} className="p-2 rounded hover:bg-blue-400">Courses</button>
        <button onClick={handleAboutClick} className="p-2 rounded hover:bg-blue-400">AboutUs</button>

        {isLoggedIn ? (
          <>
            
            <button onClick={handleProfileClick} className="p-2 rounded hover:bg-blue-400">Profile</button>
            <button onClick={handleLogout} className="p-2 rounded hover:bg-blue-400">Logout</button>
          </>
        ) : (
          <>
            <button onClick={handleLoginClick} className="p-2 rounded hover:bg-blue-400">Login</button>
            <button onClick={handleSignupClick} className="p-2 rounded hover:bg-blue-400">Signup</button>
          </>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <FiMenu className="text-3xl cursor-pointer text-slate-950" onClick={toggleSidebar} />
      </div>

      {/* Animated Sidebar for Small Screens */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-blue-950 text-white z-50 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-end p-4">
          <AiFillCloseCircle className="text-3xl cursor-pointer" onClick={toggleSidebar} />
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex px-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-2 py-2 text-black rounded-l-md"
            placeholder="Search courses..."
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-400 rounded-r-md hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col p-4 space-y-4">
          <button onClick={() => { handleHomeClick(); toggleSidebar(); }} className="p-2 text-white rounded hover:bg-blue-400">Home</button>
          <button onClick={() => { handleCoursesClick(); toggleSidebar(); }} className="p-2 text-white rounded hover:bg-blue-400">Courses</button>
          {isLoggedIn ? (
            <>
              {role === 'INSTRUCTOR' && (
                <>
                  <button onClick={() => { handleCreateCourseClick(); toggleSidebar(); }} className="p-2 text-white rounded hover:bg-blue-400">Create Course</button>
                  <button onClick={() => { handleAdminDashboardClick(); toggleSidebar(); }} className="p-2 text-white rounded hover:bg-blue-400">Admin Dashboard</button>
                </>
              )}
              <button onClick={() => { handleProfileClick(); toggleSidebar(); }} className="p-2 text-white rounded hover:bg-blue-400">Profile</button>
              <button onClick={() => { handleLogout(); toggleSidebar(); }} className="p-2 text-white rounded hover:bg-blue-400">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => { handleLoginClick(); toggleSidebar(); }} className="p-2 text-white rounded hover:bg-blue-400">Login</button>
              <button onClick={() => { handleSignupClick(); toggleSidebar(); }} className="p-2 text-white rounded hover:bg-blue-400">Signup</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
