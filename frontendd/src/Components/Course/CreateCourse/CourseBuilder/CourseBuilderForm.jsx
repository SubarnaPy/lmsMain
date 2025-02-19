import React from 'react'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  createSection,
  updateSection,
} from "../../../../Redux/courseSlice"
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../Redux/courseSlice"
// import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"
import { Button } from '@material-tailwind/react'
import { AiOutlinePlusCircle } from 'react-icons/ai'

const CourseBuilderForm = () => {
  const { token } = useSelector((state) => state.auth);
  const [editSectionName, setEditSectionName] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);
  console.log(course);
  const gonext = async() => {
    console.log(course.courseContent)
    if (course.courseContent.length > 0) {
      if (
        course.courseContent.some((section) => section.subSection.length > 0)
      ) {
       await dispatch(setStep(3));
      } else {
        toast.error("Please add atleast one lesson to esch section");
      }
    } else {
      toast.error("Please add atleast one section to continue");
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let result=null;
    setLoading(true);
    if (editSectionName) {
      result = await dispatch(updateSection(
        {
          title: data.sectionName,
          courseId: course._id,
          sectionId: editSectionName,
        }
        
      ));
    } else {
      console.log(course._id)
      result = await dispatch(createSection(
        {
          title: data.sectionName,
          
          courseId: course._id,
        }
      ));
      console.log("-------------------------------",result)
    }
    if (result) {
      dispatch(setCourse(result.payload));
      setValue("sectionName", "");
      setEditSectionName(false);
    }
    setLoading(false);
  };


  const handelChangeEditSectionName = (sectionId,sectionName) => {
    console.log("i am here",sectionId,editSectionName,sectionName)
    if (editSectionName===sectionId) {
      setEditSectionName(false);
      setValue("sectionName", "");
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-black bg-slate-50 p-6">
      <p className="text-2xl font-semibold text-slate-950">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="text-sm text-slate-950" htmlFor="sectionName">
          Section Name<sup className="text-pink-200">*</sup>
        </label>
        <input
          id="sectionName"
          placeholder="Add a section to build your course"
          name="sectionName"
          className="w-full px-1"
          {...register("sectionName", { required: true })}
        />
        {errors.sectionName && (
          <p className="ml-2 text-xs tracking-wide text-pink-200">This field is required</p>
        )}
        <div className="flex items-end gap-x-4">
          <button
            type="submit"
            className="flex items-center px-5 py-2 font-semibold border border-black rounded-md cursor-pointer bg-slate-400 gap-x-2 text-slate-950 undefined"
          >
            <span className="text-yellow-50">
              {editSectionName ? "Edit Section Name" : "Create Section"}
            </span>
            <AiOutlinePlusCircle size={20} className="text-yellow-50" />
          </button>
          {editSectionName && (
            <Button
              onClick={() => {
                setEditSectionName(false);
                
                setValue("sectionName", "");
              }}
              type="button"
              className="text-sm underline text-slate-700"
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </form>
       {course?.courseContent?.length > 0 && <NestedView handelChangeEditSectionName={handelChangeEditSectionName} />} 
      <div className="flex justify-end gap-x-3">
        <button
          onClick={() => {
            dispatch(setEditCourse(true));
            dispatch(setStep(1));
          }}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-slate-500 py-[8px] px-[20px] font-semibold text-white"
        >
          Back
        </button>
        <button
          onClick={gonext}
          className="flex items-center px-5 py-2 font-semibold rounded-md cursor-pointer bg-yellow-50 gap-x-2 text-richblack-900 undefined"
        >
          <span className="false">Next</span>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CourseBuilderForm