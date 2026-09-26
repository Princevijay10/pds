import mongoose from "mongoose";

const dailyPostDeliverySchema = new mongoose.Schema(
  {
    date: { type: String, unique: true, required: true },
    occasion: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    whatsappMessageIds: { type: [String], default: [] },
    status: { type: String, enum: ["generated", "sent", "failed"], default: "generated" },
    error: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("DailyPostDelivery", dailyPostDeliverySchema);
