import React from 'react'
import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

// import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
// import IconBtn from "../../common/IconBtn"
// import CoursesTable from "./InstructorCourses/CoursesTable"
import { fetchInstructorCourses } from '../../Redux/courseSlice'
import { Button } from '@material-tailwind/react'
import CoursesTable from './CoursesTable'

const MyCourses = () => {
  const {token} = useSelector((state)=> state.auth);
  const {loading} = useSelector((state)=> state.course)
  const user=  useSelector((state)=> state.auth.data);
  console.log(user)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await dispatch(fetchInstructorCourses())
      console.log(result)
      if (result.payload==undefined){
        navigate('/login')
      }
      if(result.payload.success) setCourses(result.payload)
        
    }

    fetchCourses()
  }, [])
  

  return (
    <div>
      <div className="flex mb-10 gap-11 mt-7">
        <h1 className='text-3xl font-medium text-richblack-5'>My Courses</h1>
        <Button text="Add Course" 
        className='flex flex-row text-black'
        onClick={() => navigate("/dashboard/add-course")}>
          add<VscAdd/>
        </Button>
      </div>
      
        <>
      {courses && <CoursesTable courses={courses} setCourses={setCourses}/>}
      </>
      
    </div>
  )
}

export default MyCourses