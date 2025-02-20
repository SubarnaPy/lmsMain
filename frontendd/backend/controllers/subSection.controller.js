import Section from '../models/section.model.js';
import SubSection from '../models/subSection.model.js';
import Course from '../models/course.model.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/AppError.js';
import cloudinary from 'cloudinary';
// import fs from 'fs.promises';
import fs from "fs";
import path from "path";

// import cloudinary from 'cloudinary';

// import asyncHandler from '../middlewares/asyncHandler.middleware.js';
// import AppError from '../utils/AppError.js';

//import SubSection from '../models/subSection.model.js';


export const createSubSection = asyncHandler(async (req, res, next) => {
  console.log("Received Data:", req.body);
  console.log("Uploaded Files:", req.files);

  const { title, description, sectionId, courseId } = req.body;

  if (!title || !description || !sectionId || !courseId) {
    return res.status(400).json({ success: false, message: "Title and description are required" });
  }

  const ifsection = await Section.findById(sectionId);
  if (!ifsection) {
    return res.status(404).json({ success: false, message: "Section not found" });
  }

  let lectureData = {};
  let pdfData = {};

  try {
    if (req.files?.videoFile) {
      console.log("Uploading video...");
      const videoResult = await cloudinary.v2.uploader.upload(req.files.videoFile[0].path, {
        folder: "lms3",
        resource_type: "video",
      });
      lectureData = {
        public_id: videoResult.public_id,
        secure_url: videoResult.secure_url,
      };
    }

    if (req.files?.pdfFile) {
      console.log("Uploading PDF...");
      const pdfResult = await cloudinary.v2.uploader.upload(req.files.pdfFile[0].path, {
        folder: "lms3",
        resource_type: "raw", // Ensure raw file upload
        format: "pdf", // Explicitly set format
        use_filename: true, // Keep original filename
        unique_filename: false, // Avoid Cloudinary renaming it
      });
    
      pdfData = {
        public_id: pdfResult.public_id,
        secure_url: pdfResult.secure_url,
      };
    }
    
    console.log("File upload complete");

    // Delete uploaded files from local storage
  
    
    try {
      for (const fileKey in req.files) {
        for (const file of req.files[fileKey]) {
          if (fs.existsSync(file.path)) {
            await fs.promises.unlink(file.path);
          }
        }
      }
    } catch (err) {
      console.error("Error deleting files:", err);
    }
    
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message || "File upload failed" });
  }

  // Create SubSection with video and/or PDF data
  const SubSectionDetails = await SubSection.create({
    title,
    description,
    lecture: lectureData,
    pdf: pdfData,
  });

  if (!SubSectionDetails) {
    return res.status(500).json({ success: false, message: "Failed to create subsection" });
  }

  console.log("Subsection created successfully", SubSectionDetails);

  // Update the section with the new subsection
  const updatedSection = await Section.findByIdAndUpdate(
    sectionId,
    { $push: { subSection: SubSectionDetails._id } },
    { new: true }
  ).populate("subSection");

  if (!updatedSection) {
    return res.status(404).json({ success: false, message: "Failed to update section" });
  }

  console.log("Updated section", updatedSection);

  // Populate the course with all related content
  const course = await Course.findById(courseId).populate({
    path: "courseContent",
    populate: { path: "subSection" },
  });

  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }

  res.status(201).json({
    success: true,
    data: course,
  });
});



 //todo get all subsections by section id
 export const getAllSubSectionsBySectionId=asyncHandler(async(req, res, next)=>{
    const {sectionId}=req.params;

    const section = await Section.findById(sectionId).populate('subSections');

    if(!section){
        return next(new AppError('Section not found',404));
    }

    res.status(200).json({
        status:'success',
        subSection:section.subSection,
    });
 });

 //update subSection
 export const updateSubSectionById=asyncHandler(async(req, res, next)=>{
      console.log("aasdfghjmk",req.body);
   		const { subSectionId, title ,sectionId, description,courseId } = req.body;
        // console.log("aasdfghjmk",SubsectionId,sectionId,subSectionId, title , description,courseId);
        console.log("aasdfghjmk",req.file);

    let lecture={};
    const updatedSubsection = await SubSection.findById(subSectionId);
    console.log("updatedSubsection",updatedSubsection)

   
    if(title){
       const updatedSubsection = await SubSection.findByIdAndUpdate(subSectionId, { title }, { new: true });
        if (!updatedSubsection) {
            return next(new AppError('Subsection not found for title', 404));
        }

    }
    if(description){
       const updatedSubsection = await SubSection.findByIdAndUpdate(subSectionId, { description }, { new: true });
        if (!updatedSubsection) {
            return next(new AppError('Subsection not found for desc', 404));
        }
    }

    if(req.file){
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms3',
                    chunk_size:50000000,
                    resource_type:'video',

                });

                if(result){
                    lecture.public_id=result.public_id;
                    lecture.secure_url=result.secure_url;
                }

                const success=fs.rm(req.file.path);

                if(success){
                    console.log('File deleted successfully');
                }
                
        }catch(e){
            for (const file of await fs.readdir('uploads/')) {
                await fs.unlink(path.join('uploads/', file));
              }
              return next(
                new AppError(
                  JSON.stringify(error) || 'File not uploaded, please try again',
                  400
                )
            )
        }
    }
    
    try {
        // Update subsection
        const updatedSubSection = await SubSection.findByIdAndUpdate(
          {_id:subSectionId},
          {
        
            ...(req.file && { lecture }) // Only include lectureData if file was uploaded
          },
          { new: true } // Return the updated document
        );
        	

    
        if (!updatedSubSection) {
          return next(new AppError('Subsection not found', 404));
        }
        const updatedCourse = await Course.findById(courseId)
        .populate({
          path: 'courseContent', // populate courseContent (sections)
          populate: {
            path: 'subSection', // populate the subSections inside each section
          },
        }); 
    
        res.status(200).json({
          success: true,
          data: updatedCourse,
        });
      } catch (error) {
        return next(new AppError('Failed to update subsection', 500));
      }
    });

    //delete subsection
    export const deleteSubSectionById=asyncHandler(async(req, res, next)=>{
        const {subSectionId,courseId} = req.body;
        console.log(req.body);
		const sectionId=req.body.sectionId;
   if(!subSectionId || !sectionId){
		return res.status(404).json({
            success: false,
            message: "all fields are required",
        });
	}
	const ifsubSection = await SubSection.findById({_id:subSectionId});
	const ifsection= await Section.findById({_id:sectionId});
	if(!ifsubSection){
		return res.status(404).json({
            success: false,
            message: "Sub-section not found",
        });
	}
	if(!ifsection){
		return res.status(404).json({
            success: false,
            message: "Section not found",
        });
    }
    try {
      await SubSection.findByIdAndDelete(subSectionId);
	await Section.findByIdAndUpdate({_id:sectionId},{$pull:{subSection:subSectionId}},{new:true});
	//const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "subSection" } });
  const updatedCourse = await Course.findById(courseId)
        .populate({
          path: 'courseContent', // populate courseContent (sections)
          populate: {
            path: 'subSection', // populate the subSections inside each section
          },
        }); 
        console.log("updated courseContent",updatedCourse)
	
	
        res.status(200).json({
            success:true,
            message:'Subsection deleted successfully',
            data:updatedCourse

        });
      
    } catch (error) {
      return next(new AppError('Failed to delete subsection', 510));
      
    }
	
    });
