import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A task must have a name"],
  },
  status: {
    type: String,
    required: [true, "A task must have a status"],
    enum: ["BACKLOG", "TODO", "IN_REVIEW", "IN_PROGRESS", "DONE"],
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: [true, "A task must belong to a workspace"],
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "A task must belong to a project"],
  },
  dueDate: {
    type: Date,
    validate: {
      validator: (value) => !Number.isNaN(Date.parse(value)),
      message: (props) => `${props.value} is not a valid date!`,
    },
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A task must have an assignee"],
  },
  description: {
    type: String,
  },
  position: {
    type: Number,
  },
});

taskSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id; // Rename _id to id
    delete ret._id; // Remove _id field
    delete ret.__v; // Remove __v field
    return ret;
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
