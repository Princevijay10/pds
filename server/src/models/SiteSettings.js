import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "global" },
    showHomepageStats: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
