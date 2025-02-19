import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";
import { FaStar } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { useDispatch } from "react-redux";
import { getallReating } from "../../Redux/courseSlice";
import { motion } from "framer-motion";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const truncateWords = 15;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await dispatch(getallReating());
        if (res?.payload) {
          setReviews(res.payload);
        } else {
          console.error("Failed to fetch reviews:", res?.message);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [dispatch]);

  return (
    <div className="z-[100] text-white">
      <div className="relative overflow-hidden py-12 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="absolute inset-0 transform -skew-y-3 origin-top-left" />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 font-poppins">
            What Our <span className="text-yellow-400">Students Say</span>
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-[16rem]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-purple-600 to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-indigo-600 to-transparent z-10" />
              <Swiper
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 25 },
                  1024: { slidesPerView: 4, spaceBetween: 25 },
                }}
                spaceBetween={25}
                loop={true}
                freeMode={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                modules={[FreeMode, Pagination, Autoplay]}
                className="w-full h-[16rem]"
              >
                {reviews.map((review, i) => (
                  <SwiperSlide key={i}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col w-[18rem] h-[14rem] gap-4 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/10 hover:border-purple-300 transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={review?.user?.avatar?.secure_url}
                          alt={review?.user?.fullName}
                          className="object-cover rounded-full h-10 w-10 border-2 border-purple-300"
                        />
                        <div className="flex flex-col">
                          <h1 className="text-lg font-semibold text-white">
                            {review?.user?.fullName}
                          </h1>
                          <h2 className="text-sm font-medium text-purple-200">
                            {review?.course?.courseName}
                          </h2>
                        </div>
                      </div>
                      <p className="flex-1 overflow-hidden text-sm font-medium text-purple-50">
                        {review?.review.split(" ").length > truncateWords
                          ? `${review?.review
                              .split(" ")
                              .slice(0, truncateWords)
                              .join(" ")} ...`
                          : `${review?.review}`}
                      </p>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-yellow-400">
                          {review.rating.toFixed(1)}
                        </h3>
                        <ReactStars
                          count={5}
                          value={review.rating}
                          size={20}
                          edit={false}
                          activeColor="#ffd700"
                          emptyIcon={<FaStar />}
                          fullIcon={<FaStar />}
                        />
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          <div className="flex justify-center mt-8">
            <button className="px-6 py-2 bg-yellow-400 text-purple-900 font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300">
              Leave a Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewSlider;