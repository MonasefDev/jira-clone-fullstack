import Member from "../models/memberModel.js";
import Task from "../models/taskModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllTasks = catchAsync(async (req, res, next) => {
  const { workspaceId, projectId, assigneeId, status, search, dueDate } =
    req.query;

  const currentMember = await Member.findOne({
    workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  const query = {
    workspaceId,
  };

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

  const tasks = await Task.find(query);

  if (!tasks) {
    return next(new AppError("No tasks found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tasks: tasks,
    },
  });
});

export const getTask = catchAsync(async (req, res, next) => {
  const { taskId } = req.params;

  const currentMember = await Member.findOne({
    workspaceId: req.body.workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return next(new AppError("Task not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      task: task,
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
    data: {
      data: updatedTask,
    },
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
