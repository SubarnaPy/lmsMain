
import Instructor from "../../Assetss/Images/Instructor.png"
import HighlightText from './HighlightText'
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const InstructorSection = () => {
  return (
    <div className="relative mt-16">
      {/* Background Gradients */}
      <div className="absolute grad -top-20 -left-40 w-96 h-96 rounded-full bg-gradient-radial from-[#a32b93] via-[#b6b5c5] to-transparent opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-48 -right-40 w-96 h-96 rounded-full bg-gradient-radial from-[#a32b93] via-[#b6b5c5] to-transparent opacity-30 blur-3xl"></div>

      <div className="flex flex-col items-center gap-10 px-5 bottom-10 md:flex-row md:gap-16 lg:px-10">
        {/* Image Section */}
        <div className="w-full bottom-28 md:w-[40%] flex justify-center z-50">
        <div className="absolute left-36 -bottom-10  w-[400px] z-10 h-[400px] rounded-full bg-gradient-radial from-[#a32b93] via-[#b6b5c5] to-transparent opacity-50 blur-3xl" ></div>

          <img
            src={Instructor}
            alt="Instructor"
            className="shadow-lg z-30 m-10 shadow-[#fffdfd] rounded-md w-[90%] md:w-full max-w-[400px]"
          />
        </div>

        {/* Text Content */}
        <div className="w-full md:w-[50%] z-50 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
          {/* Title */}
          <div className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
            Become an
            <HighlightText text={" Instructor"} />
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg font-medium text-richblack-300 w-full sm:w-[80%] lg:w-[70%]">
            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          {/* Button */}
          <div className="w-fit">
            <Link to="/login">
              <button className="px-6 sm:px-8 flex flex-row gap-2 items-center py-2 bg-[#0070f3] rounded-md text-white font-light transition-transform transform hover:scale-105 hover:bg-[#005bb5] shadow-lg">
                Learn more
                <FaArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorSection
