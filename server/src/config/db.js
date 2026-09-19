import mongoose from "mongoose";

export const connectDB = async () => {
  const uriBase = process.env.MONGO_URI;
  let uri = uriBase;

  if (process.env.MONGO_USER && process.env.MONGO_PASS && uriBase) {
    const prefix = "mongodb+srv://";

    if (uriBase.startsWith(prefix)) {
      uri = `${prefix}${process.env.MONGO_USER}:${encodeURIComponent(
        process.env.MONGO_PASS
      )}@${uriBase.slice(prefix.length)}`;
    } else {
      uri = `${process.env.MONGO_USER}:${encodeURIComponent(
        process.env.MONGO_PASS
      )}@${uriBase}`;
    }
  }

  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    });

    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};
