import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function WorkspaceAvatar({ image, name, className }) {
  if (image) {
    return (
      <Avatar className={cn("bg-blue-700 size-10 rounded-md", className)}>
        <AvatarFallback className="font-medium bg-blue-700 text-white uppercase rounded-md">
          <div
            className={cn(
              "size-10 relative rounded-md overflow-hidden",
              className
            )}
          >
            {image && (
              <Image
                src={image ?? "/default-avatar.png"}
                alt={name}
                fill
                className="object-cover"
              />
            )}
          </div>
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={cn("bg-blue-600 size-10 rounded-md", className)}>
      <AvatarFallback className="font-medium bg-blue-700 text-white uppercase rounded-md">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
