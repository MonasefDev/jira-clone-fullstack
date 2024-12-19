import { UserButton } from "@/features/auth/components/UserButton";

export function Navbar() {
  return (
    <nav className="pt-4 px-6 flex items-center pb-4 justify-between border-b border-neutral-300">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Monitor all your projects and tasks
        </p>
      </div>
      <UserButton />
      {/* <MobileSidebar /> */}
    </nav>
  );
}
