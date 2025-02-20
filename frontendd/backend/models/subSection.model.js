import { model, Schema } from 'mongoose';

const subSectionSchema = new Schema(
  {
    title: {
      type: String,
    },
    timeDuration: {
      type: String,
    },
    description: {
      type: String,
    },
    lecture: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    demoLecture: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    pdf: {  // New field for PDF
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const SubSection = model('SubSection', subSectionSchema);

export default SubSection;
