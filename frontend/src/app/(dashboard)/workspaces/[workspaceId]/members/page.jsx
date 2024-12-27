import { LoaderPage } from "@/components/LoaderPage";
import MembersList from "@/features/members/components/MembersList";
import { Suspense } from "react";

function MembersPage() {
  return (
    <Suspense fallback={<LoaderPage />}>
      <div className="w-full lg:max-w-3xl mx-auto">
        <MembersList />
      </div>
    </Suspense>
  );
}

export default MembersPage;
