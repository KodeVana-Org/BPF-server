const axios = require("axios");
require("dotenv").config();
const sendPushNotification = require("../youtube_video/sendPushNotification.js");

exports.getLiveYoube = async (req, res) => {
  try {
    const liveResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId: process.env.CHANNEL_ID,
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 1, // Fetch only 1 video to check if there's any live video
          eventType: "live", // Check if any live videos are available
        },
      },
    );

    // If there are any live videos, fetch the live video
    if (liveResponse.data.items.length > 0) {
      console.log("Channel is live! Fetching live video...");

      const videoId = liveResponse.data.items[0].id.videoId;
      // Now fetch the details of the live video using the videoId
      const videoDetailsResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet",
            id: videoId,
            key: process.env.YOUTUBE_API_KEY,
          },
        },
      );

      const liveVideo = videoDetailsResponse.data.items[0];
      const thumbnailUrl = liveVideo.snippet.thumbnails.default.url;
      const channelName = liveVideo.snippet.channelTitle;
      const videoTitle = liveVideo.snippet.title;

      // await sendPushNotification(
      //   "YouTube video is live",
      //   thumbnailUrl,
      //   channelName,
      //   videoTitle,
      // );
      // sendPushNotification("Youtube video is live");
      return res.status(201).json({
        data: {
          success: true,
          message: " Youtube Live Video Fetched",
          video: liveVideo,
        },
      });
    } else {
      console.log("Channel is not live");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching live videos",
      error: error.message,
    });
  }
};
