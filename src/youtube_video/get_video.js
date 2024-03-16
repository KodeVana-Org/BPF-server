const axios = require("axios");
require("dotenv").config();
exports.getYoutubeVideo = async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId: process.env.CHANNEL_ID,
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 50, // Fetch the latest 50 videos
          order: "date", // Sort by date (latest first)
        },
      },
    );
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error("No videos found.");
    }

    // Extract video IDs from the search response
    const videoIds = response.data.items.map((item) => item.id.videoId);

    // Fetch video details (including duration) for each video
    const videosWithDetails = await Promise.all(
      videoIds.map(async (videoId) => {
        const videoDetailsResponse = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              part: "snippet,contentDetails",
              id: videoId,
              key: process.env.YOUTUBE_API_KEY,
            },
          },
        );

        const videoDetails = videoDetailsResponse.data.items[0];
        if (
          !videoDetails ||
          !videoDetails.snippet ||
          !videoDetails.snippet.title
        ) {
          console.error("Video details not found:", videoId);
          return null;
        }
        // WARN: THIS IS WARNINGJ
        const duration = parseISO8601Duration(
          videoDetails.contentDetails.duration,
        );
        const thumbnails = videoDetails.snippet.thumbnails;
        const thumbnailUrl = thumbnails ? thumbnails.medium.url : "";

        // NOTE: this is noe
        return {
          title: videoDetails.snippet.title,
          videoId: videoId,
          publishedAt: videoDetails.snippet.publishedAt,
          duration: duration,
          thumbnailUrl: thumbnailUrl,
        };
      }),
    );

    // Filter out null values (videos with missing or invalid details)
    const validVideos = videosWithDetails.filter((video) => video !== null);

    res.json(validVideos);
  } catch (error) {
    // console.error("Error fetching latest videos:", error.message);
    res.status(500).json({ error: "Error fetching latest videos" });
  }
};

function parseISO8601Duration(duration) {
  if (duration === "P0D") {
    // console.log("The latest video is uploading:");
    return "upcoming"; // Label videos with duration 0 as "upcoming"
  }

  const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (!matches) {
    // console.error("Invalid duration format:", duration);
    return -1; // Return -1 for invalid duration format
  }

  const hours = matches[1] ? parseInt(matches[1]) : 0;
  const minutes = matches[2] ? parseInt(matches[2]) : 0;
  const seconds = matches[3] ? parseInt(matches[3]) : 0;

  // If the duration is 0, return "upcoming"
  if (hours === 0 && minutes === 0 && seconds === 0) {
    return "upcoming";
  }

  return hours * 60 * 60 + minutes * 60 + seconds;
}
