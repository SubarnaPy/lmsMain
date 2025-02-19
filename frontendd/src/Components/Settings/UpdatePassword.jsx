import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword, resetPassword } from "../../Redux/authSlice"
import { Button } from "@material-tailwind/react"
import { Paper, TextField } from "@mui/material"
// import IconBtn from "../../../common/IconBtn"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    // console.log("password Data - ", data)
    try {
      const res=await dispatch (changePassword( data))
      if (res.payload.success) {
        navigate("/dashboard/my-profile");
      }
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
     <Paper
      elevation={3}
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        {/* <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-black bg-white p-8 px-12"> */}
        <>
          <h2 className="text-lg font-semibold text-black">Password</h2>
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              {/* <label htmlFor="oldPassword" className="">
                Current Password
              </label> */}
              
              <TextField
                type={showOldPassword ? "text" : "password"}
                label="Current Password"
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style"
                {...register("oldPassword", { required: true })}
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[20px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
            </div>
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              {/* <label htmlFor="newPassword" className="">
                New Password
              </label> */}
              <TextField
                type={showNewPassword ? "text" : "password"}
                label="New Password"
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className=""
                {...register("newPassword", { required: true })}
              />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[20px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your New Password.
                </span>
              )}
            </div>
          </div>
         </>
        {/* </div> */}
        <div className="flex justify-end gap-2 py-4">
          <Button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className="px-5 py-2 font-semibold text-black rounded-md cursor-pointer bg-slate-300 "
          >
            Cancel
          </Button>
          <Button type="submit"
                      className="px-5 py-2 font-semibold text-black rounded-md cursor-pointer bg-slate-300 "
          >
            UPDATE
          </Button>


        </div>
      </form>
      </Paper>
    </>
  )
}