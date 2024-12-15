"use client";

import React, { useCallback, useEffect } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { useParams, useRouter } from "next/navigation";

import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/WorkspaceAvatar";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

export function WorkspaceSwitcher() {
  const { data: workspaces, isPending: isLoading } = useGetWorkspaces();
  const { workspaceId } = useParams();
  const [selectedId, setSelectedId] = React.useState(workspaceId);
  const { open } = useCreateWorkspaceModal();
  const router = useRouter();

  const onSelect = useCallback(
    (id) => {
      setSelectedId(id);
      router.push(`/workspaces/${id}`);
    },
    [router]
  );
  useEffect(() => {
    if (workspaceId !== selectedId) {
      setSelectedId(workspaceId); // Update the selectedId when the URL changes
    }
  }, [workspaceId, selectedId]);
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500 uppercase">
          workspace
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {isLoading ? (
        <div className="h-12 rounded-md flex justify-center items-center relative w-full bg-neutral-200 font-medium py-1 px-2 ">
          <Loader className="animate-spin size-6 text-muted-foreground" />
        </div>
      ) : (
        <Select
          defaultValue={workspaceId}
          value={selectedId}
          onValueChange={onSelect}
        >
          <SelectTrigger className="w-full bg-neutral-200 font-medium py-1 px-2 ">
            <SelectValue
              placeholder="No workspace selected"
              className="text-neutral-500"
            />
          </SelectTrigger>
          <SelectContent>
            {workspaces?.length === 0 ? (
              <div className="text-neutral-500 py-1 px-2">
                No workspaces found
              </div>
            ) : (
              workspaces?.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  <div className="flex justify-start items-center gap-3 font-medium">
                    <WorkspaceAvatar
                      name={workspace.name}
                      image={workspace.imageUrl}
                    />
                    <span className="truncate">{workspace.name}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
