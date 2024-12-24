import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// memberSchema.set("toJSON", {
//   transform: (doc, ret) => {
//     ret.id = ret._id; // Rename _id to id
//     delete ret._id; // Remove _id field
//     delete ret.__v; // Remove __v field
//     return ret;
//   },
// });
const Member = mongoose.model("Member", memberSchema);

export default Member;
