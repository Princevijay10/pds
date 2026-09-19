export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "MulterError") {
    const message = err.code === "LIMIT_FILE_SIZE"
      ? "Each image must be 5MB or smaller."
      : err.code === "LIMIT_FILE_COUNT"
        ? "You can upload up to 10 images at a time."
        : err.message || "Image upload failed.";

    return res.status(400).json({
      success: false,
      message,
    });
  }

  let statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;
  let message = err.message || "Server Error";

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value for field: ${Object.keys(err.keyValue).join(", ")}`;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
