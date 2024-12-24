import Member from "../models/memberModel.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import { User } from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllTasks = catchAsync(async (req, res, next) => {
  const { workspaceId, projectId, assigneeId, status, search, dueDate } =
    req.query;

  // Check if the current user is a member of the workspace
  const currentMember = await Member.findOne({
    workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  // Build the query
  const query = { workspaceId };

  if (projectId) {
    query.projectId = projectId;
  }

  if (assigneeId) {
    query.assigneeId = assigneeId;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (dueDate) {
    query.dueDate = dueDate;
  }

  // Fetch tasks based on the query
  const tasks = await Task.find(query);

  // if (!tasks.length) {
  //   return next(new AppError("No tasks found.", 404));
  // }

  // Extract project and assignee IDs from tasks
  const projectIds = tasks.map((task) => task.projectId);
  const assigneeIds = tasks.map((task) => task.assigneeId);

  // Fetch related projects and members
  const projectsOrigin = await Project.find({
    _id: { $in: projectIds.length > 0 ? projectIds : [] },
  });

  const projects = projectsOrigin.map((project) => ({
    id: project._id,
    name: project.name,
    workspaceId: project.workspaceId,
    imageUrl: project.imageUrl,
  }));
  const membersOrigin = await Member.find({
    _id: { $in: assigneeIds.length > 0 ? assigneeIds : [] },
  });

  const members = membersOrigin.map((member) => ({
    id: member._id,
    role: member.role,
    workspaceId: member.workspaceId,
    userId: member.userId,
  }));

  // Populate assignee details with user data
  const assignees = await Promise.all(
    members.map(async (member) => {
      const user = await User.findById(member.userId); // Fetch user details
      return {
        ...member,
        name: user.name,
        email: user.email,
      };
    }),
  );

  // Populate project details
  const populatedTasks = tasks.map((task) => {
    const project = projects.filter(
      (el) => el.id.toString() === task.projectId.toString(),
    );
    const assignee = assignees.filter(
      (el) => el.id.toString() === task.assigneeId.toString(),
    );

    return {
      id: task._id,
      name: task.name,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      position: task.position,
      projectId: task.projectId,
      assigneeId: task.assigneeId,
      project: project.length > 0 ? project[0] : null,
      assignee: assignee.length > 0 ? assignee[0] : null,
    };
  });

  // Return the populated tasks
  res.status(200).json({
    status: "success",
    tasks: populatedTasks,
  });
});

export const getTask = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;

  const taskOrigin = await Task.findById(taskId);

  if (!taskOrigin) {
    return next(new AppError("Task not found.", 404));
  }

  const task = {
    id: taskOrigin._id,
    name: taskOrigin.name,
    description: taskOrigin.description,
    dueDate: taskOrigin.dueDate,
    status: taskOrigin.status,
    workspaceId: taskOrigin.workspaceId,
    position: taskOrigin.position,
    projectId: taskOrigin.projectId,
    assigneeId: taskOrigin.assigneeId,
  };

  const currentMember = await Member.findOne({
    workspaceId: task.workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  const project = await Project.findById(task.projectId);

  if (!project) {
    return next(new AppError("Project not found.", 404));
  }

  const memberOfTask = await Member.findById(task.assigneeId);

  if (!memberOfTask) {
    return next(new AppError("Assignee not found.", 404));
  }

  const userOfAssignee = await User.findById(memberOfTask.userId);

  if (!userOfAssignee) {
    return next(new AppError("User not found.", 404));
  }

  const assignee = {
    id: memberOfTask._id,
    role: memberOfTask.role,
    workspaceId: memberOfTask.workspaceId,
    userId: memberOfTask.userId,
    name: userOfAssignee.name,
    email: userOfAssignee.email,
  };

  res.status(200).json({
    status: "success",
    task: {
      ...task,
      project: {
        id: project._id,
        name: project.name,
        workspaceId: project.workspaceId,
        imageUrl: project.imageUrl,
      },
      assignee,
    },
  });
});

export const createTask = catchAsync(async (req, res, next) => {
  const {
    workspaceId,
    name,
    description,
    dueDate,
    status,
    projectId,
    assigneeId,
  } = req.body;

  const currentMember = await Member.findOne({
    workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  const highestPositionTask = await Task.find({
    workspaceId,
    projectId,
    status,
  })
    .sort({ position: -1 }) // Sort by position in descending order
    .limit(1); // Limit to the highest position

  console.log(highestPositionTask);

  const newPosition =
    highestPositionTask.length > 0
      ? highestPositionTask[0].position + 1000
      : 1000;

  const newTask = await Task.create({
    workspaceId,
    name,
    description,
    dueDate,
    status,
    projectId,
    assigneeId,
    position: newPosition,
  });

  res.status(201).json({
    status: "success",
    data: {
      data: newTask,
    },
  });
});

export const deleteTask = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;

  const existingTask = await Task.findById({
    _id: taskId,
  });

  if (!existingTask) {
    return next(new AppError("Task not found or not authorized.", 404));
  }

  const member = await Member.findOne({
    workspaceId: existingTask.workspaceId,
    userId: req.user.id,
  });

  if (!member) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  const deletedTask = await Task.findOneAndDelete({
    _id: taskId,
  });

  if (!deletedTask) {
    return next(new AppError("Failed to delete task.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: deletedTask,
    },
  });
});

export const updateTask = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;
  const { name, description, dueDate, status, projectId, assigneeId } =
    req.body;

  const existingTask = await Task.findById({
    _id: taskId,
  });

  if (!existingTask) {
    return next(new AppError("Task not found or not authorized.", 404));
  }

  const member = await Member.findOne({
    workspaceId: existingTask.workspaceId,
    userId: req.user.id,
  });

  if (!member) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId },
    { name, description, dueDate, status, projectId, assigneeId },
    { new: true },
  );

  if (!updatedTask) {
    return next(new AppError("Failed to update task.", 404));
  }

  res.status(200).json({
    status: "success",
    task: updatedTask,
  });
});

export const updateBulkTasks = catchAsync(async (req, res, next) => {
  const { tasks } = req.body;

  const tasksToUpdate = tasks.map((task) => Task.findById(task.id));

  const workspaceIds = tasksToUpdate.map((task) => task.workspaceId);

  if (workspaceIds.length !== 1) {
    return next(
      new AppError("All task must be belong to the same workspace id", 400),
    );
  }

  const workspaceId = workspaceIds[0];

  const currentMember = await Member.findOne({
    workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  const updatedTasks = await Promise.all(
    tasksToUpdate.map(async (task) => {
      const { id, status, position } = task;
      const updatedTask = await Task.findOneAndUpdate(
        { _id: id },
        { status, position },
        { new: true },
      );
      return updatedTask;
    }),
  );

  if (!updatedTasks) {
    return next(new AppError("Failed to update tasks.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: updatedTasks,
    },
  });
});
