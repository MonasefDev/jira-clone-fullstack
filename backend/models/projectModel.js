import mongoose from "mongoose";

// Define the Workspace schema
const projectModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A project must have a name"],
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: [true, "A project must belong to a workspace"],
  },
  imageUrl: {
    type: String,
    default: undefined,
  },
});

// Customize the JSON response
projectModel.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id; // Rename _id to id
    delete ret._id; // Remove _id field
    delete ret.__v; // Remove __v field
    return ret;
  },
});

// Create the Project model
const Project = mongoose.model("Project", projectModel);

export default Project;
