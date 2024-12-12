import Member from "../models/memberModel.js";
import Project from "../models/projectModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllProjectsOfWorkspace = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.query;

  const currentMember = await Member.findOne({
    workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  const projects = await Project.find({ workspaceId });

  if (!projects) {
    return next(new AppError("Projects not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      projects: projects,
    },
  });
});

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

export const updateProject = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { name, imageUrl } = req.body;

  const existingProject = await Project.findById({
    _id: projectId,
  });

  if (!existingProject) {
    return next(new AppError("Project not found or not authorized.", 404));
  }
  const member = await Member.findOne({
    workspaceId: existingProject.workspaceId,
    userId: req.user.id,
  });

  if (!member || member.role !== "ADMIN") {
    return next(
      new AppError("You are not authorized to update this project.", 404),
    );
  }

  const elementToUpdate = imageUrl
    ? { name, imageUrl }
    : req.file
      ? { name, imageUrl: req.file.path }
      : { name };

  const updatedProject = await Project.findOneAndUpdate(
    { _id: projectId },
    elementToUpdate,
    { new: true },
  );

  if (!updatedProject) {
    return next(new AppError("Project not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: updatedProject,
    },
  });
});

export const deleteProject = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const existingProject = await Project.findById({
    _id: projectId,
  });

  if (!existingProject) {
    return next(new AppError("Project not found or not authorized.", 404));
  }

  const member = await Member.findOne({
    workspaceId: existingProject.workspaceId,
    userId: req.user.id,
  });

  if (!member || member.role !== "ADMIN") {
    return next(
      new AppError("You are not authorized to delete this project.", 404),
    );
  }

  const deletedProject = await Project.findOneAndDelete({
    _id: projectId,
  });

  if (!deletedProject) {
    return next(new AppError("Failed to delete project.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: deletedProject,
    },
  });
});
