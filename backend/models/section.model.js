import mongoose, { model, Schema } from 'mongoose';

const sectionSchema = new Schema(
  {
    title:{
        type: String,
    
    },
   subSection:[
    {
        type:Schema.Types.ObjectId,
        //ref: 'Subsection',
        ref: 'SubSection',

    }
   ]
  },
  {
    timestamps: true,
  }
);

const Section = model('Section', sectionSchema);

export default Section;
