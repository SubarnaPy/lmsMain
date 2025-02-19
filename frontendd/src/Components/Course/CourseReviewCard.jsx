import React from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import { RiChatQuoteFill } from 'react-icons/ri';

const CourseReviewCard = ({ reviews }) => {
  // Sort reviews by creation date (assuming `createdAt` is in ISO format or a timestamp)
  const sortedReviews = reviews
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5); // Get the most recent 5 reviews

  return (
    <div className="p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
      <h2 className="mb-6 text-2xl font-bold text-purple-800 flex items-center gap-2">
        <RiChatQuoteFill className="text-3xl text-purple-600" />
        Latest Reviews
      </h2>
      <div className="space-y-6">
        {sortedReviews.map((review, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {review.user.avatar?.secure_url ? (
                  <img
                    src={review.user.avatar.secure_url}
                    alt={review.user.fullName}
                    className="w-12 h-12 mr-3 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 mr-3 text-purple-500" />
                )}
                <div>
                  <span className="font-semibold text-purple-800">
                    {review.user.fullName}
                  </span>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-xl ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </span>
                <span className="text-gray-500">({review.rating}/5)</span>
              </div>
            </div>
            <p className="text-gray-700 italic pl-2 border-l-4 border-purple-500">
              "{review.review}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseReviewCard;