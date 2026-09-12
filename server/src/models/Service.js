import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    icon: { type: String, default: "Sparkles" },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    features: [{ type: String }],
    startingPrice: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
