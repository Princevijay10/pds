import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },

    role: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    company: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    avatar: {
      type: String,
      default: "",
    },

    // User reviews are pending by default.
    // Admin can approve them later.
    published: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Testimonial", testimonialSchema);