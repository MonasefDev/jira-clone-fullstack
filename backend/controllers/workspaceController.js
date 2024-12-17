import Member from "../models/memberModel.js";
import Workspace from "../models/workspaceModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { generateInviteCode } from "../utils/helpers.js";

export const getAllWorkspaces = catchAsync(async (req, res, next) => {
  const members = await Member.find({ userId: req.user.id });
  if (!members) {
    return next(new AppError("Members not found.", 404));
  }

  const workspaceIds = members.map((member) => member.workspaceId);
  if (!workspaceIds) {
    return next(new AppError("You are not a member of any workspace.", 404));
  }

  const workspaces = await Workspace.find({ _id: { $in: workspaceIds } });

  if (!workspaces) {
    return next(new AppError("Workspaces not found.", 404));
  }

  res.status(200).json({
    status: "success",
    workspaces,
  });
});

export const createWorkspace = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  // Check if the name is provided
  if (!name) {
    return next(new AppError("Workspace name is required.", 400));
  }

  // Create a new workspace
  const newWorkspace = await Workspace.create({
    name,
    userId: req.user.id, // The user ID is retrieved from the `protect` middleware
    imageUrl: req.file?.path || undefined,
  });

  if (!newWorkspace) {
    return next(new AppError("Workspace creation failed.", 400));
  }

  // Create the member record for the user who created the workspace
  const newMember = await Member.create({
    userId: req.user.id,
    workspaceId: newWorkspace._id,
    role: "ADMIN", // Creator is an ADMIN
  });

  if (!newMember) {
    return next(new AppError("Member creation failed.", 400));
  }

  res.status(200).json({
    status: "success",
    workspace: newWorkspace,
  });
});

export const updateWorkspace = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.params;
  const { name, imageUrl } = req.body;

  const existingWorkspace = await Workspace.findOne({
    _id: workspaceId,
    userId: req.user.id,
  });

  if (!existingWorkspace) {
    return next(new AppError("Workspace not found or not authorized.", 404));
  }

  const member = await Member.findOne({
    workspaceId: workspaceId,
    userId: req.user.id,
  });

  if (!member || member.role !== "ADMIN") {
    return next(
      new AppError("You are not authorized to update this workspace.", 404),
    );
  }

  const elementToUpdate = imageUrl
    ? { name, imageUrl }
    : req.file
      ? { name, imageUrl: req.file.path }
      : { name };

  const updatedWorkspace = await Workspace.findOneAndUpdate(
    { _id: workspaceId, userId: req.user.id },
    elementToUpdate,
    { new: true },
  );

  if (!updatedWorkspace) {
    return next(new AppError("Failed to update workspace.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      workspace: updatedWorkspace,
    },
  });
});

export const deleteWorkspace = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.params;

  const existingWorkspace = await Workspace.findOne({
    _id: workspaceId,
    userId: req.user.id,
  });

  if (!existingWorkspace) {
    return next(new AppError("Workspace not found or not authorized.", 404));
  }

  const member = await Member.findOne({
    workspaceId: workspaceId,
    userId: req.user.id,
  });

  if (!member || member.role !== "ADMIN") {
    return next(
      new AppError("You are not authorized to delete this workspace.", 404),
    );
  }

  const deletedWorkspace = await Workspace.findOneAndDelete({
    _id: workspaceId,
    userId: req.user.id,
  });

  if (!deletedWorkspace) {
    return next(new AppError("Failed to delete workspace.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      workspace: deletedWorkspace,
    },
  });
});

export const resetInviteCodeWorkspace = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.params;

  const existingWorkspace = await Workspace.findOne({
    _id: workspaceId,
    userId: req.user.id,
  });

  if (!existingWorkspace) {
    return next(new AppError("Workspace not found or not authorized.", 404));
  }

  const member = await Member.findOne({
    workspaceId: workspaceId,
    userId: req.user.id,
  });

  if (!member || member.role !== "ADMIN") {
    return next(
      new AppError("You are not authorized to reset invite code.", 404),
    );
  }

  const updatedWorkspace = await Workspace.findOneAndUpdate(
    { _id: workspaceId, userId: req.user.id },
    { inviteCode: generateInviteCode(10) },
    { new: true },
  );

  if (!updatedWorkspace) {
    return next(new AppError("Failed to reset invite code.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      workspace: updatedWorkspace,
    },
  });
});
