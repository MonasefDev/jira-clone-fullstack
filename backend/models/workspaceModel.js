import mongoose from "mongoose";
import { generateInviteCode } from "../utils/helpers.js";

// Define the Workspace schema
const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A workspace must have a name"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A workspace must belong to a user"],
  },
  imageUrl: {
    type: String,
    default: undefined, // Replace with your default image URL
  },
  inviteCode: {
    type: String,
    unique: true,
    default: () => generateInviteCode(10), // Generate invite code dynamically
  },
});

// Customize the JSON response
workspaceSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id; // Rename _id to id
    delete ret._id; // Remove _id field
    delete ret.__v; // Remove __v field
  },
});

// Create the Workspace model
const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
