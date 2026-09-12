import mongoose from "mongoose";

export const connectDB = async () => {
  const uriBase = process.env.MONGO_URI;
  let uri = uriBase;
  // If MONGO_USER and MONGO_PASS are provided, safely insert them and
  // URL-encode the password so special characters like `#` won't break the URI.
  if (process.env.MONGO_USER && process.env.MONGO_PASS && uriBase) {
    const prefix = "mongodb+srv://";
    if (uriBase.startsWith(prefix)) {
      uri = `${prefix}${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASS)}@${uriBase.slice(
        prefix.length
      )}`;
    } else {
      uri = `${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASS)}@${uriBase}`;
    }
  }
  if (!uri) {
    console.error("MONGO_URI is not set in .env");
    process.exit(1);
  }
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
