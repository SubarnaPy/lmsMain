// import { useForm } from "react-hook-form"
// import { useDispatch, useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"

//  import { updateAdditionalDetails } from "../../Redux/profileSlice"
// import { Button } from "@material-tailwind/react"
// // import IconBtn from "../../../common/IconBtn"

// const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

// export default function EditProfile() {
//   const user  = useSelector((state) => state.profile.data)
//   const { token } = useSelector((state) => state.auth)
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm()

//   const submitProfileForm = async (data) => {
//      console.log("Form Data - ", data)
//     try {
//       const res =await dispatch(updateAdditionalDetails( data))
//       // console.log(res.payload)
//       if (res.payload.success){
//         navigate("/dashboard/my-profile")
//       }
//     } catch (error) {
//       console.log("ERROR MESSAGE - ", error.message)
//     }
//   }
//   return (
//     <>
//     <div >
//       <form onSubmit={handleSubmit(submitProfileForm)}>
//         {/* Profile Information */}
//         <div style={{ backgroundColor: "#f5f5f5" }} className="my-10 flex flex-col gap-y-6 bg-slate-50 rounded-md border-[1px] border-black text-black font-medium p-8 px-12">
//           <h2 className="text-lg font-semibold ">
//             Profile Information
//           </h2>
//           <div className="flex flex-col gap-5 lg:flex-row">
//             <div className="flex flex-col gap-2 lg:w-[48%]">
//               <label htmlFor="fullName" className="">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 name="fullName"
//                 id="fullName"
//                 placeholder="Enter first name"
//                 className="px-4 rounded-md shadow-lg h-7"
//                 {...register("fullName")}
//                 defaultValue={user?.fullName}
//               />
//               {errors.firstName && (
//                 <span className="-mt-1 text-[12px] text-yellow-100">
//                   Please enter your full name.
//                 </span>
//               )}
//             </div>
           
//           </div>

//           <div className="flex flex-col gap-5 lg:flex-row">
//             <div className="flex flex-col gap-2 lg:w-[48%]">
//               <label htmlFor="dateOfBirth" className="">
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 id="dateOfBirth"
//                 className="px-4 rounded-md shadow-lg h-7"
//                 {...register("dateOfBirth")}
//                 defaultValue={user?.additionalDetails?.dateOfBirth}
//               />
//               {errors.dateOfBirth && (
//                 <span className="-mt-1 text-[12px] text-yellow-100">
//                   {errors.dateOfBirth}
//                 </span>
//               )}
//             </div>
//             <div className="flex flex-col gap-2 lg:w-[48%]">
//               <label htmlFor="gender" className="">
//                 Gender
//               </label>
//               <select
//                 type="text"
//                 name="gender"
//                 id="gender"
//                 className="px-4 rounded-md shadow-lg h-7"
//                 {...register("gender")}
//                 defaultValue={user?.additionalDetails?.gender}
//               >
//                 {genders.map((ele, i) => {
//                   return (
//                     <option key={i} value={ele}>
//                       {ele}
//                     </option>
//                   )
//                 })}
//               </select>
//               {errors.gender && (
//                 <span className="-mt-1 text-[12px] text-yellow-100">
//                   Please enter your Date of Birth.
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-col gap-5 lg:flex-row">
//             <div className="flex flex-col gap-2 lg:w-[48%]">
//               <label htmlFor="contactNumber" className="">
//                 Contact Number
//               </label>
//               <input
//                 type="tel"
//                 name="contactNumber"
//                 id="contactNumber"
//                 placeholder="Enter Contact Number"
//                 className="px-4 rounded-md shadow-lg h-7"
//                 {...register("contact")}
//                 defaultValue={user?.additionalDetails?.contact}
//               />
//               {errors.contactNumber && (
//                 <span className="-mt-1 text-[12px] text-yellow-100">
//                   {errors.contactNumber.message}
//                 </span>
//               )}
//             </div>
//             <div className="flex flex-col gap-2 lg:w-[48%]">
//               <label htmlFor="about" className="">
//                 About
//               </label>
//               <input
//                 type="text"
//                 name="about"
//                 id="about"
//                 placeholder="Enter Bio Details"
//                 className="px-4 rounded-md shadow-lg h-7"
//                 {...register("about",)}
//                 defaultValue={user?.additionalDetails?.about}
//               />
//               {errors.about && (
//                 <span className="-mt-1 text-[12px] text-yellow-100">
//                   Please enter your About.
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end gap-2">
//           <Button
//             onClick={() => {
//               navigate("/dashboard/my-profile")
//             }}
//             className="px-5 py-2 font-semibold rounded-md cursor-pointer bg-slate-400 "
//           >
//             Cancel
//           </Button>
//           <Button 
           
//           type="submit" 
//           className="px-5 py-2 font-semibold rounded-md cursor-pointer bg-slate-400 "
//           >Save</Button>
//         </div>
//       </form>
//       </div>
//     </>
//   )
// }

import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Grid, TextField, MenuItem, Paper, Avatar, Typography } from "@mui/material";
import { updateAdditionalDetails } from "../../Redux/profileSlice"; // Make sure the action is correct
import { Email, Phone, LocationOn } from "@mui/icons-material";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
  const user = useSelector((state) => state.profile.data); // Assuming the user's data is in profile.data
  const { token } = useSelector((state) => state.auth); // For accessing the authentication token if needed
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  console.log(user?.additionalDetails?.gender)
  console.log(user?.additionalDetails?.dateOfBirth)

  // Set the default values of the form based on the current user data
  React.useEffect(() => {
    setValue("fullName", user.fullName);
    setValue("about", user?.additionalDetails?.about);
    setValue("dateOfBirth", user?.additionalDetails?.dateOfBirth);
    setValue("gender", user?.additionalDetails?.gender);
    setValue("email", user.email);
    // Add any additional fields you want to prefill
  }, [user, setValue]);

  const submitProfileForm = async (data) => {
    try {
      console.log(data);
      const res = await dispatch(updateAdditionalDetails(data));
      if (res.payload.success) {
        navigate("/dashboard/my-profile");
      }
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <Paper
      elevation={3}
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      {/* <Typography variant="h5" align="center" gutterBottom>
        Edit Profile
      </Typography> */}

      <form onSubmit={handleSubmit(submitProfileForm)}>
        <Grid container spacing={2}>
         

          {/* Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              defaultValue={user.fullName}
              {...register("fullName", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
          </Grid>

          {/* About */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="About"
              name="about"
              defaultValue={user.about}
              {...register("about")}
              multiline
              rows={4}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              defaultValue={user.email}
              {...register("email")}
              disabled
            />
          </Grid>

          {/* Date of Birth */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              defaultValue={user.dateOfBirth}
              {...register("dateOfBirth")}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              defaultValue={user?.additionalDetails?.gender}
              {...register("gender")}
            >
              {genders.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

        
          {/* Submit Button */}
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
