import Project from "../models/projectModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const createProject = catchAsync(async (req, res, next) => {
  const { name, workspaceId } = req.body;

  // Check if the name is provided
  if (!name) {
    return next(new AppError("Project name is required.", 400));
  }

  // Create a new Project
  const newProject = await Project.create({
    name,
    workspaceId, // The user ID is retrieved from the `protect` middleware
    imageUrl: req.file?.path || undefined,
  });

  if (!newProject) {
    return next(new AppError("Project creation failed.", 400));
  }

  res.status(201).json({
    status: "success",
    data: {
      data: newProject,
    },
  });
});
