"use client";

import { ResponsiveModal } from "@/components/ResponsiveModale";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";

export function CreateWorkspaceModal() {
  const { isOpen, close, setIsOpen } = useCreateWorkspaceModal();
  return (
    <ResponsiveModal
      title="create workspace"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
}
