import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },

    service: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    budget: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "converted",
        "closed",
      ],
      default: "new",
    },

    // Admin-only notes.
    // These are never submitted by the public contact form.
    internalNotes: {
      type: String,
      trim: true,
      maxlength: 8080,
      default: "",
    },

    // Next planned follow-up date.
    followUpDate: {
      type: Date,
      default: null,
    },

    // Date/time when the client was last contacted.
    lastContacted: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Contact", contactSchema);