const express = require("express");
const router = express.Router();
const videoRouter = require("../youtube_video/get_video.js");
const liveVideo = require("../youtube_video/get_live_video.js");
const GalleryRouter = require("../controllers/gallery.js");
const upload = require("../utils/multer.js");

//router to fetch
router.get("/videos", videoRouter.getYoutubeVideo);
router.get("/live-vidoes", liveVideo.getLiveYoube);

router.get("/get-gallery", GalleryRouter.GetAllGallery);
router.post(
  "/upload-gallery",
  upload.array("images", 5),
  GalleryRouter.UploadImagesToGallery,
);
router.delete("/delete-gallery/:imageId", GalleryRouter.DeleteImageFromGallery);
router.get("/single-photo/:photoId", GalleryRouter.GetSinglePhoto);
router.get(
  "/gallery/:galleryId/view-gallery/:photoIndex",
  GalleryRouter.GetSinglePhotoWithIndex,
);
module.exports = router;
