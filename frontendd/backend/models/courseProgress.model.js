import mongoose, { model, Schema } from 'mongoose';

const courseProgressSchema = new Schema(
  {
    courseID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',

    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    completedVideos:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSections',
        }
    ]
   
  },
  {
    timestamps: true,
  }
);

const CourseProgress = model('CourseProgress', courseProgressSchema);

export default CourseProgress;

