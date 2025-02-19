
import { useSelector } from 'react-redux'
import { FaCheck } from "react-icons/fa"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm.jsx"
import CourseInformationForm from "./CourseInformation/CourseInformationForm.jsx"
import PublishCourse from "./PublishCourse/index.jsx"
const RenderSteps = () => {
    const {step} = useSelector((state)=> state.course)

    const steps = [ 
        {id:1,
        title: "Course Information"},
        {
            id: 2,
            title: "Course Builder",
          },
          {
            id: 3,
            title: "Publish",
          }
    ]
  return (
    <>
        <div className="relative flex justify-center w-full mb-2">
            {steps.map((item)=> (
                < >  
                
                {/* Step Circle */}

                    <div className="flex flex-col items-center shadow-2xl " key={item.id}>
                        <button
                        className={`cursor-default aspect-square w-[34px]
                         place-items-center rounded-full border-[1px] shadow-2xl
                         ${step === item.id ? ' border-yellow-500 bg-yellow-600 text-yellow-300 ' 
                         : ' bg-x-yellow-50 border-slate-950 text-slate-800'}
                         ${step > item.id ? ' bg-yellow-50' :'text-yellow-50'}`}
                         >
                            {step > item.id ? (
                                <FaCheck className='font-bold text-slate-950'/>
                            ) : 
                            (item.id)}
                        </button>
                    </div>
                {/* Dotted Line */}
                    {item.id !== steps.length && (
                        <>
                            <div key={item.id}
                            className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 
                            ${step > item.id  ? "border-yellow-500" : "border-black"}`}
                            ></div>
                        </>
                    )}
                </>
            ))}
        </div>

        {/* Steps titles */}
      {/* <div className="relative flex justify-between w-full mb-16 select-none">
        {steps.map((item) => (
          <>
            <div
              className="flex min-w-[130px] flex-col items-center gap-y-2"
              key={item.id}
            >
              
              <p
                className={`text-sm ${
                  step >= item.id ? "text-slate-950" : "text-slate-900"
                }`}
              >
                {item.title}
              </p>
            </div>
            
          </>
        ))}
      </div> */}
       {/* Steps Titles */}
       <div className="relative flex flex-wrap justify-between w-full mb-8 gap-y-2 lg:flex-nowrap">
        {steps.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center min-w-[80px] sm:min-w-[100px] lg:min-w-[130px]"
          >
            <p
              className={`text-xs sm:text-sm lg:text-base ${
                step >= item.id ? "text-slate-950" : "text-slate-900"
              }`}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>


      <div className="w-full">
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </div>

    </>
  )
}

export default RenderSteps



// import { useSelector } from "react-redux";
// import { FaCheck } from "react-icons/fa";

// import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm.jsx";
// import CourseInformationForm from "./CourseInformation/CourseInformationForm.jsx";
// import PublishCourse from "./PublishCourse/index.jsx";

// const RenderSteps = () => {
//   const { step } = useSelector((state) => state.course);

//   const steps = [
//     { id: 1, title: "Course Information" },
//     { id: 2, title: "Course Builder" },
//     { id: 3, title: "Publish" },
//   ];

//   return (
//     <>
//       {/* Steps Circles and Lines */}
//       <div className="relative flex flex-wrap justify-between w-full mb-4 lg:flex-nowrap gap-y-4">
//         {steps.map((item, index) => (
//           <div key={item.id} className="flex items-center w-full lg:w-auto">
//             {/* Step Circle */}
//             <div className="flex flex-col items-center">
//               <button
//                 className={`aspect-square w-8 sm:w-10 lg:w-12 rounded-full border shadow-lg 
//                 ${
//                   step === item.id
//                     ? "bg-yellow-600 border-yellow-500 text-yellow-300"
//                     : "bg-yellow-50 border-slate-950 text-slate-800"
//                 } 
//                 ${step > item.id ? "bg-yellow-50 text-slate-950" : ""}`}
//               >
//                 {step > item.id ? (
//                   <FaCheck className="text-sm sm:text-base lg:text-lg" />
//                 ) : (
//                   item.id
//                 )}
//               </button>
//             </div>

//             {/* Dotted Line */}
//             {item.id !== steps.length && (
//                         <>
//                             <div key={item.id}
//                             className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 
//                             ${step > item.id  ? "border-yellow-500" : "border-black"}`}
//                             ></div>
//                         </>
//                      )}
//           </div>
//         ))}
//       </div>

//       {/* Steps Titles */}
//       <div className="relative flex flex-wrap justify-between w-full mb-8 gap-y-2 lg:flex-nowrap">
//         {steps.map((item) => (
//           <div
//             key={item.id}
//             className="flex flex-col items-center min-w-[80px] sm:min-w-[100px] lg:min-w-[130px]"
//           >
//             <p
//               className={`text-xs sm:text-sm lg:text-base ${
//                 step >= item.id ? "text-slate-950" : "text-slate-900"
//               }`}
//             >
//               {item.title}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Render specific component based on current step */}
//       <div className="w-full">
//         {step === 1 && <CourseInformationForm />}
//         {step === 2 && <CourseBuilderForm />}
//         {step === 3 && <PublishCourse />}
//       </div>
//     </>
//   );
// };

// export default RenderSteps;
