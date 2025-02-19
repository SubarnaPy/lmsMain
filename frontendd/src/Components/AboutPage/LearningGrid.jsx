import React from 'react'
import HighlightText from '../HomePage/HighlightText';
import { Link } from 'react-router-dom';


const LearningGridArray = [
    {
      order: -1,
      heading: "World-Class Learning for",
      highlightText: "Anyone, Anywhere",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
      BtnText: "Learn More",
      BtnLink: "/",
    },
    {
      order: 1,
      heading: "Curriculum Based on Industry Needs",
      description:
        "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    },
    {
      order: 2,
      heading: "Our Learning Methods",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 3,
      heading: "Certification",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 4,
      heading: `Rating "Auto-grading"`,
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 5,
      heading: "Ready to Work",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
  ];


const LearningGrid = () => {
  return (
    <div className='grid p-5 mb-10 text-left grid-col-1 lg:grid-cols-4 lg:w-fit bg-teal-950'>
    {
        LearningGridArray.map( (card, index) => {
            return (
                <div key={index}  className={`${index === 0 && "lg:col-span-2 lg:h-[280px] p-5  bg-teal-950"}
                ${
                    card.order % 2 === 1 ? "bg-slate-700 lg:h-[280px] p-5" : "bg-gray-800 lg:h-[280px] p-5"
                }
                ${card.order === 3 && "lg:col-start-2"}
                ${card.order < 0 && " bg-teal-950"}
                `}>
                {
                    card.order < 0 
                    ? (
                        <div className='lg:w-[90%] flex flex-col pb-5 gap-3' >
                            <div className='text-4xl font-semibold'>
                                {card.heading}
                                <HighlightText text={card.highlightText} />
                            </div>
                            <p className='font-medium'>
                                {card.description}
                            </p>
                            <div className='mt-4 w-fit'>
                                
                                <Link to={card.BtnLink}>
                                     <button className="px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition-transform transform hover:scale-105 hover:bg-[#005bb5] shadow-lg">
                                     {card.BtnText}
                                     </button>
                                 </Link>
                            </div>
                        </div>
                    )
                    : (<div className='flex flex-col gap-8 p-7'>
                        <h1 className='text-lg text-richblack-5'>
                            {card.heading}
                        </h1>
                        <p className='font-medium text-richblack-300'>
                            {card.description}
                        </p>
                    </div>)
                }

                </div>
            )
        } )
    } 
    </div>
  )
}

export default LearningGrid
