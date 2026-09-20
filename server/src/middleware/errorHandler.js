export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";

  let message = isProduction ? "Something went wrong. Please try again later." : err.message || "Server Error";

  if (err.name === "ValidationError") {
    message = "Please check the submitted data.";
  }

  if (err.code === 11000) {
    message = "A record with this value already exists.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
