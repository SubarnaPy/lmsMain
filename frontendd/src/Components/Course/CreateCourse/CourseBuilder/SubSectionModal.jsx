
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../Redux/courseSlice"
import { setCourse } from "../../../../Redux/courseSlice"
// import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import { Button } from '@material-tailwind/react'
import { useParams } from "react-router-dom"

const SubSectionModal = ({
    modalData,
    setModalData, 
    add=false,
    view =false,
    edit = false
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  console.log(useParams())
  let  {courseId}  = useParams() || course._id
  courseId= courseId   || course._id
  console.log(courseId)
  console.log(modalData)

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
        getValues
    }= useForm()

  

   

    useEffect(() => {
      if(view || edit) {
         console.log("Modal data for edit/view", modalData.pdf.secure_url)
        setValue("lectureTitle", modalData.title)
        setValue("lectureDesc", modalData.description)
        setValue("lectureVideo", modalData?.lecture?.secure_url)
        setValue("lecturePdf", modalData.pdf.secure_url)
     }
    }, [])
    
    const isFormUpdated = () => {
        const currentValues = getValues()

        if(
            currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl ||
            currentValues.lecturePdf !== modalData.pdfUrl
        ){
            return true
        }
        return false
    }

    // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues()
     console.log("changes after editing form values:", currentValues)
    const formData = new FormData()
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("videoFile", currentValues.lectureVideo)
    }
    if (currentValues.lecturePdf !== modalData.pdfUrl) {
      formData.append("pdfFile", currentValues.lecturePdf)
    }
    formData.append("courseId", course._id)


    // console.log("Values After Editing form values:", formData)
    setLoading(true)
    console.log("Values After Editing", ...formData)
    const result = await dispatch(updateSubSection(formData))
    console.log(result)
    if (result.payload!=null|| undefined) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result.payload : section
      )

      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      console.log(updatedCourse,updatedCourseContent)
      dispatch(setCourse(result.payload))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    // console.log(data)
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        handleEditSubsection()
      }
      return
    }
      
    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("videoFile", data.lectureVideo)
    formData.append("pdfFile", data.lecturePdf)
    formData.append("courseId", courseId)

    console.log(...formData)
    // setLoading(true)
    console.log({...formData})

    const result = await dispatch(createSubSection(formData))
    console.log(result)
    if (result.payload != null || undefined) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(result.payload))
    }
    setModalData(null)
    setLoading(false)
  }
  console.log("Modal Data:", modalData)
  return (
    <div className="fixed bg-slate-200 inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto  bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-black shadow-lg bg-slate-50">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 rounded-t-lg0">
          <p className="text-xl font-semibold text-slate-950">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <Button className="bg-white" onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-slate-950"  />
          </Button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-8 py-10 space-y-8"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData?.lecture?.secure_url : null}
            editData={edit ? modalData?.lecture?.secure_url : null}
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-slate-950" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="w-full p-2 shadow-lg "
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-slate-950" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="resize-x-none p-2 shadow-lg  min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>

          {/* Upload PDF */}
          <div>
            <label className="block text-sm font-medium">Upload PDF</label>
            {view ? (
              <a
                href={modalData?.pdf.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
            ) : (
              <Upload
  name="lecturePdf"
  label="Lecture PDF"
  register={register}
  setValue={setValue}
  errors={errors}
  pdf={true}
  viewData={view ? modalData?.pdf?.secure_url : null}
  editData={edit ? modalData?.pdf?.secure_url : null}
/>

            )}
          </div>

          {!view && (
            <div className="flex justify-end">
              
              <Button
                   type={"submit"}
                  className=' text-[10px]  text-yellow-200 font-semibold  bg-slate-700'
                  >
                   {!edit ? "Next" : "Save Changes"}
                  </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default SubSectionModal