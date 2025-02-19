


import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { Button, Grid, MenuItem, Paper, TextField } from '@mui/material';

import {
    addCourseDetails, editCourseDetails, fetchCourseCategories,
    setEditCourse
} from '../../../../Redux/courseSlice';
import { setCourse, setStep } from "../../../../Redux/courseSlice";
import { COURSE_STATUS } from "../../../../utils/constants";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementField from './RequirementField';
// import { MenuItem } from '@material-tailwind/react';


// import { Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CourseInformationForm = () => {

  const { register, handleSubmit, setValue, getValues, control, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
      const getCategories = async () => {
          setLoading(true);
          const categories = await dispatch(fetchCourseCategories());
          if (categories.payload.length > 0) {
             setCourseCategories(categories.payload);
          }
          setLoading(false);
      };
      console.log(course)

      if (editCourse) {
          setValue("courseTitle", course.title);
          setValue("courseShortDesc", course.description);
          setValue("coursePrice", course.price);
          setValue("courseTags", course.tags);
          setValue("courseBenefits", course.whatYouWillLearn);
          setValue("courseCategory", course.category);
          setValue("courseRequirements", course.instructions);
          setValue("courseImage", course.thumbnail);
      }

      getCategories();
  }, [editCourse, dispatch, course, setValue]);

  const isFormUpdated = () => {
      const currentValues = getValues();
      if (currentValues.courseTitle !== course.title ||
          currentValues.courseShortDesc !== course.description ||
          currentValues.coursePrice !== course.price ||
          currentValues.courseTags.toString() !== course.tags.toString() ||
          currentValues.courseBenefits !== course.whatYouWillLearn ||
          currentValues.courseCategory._id !== course.category._id ||
          currentValues.courseImage !== course.thumbnail ||
          currentValues.courseRequirements.toString() !== course.instructions.toString()) {
          return true;
      }
      return false;
  };
  console.log(editCourse)


  const onSubmit = async (data) => {
    console.log(editCourse)
    // console.log(JSON.stringify(data.courseRequirements)  , course.instructions.toString(),(JSON.stringify(data.courseRequirements).toString() != course.instructions))
      if (editCourse) {
          if (isFormUpdated()) {
              const formData = new FormData();
              formData.append("courseId", course._id);

              if (data.courseTitle !== course.title) {
                  formData.append("title", data.courseTitle);
              }
              if (data.courseShortDesc !== course.description) {
                  formData.append("description", data.courseShortDesc);
              }
              if (data.coursePrice !== course.price) {
                  formData.append("price", data.coursePrice);
              }
              if (data.courseBenefits !== course.whatYouWillLearn) {
                  formData.append("whatYouWillLearn", data.courseBenefits);
              }
              if (data.courseCategory._id !== course.category._id) {
                  formData.append("category", data.courseCategory);
              }
              if (JSON.stringify(data.courseRequirements).toString() != course.instructions.toString()) {
                
                  formData.append("instructions", JSON.stringify(data.courseRequirements));
              }
              if (JSON.stringify(data.courseTags).toString() != course.tags.toString()) {
                formData.append("tags", JSON.stringify(data.courseTags));
            }

              setLoading(true);
              const result = await dispatch(editCourseDetails(formData));
              setLoading(false);
              if (result) {
                  dispatch(setEditCourse(false));
                  dispatch(setStep(2));
                  dispatch(setCourse(result.payload));
              }
          } else {
              toast.error("No changes made so far");
          }
      } else {
        console.log("i am hare")
          const formData = new FormData();
          formData.append("title", data.courseTitle);
          formData.append("description", data.courseShortDesc);
          formData.append("price", data.coursePrice);
          formData.append("whatYouWillLearn", data.courseBenefits);
          formData.append("category", data.courseCategory);
          formData.append("instructions", JSON.stringify(data.courseRequirements));
          formData.append("status", COURSE_STATUS.DRAFT);
          formData.append("tags", JSON.stringify(data.courseTags));
          formData.append("thumbnailImage", data.courseImage);

          setLoading(true);
          const result = await dispatch(addCourseDetails(formData));
          setLoading(false);
          console.log(result,);
          if (result?.payload != undefined || null)  {
              dispatch(setStep(2));
              dispatch(setCourse(result?.payload));
          }
      }
  };

  return (
    <Paper elevation={3} style={{ maxWidth: "800px", margin: "20px auto", padding: "20px", borderRadius: "10px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="courseTitle"
              label="Course Name"
              placeholder="Enter Course Title"
              {...register("courseTitle", { required: true })}
            />
            {errors.courseTitle && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is required**</span>}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="courseShortDesc"
              label="Course Description"
              multiline
              rows={4}
              placeholder="Enter Description"
              {...register("courseShortDesc", { required: true })}
              className="resize-x-none min-h-[130px] w-full"
            />
            {errors.courseShortDesc && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Description is required**</span>}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="coursePrice"
              label="Course Price"
              placeholder="Enter Course Price"
              type="number"  // Ensure it's a number input
              {...register("coursePrice", { required: true, valueAsNumber: true })}
              InputProps={{
                startAdornment: <HiOutlineCurrencyRupee size={20} />
              }}
            />
            {errors.coursePrice && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is required**</span>}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Course Category"
              {...register("courseCategory", { required: true })}
              defaultValue="courseCategory"
              disabled={editCourse}
            >
              <option value="courseCategory" disabled>Choose a Category</option>
              {!loading && courseCategories.map((category, index) => (
                // <option key={index} value={category?._id}>{category?.name}</option>
                <MenuItem key={index} value={category?._id}>
                  {category?.name}
                </MenuItem>
              ))}
            </TextField>
            {errors.courseCategory && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is required**</span>}
          </Grid>

          <Grid item xs={12}>
            <ChipInput
              label="Tags"
              name="courseTags"
              placeholder="Enter tags and press enter"
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
            />
          </Grid>

          <Grid item xs={12}>
            <Upload 
              name="courseImage" 
              label="Course Image" 
              register={register} 
              errors={errors} 
              setValue={setValue} />
          </Grid>

          

<Grid item xs={12}>
  <label className="block text-sm font-medium text-gray-700">Benefits of the Course</label>
  <Controller
    name="courseBenefits"
    control={control}
    rules={{ required: true }}
    render={({ field }) => (
      <ReactQuill
        {...field}
        theme="snow"
        placeholder="Enter Benefits"
        className="bg-white"
      />
    )}
  />
  {errors.courseBenefits && (
    <span className="ml-2 text-xs tracking-wide text-pink-200">Benefits are required**</span>
  )}
</Grid>;


          <Grid item xs={12}>
            <RequirementField name="courseRequirements" label="Requirements/Instructions" register={register} errors={errors} setValue={setValue} getValues={getValues} />
          </Grid>

          <Grid item xs={12} className="flex justify-end gap-x-2">
            {editCourse && (
              <Button onClick={() => dispatch(setStep(2))} className="text-[10px] font-semibold bg-slate-700">
                Continue Without Saving
              </Button>
            )}
            <Button type="submit" className="text-[10px] text-yellow-200 font-semibold bg-slate-700">
              {!editCourse ? "Next" : "Save Changes"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CourseInformationForm;

