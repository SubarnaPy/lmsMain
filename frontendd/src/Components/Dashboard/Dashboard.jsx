import React, { useEffect } from "react";
 import HomeLayout from "../../Layouts/HomeLayout";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { FaUsers } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { FcSalesPerformance } from "react-icons/fc";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCourse, getAllCourses } from "../../Redux/courseSlice";
import { getStatsData } from "../../Redux/statSlice";
import { getPaymentRecord } from "../../Redux/razorpaySlice";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allUsersCount, subscribedUsersCount } = useSelector(
    (state) => state.stat
  );
  console.log(allUsersCount, subscribedUsersCount)
  const { allPayments, finalMonths, monthlySalesRecord } = useSelector(
    (state) => state.razorpay
  );

  const userData = {
    labels: ["Registered User", "Enrolled User"],
    datasets: [
      {
        label: "User Details",
        data: [allUsersCount , subscribedUsersCount ],
        backgroundColor: ["yellow", "green"],
        borderColor: ["yellow", "green"],
        borderWidth: 1,
      },
    ],
  };

  const salesData = {
    labels: [
      "January",
      "Febraury",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    fontColor: "white",
    datasets: [
      {
        label: "Sales / Month",
        data: monthlySalesRecord,
        backgroundColor: ["rgb(255, 99, 132)"],
        borderColor: ["white"],
        borderWidth: 2,
      },
    ],
  };

  // getting the courses data from redux toolkit store
  const myCourses = useSelector((state) => state.course.coursesData);
   console.log(myCourses)
  // function to handle the course delete
  const handleCourseDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete the course?")) {
      const res = await dispatch(deleteCourse(id));

      // fetching the new updated data for the course
      if (res.payload.success) {
        await dispatch(getAllCourses());
      }
    }
  };

  useEffect(() => {
    (async () => {
      await dispatch(getAllCourses());
      await dispatch(getStatsData());
      await dispatch(getPaymentRecord());
    })();
  }, []);
  return (
    <div className="min-h-[90vh] pt-5 flex flex-col bg-white flex-wrap gap-10 text-black">
      <h1 className="text-3xl font-semibold text-center text-yellow-500">
        Admin Dashboard
      </h1>
  
      {/* Creating the records card and chart for sales and user details */}
      <div className="grid grid-cols-1 gap-5 mx-5 md:grid-cols-2 md:mx-10">
        {/* Displaying the users chart and data */}
        <div className="flex flex-col items-center gap-10 p-5 rounded-md shadow-lg bg-gray-50">
          {/* For displaying the pie chart */}
          <div className="w-full max-w-sm md1:h-80 h-80 lg:h-80 md:h-80 sm:h-48">
            <Pie data={userData} className="" />
          </div>
  
          {/* Card for user data */}
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Card for registered users */}
            <div className="flex items-center justify-between gap-5 px-5 py-5 bg-white rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold sm:text-base">Registered Users</p>
                <h3 className="text-2xl font-bold sm:text-4xl">{allUsersCount}</h3>
              </div>
              <FaUsers className="text-4xl text-yellow-500 sm:text-5xl" />
            </div>
  
            {/* Card for subscribed users */}
            <div className="flex items-center justify-between gap-5 px-5 py-5 bg-white rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold sm:text-base">Subscribed Users</p>
                <h3 className="text-2xl font-bold sm:text-4xl">{subscribedUsersCount}</h3>
              </div>
              <FaUsers className="text-4xl text-green-500 sm:text-5xl" />
            </div>
          </div>
        </div>
  
        {/* Displaying the sales chart and data */}
        <div className="flex flex-col items-center gap-10 p-5 rounded-md shadow-lg bg-gray-50">
          {/* For displaying the bar chart */}
          <div className="relative w-full max-w-lg h-80">
            <Bar className="absolute bottom-0 w-full h-80" data={salesData} />
          </div>
  
          {/* Card for sales data */}
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Card for subscriptions count */}
            <div className="flex items-center justify-between gap-5 px-5 py-5 bg-white rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold sm:text-base">Subscriptions Count</p>
                <h3 className="text-2xl font-bold sm:text-4xl">{allPayments?.count}</h3>
              </div>
              <FcSalesPerformance className="text-4xl sm:text-5xl" />
            </div>
  
            {/* Card for total revenue */}
            <div className="flex items-center justify-between gap-5 px-5 py-5 bg-white rounded-md shadow-md">
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold sm:text-base">Total Revenue</p>
                <h3 className="text-2xl font-bold sm:text-4xl">
                  {allPayments?.count * 499}
                </h3>
              </div>
              <GiMoneyStack className="text-4xl text-green-500 sm:text-5xl" />
            </div>
          </div>
        </div>
      </div>
  
      {/* CRUD courses section */}
    </div>
  );
  

  // return (
   
  //     <div className="min-h-[90vh] pt-5 flex flex-col bg-white flex-wrap gap-10 text-black">
  //       <h1 className="text-3xl font-semibold text-center text-yellow-500">
  //         Admin Dashboard
  //       </h1>

  //       {/* creating the records card and chart for sales and user details */}
  //       <div className="grid grid-cols-2 gap-5 m-auto mx-10">
  //         {/* displaying the users chart and data */}
  //         <div className="flex flex-col items-center gap-10 p-5 rounded-md shadow-lg">
  //           {/* for displaying the pie chart */}
  //           <div className="w-80 h-80">
  //             <Pie data={userData} />
  //           </div>

  //           {/* card for user data */}
  //           <div className="grid grid-cols-2 gap-5">
  //             {/* card for registered users */}
  //             <div className="flex items-center justify-between gap-5 px-5 py-5 rounded-md shadow-md">
  //               <div className="flex flex-col items-center">
  //                 <p className="font-semibold">Registered Users</p>
  //                 <h3 className="text-4xl font-bold">{allUsersCount}</h3>
  //               </div>
  //               <FaUsers className="text-5xl text-yellow-500" />
  //             </div>

  //             {/* card for enrolled users */}
  //             <div className="flex items-center justify-between gap-5 px-5 py-5 rounded-md shadow-md">
  //               <div className="flex flex-col items-center">
  //                 <p className="font-semibold">Subscribed Users</p>
  //                 <h3 className="text-4xl font-bold">{subscribedUsersCount}</h3>
  //               </div>
  //               <FaUsers className="text-5xl text-green-500" />
  //             </div>
  //           </div>
  //         </div>

  //         {/* displaying the sales chart and data */}
  //         <div className="flex flex-col items-center gap-10 p-5 rounded-md shadow-lg">
  //           {/* for displaying the bar chart */}
  //           <div className="relative w-full h-80">
  //             <Bar className="absolute bottom-0 w-full h-80" data={salesData} />
  //           </div>

  //           {/* card for user data */}
  //           <div className="grid grid-cols-2 gap-5">
  //             {/* card for registered users */}
  //             <div className="flex items-center justify-between gap-5 px-5 py-5 rounded-md shadow-md">
  //               <div className="flex flex-col items-center">
  //                 <p className="font-semibold">Subscriptions Count</p>
  //                 <h3 className="text-4xl font-bold">{allPayments?.count}</h3>
  //               </div>
  //               <FcSalesPerformance className="text-5xl text-yellow-500" />
  //             </div>

  //             {/* card for enrolled users */}
  //             <div className="flex items-center justify-between gap-5 px-5 py-5 rounded-md shadow-md">
  //               <div className="flex flex-col items-center">
  //                 <p className="font-semibold">Total Revenue</p>
  //                 <h3 className="text-4xl font-bold">
  //                   {allPayments?.count * 499}
  //                 </h3>
  //               </div>
  //               <GiMoneyStack className="text-5xl text-green-500" />
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* CRUD courses section */}
        
  //     </div>
    
  // );
};

