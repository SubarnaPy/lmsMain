import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import CourseProgress from "../models/courseProgress.model.js";
import SubSection from "../models/subSection.model.js";

//course progress add course in courseProgress
export const updateCourseProgress  = asyncHandler(async (req, res, next) => {
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;
    console.log(req.body)

    try {
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(405).json({
                error:"Invalid SubSection"
            })
        }

        let courseProgress = await CourseProgress.findOne({
            courseID:courseId,
            userId:userId
        })

        if (!courseProgress) {
            return res.status(406).json({
                error:"Course Progress does not exist"
            })
        }
        else{
            if (courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(200).json({
                    success:false,
                    message:"Video already completed"
                })
            }

            courseProgress.completedVideos.push(subSectionId);
            console.log("Copurse Progress Push Done");
        }
        await courseProgress.save();
        console.log("Copurse Progress",courseProgress)
        const completedVideos = courseProgress.completedVideos;
        console.log("Course Progress Save call Done");
        return res.status(200).json({
            success:true,
            completedVideos,
            message:"Course Progress Updated Successfully",
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({error:"Internal Server Error"});
    }


});



