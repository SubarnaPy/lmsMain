

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helpers/axiosInstance";

// Function to get data from localStorage


const initialState = {
  // isLoggedIn: localStorage.getItem("isLoggedIn") ? JSON.parse(localStorage.getItem("isLoggedIn")) : false,
 
  data: JSON.parse(localStorage.getItem("data")) || {},
    // role: localStorage.getItem("role") || "",
  // token: localStorage.getItem("token") ||null, // Get token from localStorage if available
  enrolledCourses: [],
};

export const getProfile = createAsyncThunk(
    "/profile/get",
    async () => {
      try {
        const res = axiosInstance.get('/profile/getUserDetails');
  
        toast.promise(res, {
          loading: "loading profile....",
          success: "Profile loaded successfully",
          error: "Failed to fetch profile",
        });
  
         console.log(res);
        
  
        const response = await res;
        console.log(response);
        console.log(response.data);

        
        return  await response.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  );
  // Thunk to get enrolled courses
export const getUserEnrolledCourses = createAsyncThunk(
  "/courses/getEnrolled",
  async (_, { rejectWithValue }) => {
    try {
      const res = axiosInstance.get("/profile/getEnrolledCourses");
      // console.log(res.data.user.courses); // Log response for debugging purposes

      toast.promise(res, {
        loading: "Loading enrolled courses...",
        success: "Enrolled courses loaded successfully",
        error: "Failed to load enrolled courses",
      });

      const response = await res;
      return await response.data.user;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error?.response?.data);
    }
  }
);

//edit profile

export const updateAdditionalDetails = createAsyncThunk(
  'profile/updateAdditionalDetails', // Action type
  async (data, { rejectWithValue }) => { // Add rejectWithValue
    try {
      console.log(data);

      const response = await axiosInstance.put('/profile/updateProfile', data);
      console.log(response);

      // Optional: Add success toast
      toast.success("Profile updated successfully");

      return await response.data; // Return the response data for fulfilled state
    } catch (error) {
      // Optional: Display an error toast
      toast.error(error?.response?.data?.message || "An error occurred");

      // Return a rejected value with the error message
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
// updatePassword, updatePfp,deleteAccount 
export const updatePassword= createAsyncThunk(
  async (data, { rejectWithValue }) => {
      try {
        const res = axiosInstance.put('/profile/updateProfile',data);
  
        toast.promise(res, {
          loading: "loading profile....",
          success: "Profile loaded successfully",
          error: "Failed to fetch profile",
        });
  
        console.log(res);
        
  
        const response = await res;
        console.log(response);
        return response.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
        return rejectWithValue(error.response?.data?.message || error.message);

      }
    }
);
export const updatePfp = createAsyncThunk(
  'profile/updatePfp',
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Starting profile update...");

      // Inspect FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Make API call with toast.promise
      const response = await toast.promise(
        axiosInstance.put('/profile/updateProfile', formData),
        {
          loading: "Updating profile...",
          success: "Profile updated successfully",
          error: "Failed to update profile",
        }
      );

      console.log("Update successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update failed:", error.response?.data?.message || error.message);
      toast.error(error?.response?.data?.message || "An error occurred.");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  async (data, { rejectWithValue }) => {
      try {
        const res = axiosInstance.put('/profile/updateProfile',data);
  
        toast.promise(res, {
          loading: "loading profile....",
          success: "Profile loaded successfully",
          error: "Failed to fetch profile",
        });
  
        console.log(res);
        
  
        const response = await res;
        console.log(response);
        return response.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
        return rejectWithValue(error.response?.data?.message || error.message);

      }
    }
);




const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle user profile
      .addCase(getProfile.fulfilled, (state, action) => {
        console.log(action); // Log action for debuggin
        // g purposes
        if(!action?.payload?.data){
          console.log("i ama hare")
          localStorage.clear();
      state.isLoggedIn = false;
      state.data = {};
      state.role = "";
      state.token = null;

        }
        console.log(action?.payload?.data)
        localStorage.setItem("data",JSON.stringify( action.payload.data));
        console.log(state.data)
        state.data = action?.payload?.data;
       
        
        // state.user = action?.payload.data;
        
      // Handle user logout
      
      // Handle user details
      
     })
     .addCase(updateAdditionalDetails.fulfilled,(state, action) => {
      console.log(action.payload.newuser); // Log action for debugging purposes
      localStorage.setItem("data", JSON.stringify(action?.payload.newuser));
      
       state.data = action?.payload.newuser;
      
    // Handle user logout
    
    // Handle user details
    
   })
  
      .addCase(getUserEnrolledCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserEnrolledCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(getUserEnrolledCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load courses";
      });


  }
});

export const {} = profileSlice.actions;
export default profileSlice.reducer;
 