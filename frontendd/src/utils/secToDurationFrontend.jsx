import React, { useState, useEffect } from 'react';

function CourseDuration({ course }) {
  const [totalDuration, setTotalDuration] = useState(null);

  useEffect(() => {
    async function fetchDuration() {
      let totalDurationInSeconds = 0;

      try {
        // Extract all video URLs
        const videoUrls = course.courseContent.flatMap((content) =>
          content.subSection
            .map((subSection) => subSection?.lecture?.secure_url)
            .filter(Boolean) // Filter out invalid URLs
        );

        // Fetch durations in batches
        const batchSize = 5; // Process 5 videos at a time
        for (let i = 0; i < videoUrls.length; i += batchSize) {
          const batch = videoUrls.slice(i, i + batchSize);
          const durations = await Promise.all(
            batch.map((url) => fetchVideoDuration(url).catch(() => 0)) // Fallback to 0 if there's an error
          );
          totalDurationInSeconds += durations.reduce((sum, duration) => sum + duration, 0);
        }

        // Convert total duration to hh:mm:ss format
        const duration = convertSecondsToDuration(totalDurationInSeconds);
        setTotalDuration(duration);
      } catch (error) {
        console.error('Error calculating total duration:', error);
        setTotalDuration('00:00:00'); // Fallback to 00:00:00
      }
    }

    fetchDuration();
  }, [course]);

  // Function to fetch video duration using the HTML5 Video API
  function fetchVideoDuration(url) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = url;

      // Resolve with duration when metadata is loaded
      video.addEventListener('loadedmetadata', () => {
        resolve(video.duration); // Duration in seconds
        video.remove(); // Clean up the video element
      });

      // Reject if there's an error loading the video
      video.addEventListener('error', (err) => {
        reject(err);
        video.remove(); // Clean up the video element
      });
    });
  }

  // Convert seconds to hh:mm:ss format
  function convertSecondsToDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Render
  return (
    <div>
      {totalDuration ? (
        <p>{totalDuration}</p>
      ) : (
        <p>Calculating duration...</p>
      )}
    </div>
  );
}

export default CourseDuration;