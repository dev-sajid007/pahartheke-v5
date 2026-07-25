import Settings from "./settings.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import apiResponse from "../../utils/apiResponse.js";

export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return apiResponse({
    res,
    data: settings,
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  
  const updateData = { ...req.body };
  if (req.file) {
    updateData.logo = req.file.path;
  }

  if (!settings) {
    settings = await Settings.create(updateData);
  } else {
    settings = await Settings.findByIdAndUpdate(settings._id, updateData, { new: true });
  }
  return apiResponse({
    res,
    message: "Settings updated successfully",
    data: settings,
  });
});