export default AdminDashboard;


{/* <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-3xl font-semibold text-center">
              Courses Overview
            </h1>

            {/* add course card */}
        //     <button
        //       onClick={() => {
        //         navigate("/course/create", {
        //           state: {
        //             initialCourseData: {
        //               newCourse: true,
        //               title: "",
        //               category: "",
        //               createdBy: "",
        //               description: "",
        //               thumbnail: undefined,
        //               previewImage: "",
        //             },
        //           },
        //         });
        //       }}
        //       className="px-4 py-2 text-lg font-semibold transition-all duration-300 ease-in-out bg-yellow-500 rounded cursor-pointer w-fit hover:bg-yellow-600"
        //     >
        //       Create New Course
        //     </button>
        //   </div>

        //   <table className="table overflow-x-scroll">
        //     <thead>
        //       <tr>
        //         <th>S No.</th>
        //         <th>Course Title</th>
        //         <th>Course Category</th>
        //         <th>Instructor</th>
        //         <th>Total Lectures</th>
        //         <th>Course Description</th>
        //         <th>Actions</th>
        //       </tr>
        //     </thead>

        //     <tbody>
        //       {myCourses?.map((element, index) => {
        //         return (
        //           <tr key={element?._id}>
        //             <td>{index + 1}</td>
        //             <td>
        //               <textarea
        //                 readOnly
        //                 className="w-40 h-auto bg-transparent resize-none"
        //                 value={element?.title}
        //               ></textarea>
        //             </td>
        //             <td>{element?.category?.name}</td>
        //             {/* <td>{element?.createdBy}</td> */}
        //             {/* <td>{element?.numberOfLectures}</td> */}
        //             <td className="overflow-hidden max-w-28 text-ellipsis whitespace-nowrap">
        //               <textarea
        //                 readOnly
        //                 className="h-auto bg-transparent resize-none w-80"
        //                 value={element?.description}
        //               ></textarea>
        //             </td>

        //             <td className="flex items-center gap-4">
        //               {/* to edit the course */}
        //               <button
        //                 onClick={() =>
        //                   navigate("/course/create", {
        //                     state: {
        //                       initialCourseData: {
        //                         newCourse: false,
        //                         ...element,
        //                       },
        //                     },
        //                   })
        //                 }
        //                 className="px-4 py-2 text-xl font-bold transition-all duration-300 ease-in-out bg-yellow-500 rounded-md hover:bg-yellow-600"
        //               >
        //                 <MdOutlineModeEdit />
        //               </button>

        //               {/* to delete the course */}
        //               <button
        //                 onClick={() => handleCourseDelete(element._id)}
        //                 className="px-4 py-2 text-xl font-bold transition-all ease-in-out bg-red-500 rounded-md hover:bg-red-600 duration-30"
        //               >
        //                 <BsTrash />
        //               </button>

        //               {/* to CRUD the lectures */}
        //               <button
        //                 onClick={() =>
        //                   navigate("/course/displaylectures", {
        //                     state: { ...element },
        //                   })
        //                 }
        //                 className="px-4 py-2 text-xl font-bold transition-all ease-in-out bg-green-500 rounded-md hover:bg-green-600 duration-30"
        //               >
        //                 <BsCollectionPlayFill />
        //               </button>
        //             </td>
        //           </tr>
        //         );
        //       })}
        //     </tbody>
        //   </table>
        // </div> */}