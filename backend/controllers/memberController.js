import Member from "../models/memberModel.js";
import { User } from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllMembersOfWorkspace = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.query;
  const members = await Member.find({ workspaceId });

  if (!members) {
    return next(new AppError("Members not found.", 404));
  }

  const populatedMembers = await Promise.all(
    members.map(async (member) => {
      const user = await User.findById(member.userId);
      return {
        id: member._id,
        role: member.role,
        workspaceId: member.workspaceId,
        userId: member.userId,
        name: user.name,
        email: user.email,
      };
    }),
  );

  res.status(200).json({
    status: "success",
    members: populatedMembers,
  });
});

export const deleteMember = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;

  const memberToDelete = await Member.findById({
    _id: memberId,
  });

  if (!memberToDelete) {
    return next(new AppError("Member not found.", 404));
  }

  const currentMember = await Member.findOne({
    workspaceId: memberToDelete.workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  if (currentMember.role !== "ADMIN") {
    return next(
      new AppError("You are not authorized to delete this member.", 404),
    );
  }

  const allMemberInWorkspace = await Member.find({
    workspaceId: memberToDelete.workspaceId,
  });

  if (allMemberInWorkspace.length === 1) {
    return next(new AppError("Cannot delete last member in workspace.", 400));
  }

  const deletedMember = await Member.findOneAndDelete({
    _id: memberId,
  });

  if (!deletedMember) {
    return next(new AppError("Failed to delete member.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      member: deletedMember,
    },
  });
});

export const updateMemberRole = catchAsync(async (req, res, next) => {
  const { memberId } = req.params;
  const { role } = req.body;
  const memberToUpdate = await Member.findById({
    _id: memberId,
  });

  if (!memberToUpdate) {
    return next(new AppError("Member not found.", 404));
  }

  const currentMember = await Member.findOne({
    workspaceId: memberToUpdate.workspaceId,
    userId: req.user.id,
  });

  if (!currentMember) {
    return next(new AppError("You are not a member of this workspace.", 404));
  }

  if (currentMember.role !== "ADMIN") {
    return next(
      new AppError("You are not authorized to update this member.", 404),
    );
  }

  const allMemberInWorkspace = await Member.find({
    workspaceId: memberToUpdate.workspaceId,
  });

  // if (role !== "ADMIN" && role !== "USER") {
  //   return next(new AppError("Invalid role.", 400));
  // }

  if (memberToUpdate.role === role) {
    return next(new AppError(`Member already has ${role} role.`, 400));
  }

  if (allMemberInWorkspace.length === 1 && role !== "ADMIN") {
    return next(
      new AppError("Cannot downgrade the last admin in workspace.", 400),
    );
  }

  const updatedMember = await Member.findOneAndUpdate(
    { _id: memberId },
    { role },
    { new: true },
  );

  if (!updatedMember) {
    return next(new AppError("Failed to update member.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      member: updatedMember,
    },
  });
});
