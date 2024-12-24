import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { TaskStatus } from "../types";

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    assigneeId: parseAsString,
    status: parseAsStringEnum(TaskStatus),
    dueDate: parseAsString,
    search: parseAsString,
  });
};
