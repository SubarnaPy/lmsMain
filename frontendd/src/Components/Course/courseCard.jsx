import { FaShoppingCart, FaStar, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GetAvgRating from "../../utils/AvgRating";

const CourseCard = ({ data }) => {
  const navigate = useNavigate();
  console.log(data)

  const handle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/courses/${data._id}`);
  };

  return (
    <div
      onClick={() => navigate(`/courses/${data._id}`, { state: { ...data } })}
      className="overflow-hidden hover:scale-[1.05] transition-all ease-in-out duration-300 w-[18rem] text-slate-950 rounded-xl shadow-2xl cursor-pointer group bg-gradient-to-br from-white to-purple-50 hover:shadow-3xl"
    >
      {/* Course Thumbnail */}
      <div className="overflow-hidden rounded-xl">
        <img
          className="h-48 w-full rounded-xl p-4 rounded-t-xl group-hover:scale-[1.1] transition-all ease-in-out duration-300"
          src={data?.thumbnail?.secure_url}
          alt="course thumbnail"
        />
      </div>

      {/* Course Details */}
      <div className="p-5 space-y-3">
        {/* Title and Rating */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-purple-800 line-clamp-2">
            {data?.title}
          </h2>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">
              {GetAvgRating(data?.ratingAndReviews)} ({data?.ratingAndReviews?.length})
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {data?.description}
        </p>

        {/* Category and Total Students */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Category:</span> {data?.category?.name}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <FaUsers className="text-purple-600" />
            <span>{data?.studentEnrolled?.length} Students</span>
          </div>
        </div>

        {/* Price and Add to Cart Button */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-purple-600">
            ${data.price}
          </span>
          <button
            onClick={handle}
            className="flex items-center px-4 py-2 text-sm font-semibold text-white transition-all duration-300 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;