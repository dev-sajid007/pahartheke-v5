import Settings from "./settings.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import apiResponse from "../../utils/apiResponse.js";

const allowedFields = [
  "storeName", "contactPhone", "storeAddress",
  "invoicePrefix", "taxRate", "invoiceFooterMessage",
  "receiptFooter", "currency", "logo",
];

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
  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  if (req.file) {
    updateData.logo = req.file.path;
  }

  const settings = await Settings.findOneAndUpdate(
    {},
    updateData,
    { new: true, upsert: true, runValidators: true }
  );

  return apiResponse({
    res,
    message: "Settings updated successfully",
    data: settings,
  });
});
