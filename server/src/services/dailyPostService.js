import { uploadBufferToCloudinary } from "../config/cloudinary.js";
import { buildPosterSvg, getDailyOccasion, getIndiaDate } from "./dailyPostTemplate.js";

const toWhatsAppJpegUrl = (secureUrl) => {
  if (!secureUrl) throw new Error("Cloudinary did not return an image URL");
  return secureUrl.replace("/image/upload/", "/image/upload/f_jpg,q_auto/");
};

const generateAndUploadDailyPost = async () => {
  const dateInfo = getIndiaDate();
  const occasion = await getDailyOccasion(dateInfo);
  const svg = buildPosterSvg({ date: dateInfo.iso, occasion });
  const uploaded = await uploadBufferToCloudinary(
    Buffer.from(svg, "utf8"),
    `pandit-ramjilal-daily-${dateInfo.iso}.svg`
  );

  return {
    date: dateInfo.iso,
    weekday: dateInfo.weekday,
    occasion,
    sourceUrl: uploaded.secure_url,
    imageUrl: toWhatsAppJpegUrl(uploaded.secure_url),
  };
};

export { generateAndUploadDailyPost };
