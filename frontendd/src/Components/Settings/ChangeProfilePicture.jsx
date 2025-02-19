import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

// import { updatePfp } from "../../../../services/operations/SettingsAPI"
// import IconBtn from "../../../common/IconBtn"
import { updatePfp } from "../../Redux/profileSlice"
import { Button } from "@material-tailwind/react"

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const user  = useSelector((state) => state.profile.data)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = async() => {
    try {
      console.log("uploading...")
      setLoading(true)
      const formData = new FormData()
      formData.append("thumbnailImage", imageFile)
      console.log("formdata", ...formData)
       const res=await dispatch(updatePfp( formData)).then(() => {
        setLoading(false)
      })
      console.log(res)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])
  return (
    <>
      <div className="flex items-center justify-between rounded-md border-[1px] border-slate-950  p-8 px-12 text-richblack-5">
        <div className="flex items-center gap-x-4">
          <img
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square shadow-lg w-[78px] rounded-full object-cover"
          />
          <div className="space-y-2">
            <p>Change Profile Picture</p>
            <div className="flex flex-row gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
              />
              <button
                onClick={handleClick}
                disabled={loading}
                className="px-5 py-2 font-semibold rounded-md cursor-pointer bg-slate-400 text-slate-50"
              >
                Select
              </button>
              <Button
                text={loading ? "Uploading..." : "Upload"}
                onClick={handleFileUpload}
                className="px-5 py-2 font-semibold rounded-md cursor-pointer bg-slate-400 text-slate-50"

              >
                {!loading && (
                  <FiUpload className="text-lg " />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}