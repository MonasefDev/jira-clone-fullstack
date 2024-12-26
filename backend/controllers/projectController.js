import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import Member from "../models/memberModel.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
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
    projects,
  });
});

export const getProjectById = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById({
    _id: projectId,
  });

  if (!project) {
    return next(new AppError("Project not found.", 404));
  }

  const currentMember = await Member.findOne({
    workspaceId: project.workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  res.status(200).json({
    status: "success",
    project,
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
    project: newProject,
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

export const getProjectAnalytics = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const projectSelected = await Project.findById({
    _id: projectId,
  });

  if (!projectSelected) {
    return next(new AppError("Project not found or not authorized.", 404));
  }

  const { workspaceId } = projectSelected;

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
    projectId: projectId,
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthTasks = await Task.find({
    projectId: projectId,
    createdAt: {
      $gte: lastMonthStart.toISOString(),
      $lte: lastMonthEnd.toISOString(),
    },
  });

  const taskCount = thisMonthTasks.length;
  const taskDifference = taskCount - lastMonthTasks.length;

  const thisMonthAssignedTasks = await Task.find({
    projectId: projectId,
    assigneeId: member._id,
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthAssignedTasks = await Task.find({
    projectId: projectId,
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
    projectId: projectId,
    status: { $ne: "DONE" }, // Exclude tasks with status "DONE"
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthIncompleteTasks = await Task.find({
    projectId: projectId,
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
    projectId: projectId,
    status: "DONE",
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthCompletedTasks = await Task.find({
    projectId: projectId,
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
    projectId: projectId,
    status: { $ne: "DONE" }, // Exclude tasks with status "DONE"
    dueDate: { $lt: now.toISOString() }, // Tasks with dueDate earlier than the current time
    createdAt: {
      $gte: thisMonthStart.toISOString(),
      $lte: thisMonthEnd.toISOString(),
    },
  });

  const lastMonthOverdueTasks = await Task.find({
    projectId: projectId,
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
