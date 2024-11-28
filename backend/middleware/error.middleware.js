/**
 * Error handling middleware.
 */
function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ status, message });
}

export { errorMiddleware };