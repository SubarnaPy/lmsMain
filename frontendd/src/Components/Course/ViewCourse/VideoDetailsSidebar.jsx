import React from 'react'
import { useState } from 'react'; 
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
// import IconBtn from '../../common/IconBtn'
import {FaChevronLeft} from 'react-icons/fa'
import {MdOutlineKeyboardArrowDown} from 'react-icons/md'
import {FaAngleDoubleRight} from 'react-icons/fa'
import { Button } from '@material-tailwind/react';
import CourseReviewModal from './CourseReviewModal';

const VideoDetailsSidebar = () => {
      const [reviewModal, setReviewModal] = useState(false)
  
  const [activeStatus, setActiveStatus] = useState("");
  const [videoActive, setVideoActive] = useState("");
  const {courseId,sectionId,subSectionId} = useParams();
  console.log("sectionId", sectionId, "SubSectionId", subSectionId);
  const {courseSectionData, courseEntireData, totalNoOfLectures} = useSelector(state => state.viewCourse);
  const user= useSelector(state => state.profile.data)
 console.log(courseSectionData)
  console.log("user", user)
  const completedLectures = user.courseProgress.find(item => item.courseID === courseId)?.completedVideos ;
console.log(completedLectures);
  // const completedLectures =user.courseProgress;
  
  // console.log(completedLectures)
  // console.log(courseSectionData);
  const navigate = useNavigate();
  const[showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    ;(() => {
      if(!courseSectionData) return;
      const currentSectionIndex = courseSectionData.findIndex((section) => section._id === sectionId);
      // console.log(currentSectionIndex)
      // console.log("currentSectionIndex", currentSectionIndex);
      // console.log(courseSectionData
      const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subSection) => subSection?._id === subSectionId);
      // const currentSubSectionIndex =    courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)
      console.log(courseSectionData[currentSectionIndex]?.subSection.findIndex((subSection) => subSection?._id === subSectionId))
      console.log("currentSubSectionIndex", currentSubSectionIndex);
      if(currentSectionIndex === -1 || currentSubSectionIndex === -1) return;
      const activesubsectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex]._id;
      
      setActiveStatus(courseSectionData[currentSectionIndex]._id);
      setVideoActive(activesubsectionId);
      // console.log("activeSubsectionId", activesubsectionId);
      // console.log("activeSectionId", courseSectionData[currentSectionIndex]._id);
    })();
  }, [courseSectionData, sectionId, subSectionId]);


// console.log(reviewModal)
const handlereview =()=>{
  setReviewModal(true)
}
 console.log(reviewModal)
    

  return (
    < >
    
     {/* <Button className={`${showSidebar?"":"hidden"} w-6 h-72  z-[100] relative `}>
      <FaAngleDoubleRight onClick={()=>{setShowSidebar(!showSidebar);}} className={`   z-[100] cursor-pointer text-2xl text-black m-2 bg-red-800 rounded-full p-1 bottom-4 absolute left-1 `} />
      </Button> */}
    <div className={ `${showSidebar?"h-0 w-0":"h-full w-[320px]"} -top-0 -right-0 transition-all duration-700 z-20 relative offSidebar1`}>
      <div className={`${showSidebar?"hidden":""} transition-all origin-right duration-500 flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-black bg-slate-100 offSidebar2`}>
        <div className={`${showSidebar?"hidden":""} mx-5   flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25 offSidebar2`}>
          <div className='flex items-center justify-between w-full '>
            <div className='flex h-[35px] w-[35px] items-center justify-center rounded-full bg-slate-400 p-1 text-black hover:scale-90'>
              <FaChevronLeft className='cursor-pointer md:hidden' onClick={()=>{navigate(`/dashboard/enrolled-courses`);}}/>
              <FaChevronLeft className='hidden text-gray-700 cursor-pointer md:block' onClick={()=>{
                navigate(`/dashboard/enrolled-courses`);
              }}/>
            </div>
            <Button className='text-black'  onClick={handlereview}>Reviews</Button>
            {/* <Button onclick={()=>{setReviewModal(true)}}>hi</Button> */}
          </div>
          <div className='flex flex-col'>
            <p>My Courses</p>
            <p className='text-sm font-semibold text-richblack-500'>
              {completedLectures?.length} of {totalNoOfLectures} Lectures Completed
            </p>
          </div>
        </div>
        <div className='h-full px-2 overflow-y-auto'>
          {
            courseSectionData?.map((section, index) => (
               <details key={index} className='appearance-none '>
              <>
                <summary className='mt-2 text-sm appearance-none cursor-pointer text-richblack-5'>
                  <div className='flex flex-row justify-between px-5 py-4 bg-slate-300'>
                    <p className='text-xl font-semibold '>{section?.title}</p>
                    <div className='flex items-center gap-3 text-xl'>
                      <MdOutlineKeyboardArrowDown className='arrow'/>
                    </div>
                  </div>
                </summary>
                {
                  section?.subSection.map((subSection, index) => (
                    <div  key={subSection?._id} className='transition-[height] bg-slate-100 duration-500 ease-in-out'>
                      <div onClick={()=>{
                        setShowSidebar(false);
                        navigate(`/view-course/${courseId}/section/${section?._id}/sub-section/${subSection?._id}`);
                      }} className={`${subSection?._id === videoActive? ("bg-yellow-400"):("bg-slate-400") } cursor-pointer items-baseline  flex gap-3  px-5 py-2 font-semibold text-black relative border-b-[1px] border-black `}>
                      {/* <input type='checkbox' className=''/> */}
                      <div className="absolute checkbox-wrapper-19 ">
                        <input readOnly={true} checked={
                          completedLectures?.includes(subSection?._id)
                        }  type="checkbox" />
                        <label className="check-box">
                        </label>
                        </div>
                      <p className='ml-6 '>{subSection?.title}</p>
                      </div>
                    </div>
                  ))
                }
                </>
               </details>
            ))
          }
        </div>
      </div>   
      

    </div>
 
    {reviewModal && (<CourseReviewModal setReviewModal={setReviewModal} />)}

    </>
  )
}

export default VideoDetailsSidebar