import User from "./auth.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import ApiError from "../../core/ApiError.js";

import apiResponse from "../../utils/apiResponse.js";

import { generateToken } from "./auth.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });

  if (exists) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return apiResponse({
    res,
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  return apiResponse({
    res,
    message: "Login successful",
    data: {
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  return apiResponse({
    res,
    message: "Profile fetched successfully",
    data: req.user,
  });
});