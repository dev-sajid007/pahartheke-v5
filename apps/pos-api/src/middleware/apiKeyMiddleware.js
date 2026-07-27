import ApiError from "../core/ApiError.js";

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!process.env.ECOMMERCE_API_KEY) {
    throw new ApiError(500, "Server misconfiguration: API key not configured");
  }

  if (!apiKey || apiKey !== process.env.ECOMMERCE_API_KEY) {
    throw new ApiError(401, "Invalid or missing API key");
  }

  next();
};

export default apiKeyMiddleware;
