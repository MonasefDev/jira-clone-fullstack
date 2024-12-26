import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import Member from "../models/memberModel.js";
import Workspace from "../models/workspaceModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { generateInviteCode } from "../utils/helpers.js";
import Task from "../models/taskModel.js";

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

export const getWorkspace = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.params;

  const member = await Member.findOne({
    workspaceId: workspaceId,
    userId: req.user.id,
  });

  if (!member || member.role !== "ADMIN") {
    return next(
      new AppError("You are not authorized to update this workspace.", 404),
    );
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    return next(new AppError("Workspace not found.", 404));
  }

  res.status(200).json({
    status: "success",
    workspace,
  });
});

export const joinWorkspace = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.params;
  const { inviteCode } = req.body;

  const workspace = await Workspace.findOne({
    _id: workspaceId,
    inviteCode,
  });

  if (!workspace) {
    return next(new AppError("Invalid invite code.", 400));
  }

  const member = await Member.findOne({
    userId: req.user.id,
    workspaceId,
  });

  if (member) {
    return next(
      new AppError("You are already a member of this workspace.", 400),
    );
  }

  const newMember = await Member.create({
    userId: req.user.id,
    workspaceId,
    role: "USER",
  });

  if (!newMember) {
    return next(new AppError("Member join failed.", 400));
  }

  res.status(200).json({
    status: "success",
    workspace,
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

export const getWorkspaceAnalytics = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.params;

  const member = await Member.findOne({
    workspaceId: workspaceId,
    userId: req.user.id,
  });

  if (!member) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTasks = await Task.find({
    workspaceId: workspaceId,
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthTasks = await Task.find({
    workspaceId: workspaceId,
    createdAt: {
      $gte: lastMonthStart.toISOString(),
      $lte: lastMonthEnd.toISOString(),
    },
  });

  const taskCount = thisMonthTasks.length;
  const taskDifference = taskCount - lastMonthTasks.length;

  const thisMonthAssignedTasks = await Task.find({
    workspaceId: workspaceId,
    assigneeId: member._id,
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthAssignedTasks = await Task.find({
    workspaceId: workspaceId,
    assigneeId: member._id,
    createdAt: {
      $gte: lastMonthStart.toISOString(),
      $lte: lastMonthEnd.toISOString(),
    },
  });

  const assignedTaskCount = thisMonthAssignedTasks.length;
  const assignedTaskDifference =
    assignedTaskCount - lastMonthAssignedTasks.length;

  const thisMonthIncompleteTasks = await Task.find({
    workspaceId: workspaceId,
    status: { $ne: "DONE" }, // Exclude tasks with status "DONE"
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthIncompleteTasks = await Task.find({
    workspaceId: workspaceId,
    status: { $ne: "DONE" }, // Exclude tasks with status "DONE"
    createdAt: {
      $gte: lastMonthStart.toISOString(),
      $lte: lastMonthEnd.toISOString(),
    },
  });

  const incompleteTaskCount = thisMonthIncompleteTasks.length;
  const incompleteTaskDifference =
    incompleteTaskCount - lastMonthIncompleteTasks.length;

  const thisMonthCompletedTasks = await Task.find({
    workspaceId: workspaceId,
    status: "DONE",
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthCompletedTasks = await Task.find({
    workspaceId: workspaceId,
    status: "DONE",
    createdAt: {
      $gte: lastMonthStart.toISOString(),
      $lte: lastMonthEnd.toISOString(),
    },
  });

  const completedTaskCount = thisMonthCompletedTasks.length;
  const completedTaskDifference =
    completedTaskCount - lastMonthCompletedTasks.length;

  const thisMonthOverdueTasks = await Task.find({
    workspaceId: workspaceId,
    status: { $ne: "DONE" }, // Exclude tasks with status "DONE"
    dueDate: { $lt: now.toISOString() }, // Tasks with dueDate earlier than the current time
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthOverdueTasks = await Task.find({
    workspaceId: workspaceId,
    status: { $ne: "DONE" }, // Exclude tasks with status "DONE"
    dueDate: { $lt: now.toISOString() }, // Tasks with dueDate earlier than the current time
    createdAt: {
      $gte: lastMonthStart.toISOString(),
      $lte: lastMonthEnd.toISOString(),
    },
  });

  const overdueTaskCount = thisMonthOverdueTasks.length;
  const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.length;

  res.status(200).json({
    status: "success",
    data: {
      taskCount: taskCount,
      taskDifference: taskDifference,
      assignedTasksCount: assignedTaskCount,
      assignedTasksDifference: assignedTaskDifference,
      completedTaskCount: completedTaskCount,
      completedTaskDifference: completedTaskDifference,
      incompleteTaskCount: incompleteTaskCount,
      incompleteTaskDifference: incompleteTaskDifference,
      overdueTaskCount: overdueTaskCount,
      overdueTaskDifference: overdueTaskDifference,
    },
  });
});
