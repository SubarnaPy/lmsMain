import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import Course from "../models/course.model.js";
import User from '../models/user.model.js';
import AppError from "../utils/AppError.js";
import sendMail from "../utils/sendMail.js";


////todo contact us

export const contactUs = asyncHandler(async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name ||!email ||!message) {
        return next(new AppError("All fields are required", 400));
    }

    try {

        const subject='contact us';
        const textMessage =`${name}- ${email} <br /> ${message}`;

        await sendMail(process.env.CONTACT_US_EMAIL, subject, textMessage);
        
    } catch (error) {
        next(new AppError("Failed to send message. Please try again later.", 500));
    }

    res.status(200).json({
        success: true,
        message: "Message sent successfully",
    });
});

////todo user status admin

export const userStats = asyncHandler(async (req, res, next) => {
    try {
        const allUsercount = await User.countDocuments({ role: 'STUDENT' });
        // Uncomment this if needed
        // const subscribedUserCount = await User.countDocuments({
        //     'subscription.status': 'active',
        // });

        const id = req.user.id; // Ensure req.user is populated correctly.
        const courseData = await Course.find({ instructor: id });
        
        const courseDetails = courseData.map((course) => {
            const totalStudents = course?.studentEnrolled.length || 0;
            const totalRevenue = (course?.price || 0) * totalStudents;

            return {
                _id: course._id,
                courseName: course.title,
                courseDescription: course.description,
                totalStudents,
                totalRevenue,
            };
        });

        let totalRevenue = 0;
        let totalStudents = 0;

        courseDetails.forEach((course) => {
            totalRevenue += course.totalRevenue;
            totalStudents += course.totalStudents;
        });

        return res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: {
                allUsercount,
                // Uncomment this if needed
                // subscribedUserCount,
                totalRevenue,
                totalStudents,
                courses: courseDetails,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
