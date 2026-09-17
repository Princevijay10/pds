import mongoose from "mongoose";
import slugify from "slugify";

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Website Design",
        "Website Development",
        "Graphic Design",
        "Social Media Design",
        "Logo & Brand Identity",
        "Other",
      ],
    },
    client: { type: String, trim: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    images: [{ type: String }],
    liveUrl: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

portfolioSchema.pre("validate", function (next) {
  if (this.isNew && this.title) {
    this.slug = slugify(`${this.title}-${Date.now()}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

export default mongoose.model("Portfolio", portfolioSchema);
