const errorHandler = (err, req, res, next) => {

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid ID format";
  }

  // Mongoose schema validation error
  if (err.name === "ValidationError") {
      statusCode = 400;
      message = err.message;
  }
 
  res.status(err.statusCode || 500).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

 
module.exports = { errorHandler };