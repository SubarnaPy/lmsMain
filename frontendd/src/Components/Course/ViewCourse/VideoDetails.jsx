import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
// import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { BigPlayButton, Player } from "video-react"

import 'video-react/dist/video-react.css';

import {AiFillPlayCircle} from "react-icons/ai"
// import IconBtn from '../../common/IconBtn';
import { markLectureAsComplete } from '../../../Redux/courseSlice';
import { updateCompletedLectures } from '../../../Redux/viewCourseSlice';
import {getProfile} from '../../../Redux/profileSlice';
import { Button } from '@material-tailwind/react';
import VideoDetailsSidebar from './VideoDetailsSidebar';

const VideoDetails = () => {
    const {courseId, sectionId, subSectionId} = useParams();
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();
  const {token} = useSelector((state)=>state.auth);
  const {courseSectionData, courseEntireData} = useSelector((state)=>state.viewCourse);
    const user= useSelector(state => state.profile.data)
  
  const [previewSource, setPreviewSource] = useState("")
  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false); // State to toggle sidebar

  const [loading, setLoading] = useState(false);
    console.log(user.courseProgress)
    const completedLectures = user.courseProgress.find(item => item.courseID === courseId)?.completedVideos ;
     console.log(completedLectures)
  useEffect(() => {
    const setVideoSpecificDetails = () => {
        // console.log("In VideoDetails, courseSectionData",courseSectionData)
        if(!courseSectionData.length)
            return;
        if(!courseId && !sectionId && !subSectionId) {
            navigate("/dashboard/enrolled-courses");
        }
        else {
            //let's assume k all 3 fields are present
             console.log(courseSectionData,sectionId)
            const filteredData = courseSectionData.filter(
                (course) => course._id === sectionId
            )
             console.log(filteredData)

            const filteredVideoData = filteredData?.[0]?.subSection.filter(
                (data) => data._id === subSectionId
            )
            console.log(subSectionId,sectionId)
            console.log(filteredVideoData[0],filteredVideoData)
                
            setVideoData(filteredVideoData[0]);
            setPreviewSource(courseEntireData.thumbnail.secure_url)
            setVideoEnded(false);

        }
    }
    setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname])
  
  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
    )
    if(currentSectionIndex === 0 && currentSubSectionIndex === 0) {
        return true;
    }
    else {
        return false;
    }
  } 
 console.log(videoData)
  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )
    console.log(currentSectionIndex,courseSectionData)

    const noOfSubSections = courseSectionData[currentSectionIndex]?.subSection.length;
   console.log(noOfSubSections)
    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
        (data) => data._id === subSectionId
    )
    console.log("for section ",currentSectionIndex,courseSectionData.length - 1,currentSectionIndex === courseSectionData.length - 1)
    console.log("and sub section ",currentSubSectionIndex,noOfSubSections - 1,currentSubSectionIndex === noOfSubSections - 1)
    
    if((courseSectionData[currentSectionIndex + 1]?.subSection.length === 0 && currentSubSectionIndex === noOfSubSections - 1) ||
        (currentSectionIndex === courseSectionData.length - 1 &&currentSubSectionIndex === noOfSubSections - 1)) {
            console.log("for section ",currentSectionIndex,courseSectionData.length - 1,currentSectionIndex === courseSectionData.length - 1)
            console.log("and sub section ",currentSubSectionIndex,noOfSubSections - 1,currentSubSectionIndex === noOfSubSections - 1)
            console.log("hi")
            return true;
        }
    else {
        console.log("hello")
        return false;

    }


  }

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
    )

    if(currentSubSectionIndex !== noOfSubSections - 1) {
        //same section ki next video me jao
        const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id;
        //next video pr jao
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    }
    else {
        //different section ki first video
        const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
        const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
        ///iss voide par jao 
        navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }
  }

  const goToPrevVideo = () => {

    const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
    )

    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
    )

    if(currentSubSectionIndex != 0 ) {
        //same section , prev video
        const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;
        //iss video par chalge jao
        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    }
    else {
        //different section , last video
        const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
        const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
        const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id;
        //iss video par chalge jao
        navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)

    }


  }

  const handleLectureCompletion = async(subSectionId,completedLectures) => {
    console.log(completedLectures,subSectionId)

    ///dummy code, baad me we will replace it witht the actual call
    setLoading(true);
    //PENDING - > Course Progress PENDING
    const res = await dispatch(markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}));
    console.log(res);
    await dispatch(getProfile());
    //state update
    if(res.payload.success) {
        dispatch(updateCompletedLectures(res.payload.completedVideos)); 
    }
    setLoading(false);

  }
  return (
    <div className="flex flex-col gap-5 text-black">
      {
        !videoData ? (<img
          src={previewSource}
          alt="Preview"
          className="object-cover w-full rounded-md"
        />)
        : ( 
            // <div className=''>
            <Player
               fluid={true} 
                ref = {playerRef}
                aspectRatio="16:9"
                playsInline
                // style={{ height: '20px' }}
                onEnded={() => setVideoEnded(true)}
                src={videoData?.lecture?.secure_url}
                 >

                {/* <BigPlayButton position="center" />      */}

                {
                    videoEnded && (
                        <div style={{
                            backgroundImage:
                            "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                            }}
                        className="full absolute inset-0 z-[100] grid h-full gap-4 place-content-center "
                        >
                            {
                                !completedLectures.includes(subSectionId) && (
                                    <Button
                                        disabled={loading}
                                        onClick={() => handleLectureCompletion(subSectionId,completedLectures)}
                                        text={ "Mark As Completed" }
                                        className="px-4 mx-auto text-xl text-yellow-400 bg-slate-400 max-w-max"
                                    >Mark As Completed</Button>
                                )
                            }

                            <Button
                                disabled={loading}
                                onClick={() => {
                                    if(playerRef?.current) {
                                        playerRef.current?.seek(0);
                                        setVideoEnded(false);
                                    }
                                }}
                                text="Rewatch"
                                className='text-yellow-400 bg-slate-400'
                            >Rewatch</Button>

                            <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                {!isFirstVideo() && (
                                    <Button
                                    disabled={loading}
                                    onClick={goToPrevVideo}
                                    className='text-yellow-400 bg-slate-400'
                                    >
                                        Prev
                                    </Button>
                                )}
                                {!isLastVideo() && (
                                    <Button
                                    disabled={loading}
                                    onClick={goToNextVideo}
                                    className='text-yellow-400 bg-slate-100'
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                }
            </Player>

            // </div>
        )
      }
      <h1 className="mt-4 text-3xl font-semibold">
        {videoData?.title}
      </h1>
      <p className="pt-2 pb-6">
        {videoData?.description}
      </p>
        {/* Toggle Sidebar Button
         <Button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="mt-4 text-white bg-blue-500"
        >
          {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
        </Button> */}
      

      {/* Sidebar */}
      {/* Sidebar */}
{/* {showSidebar && (
  <div
    className="fixed top-0 left-0 z-50 h-screen bg-white shadow-lg w-90"
    style={{ overflowY: "auto" }}
  >
    <VideoDetailsSidebar />
  </div>
)} */}

     
    </div>
  )
}

export default VideoDetails