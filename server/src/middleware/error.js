export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
export function notFound(req, res) {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
export function errorHandler(error, _req, res, _next) {
  if (error?.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ message: "Image must be 5 MB or smaller" });
  if (error?.code === 11000)
    return res
      .status(409)
      .json({ message: "An account with this phone number already exists" });
  if (error.name === "ValidationError")
    return res.status(400).json({ message: error.message });
  console.error(error);
  return res.status(500).json({ message: "Something went wrong" });
}
