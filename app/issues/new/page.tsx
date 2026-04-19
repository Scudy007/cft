import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import IssueForm from "../_components/IssueForm";

const NewIssuePage = async () => {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (!session || userRole === "L1") {
    redirect("/issues");
  }

  return (
    <div className="w-full">
      <IssueForm />
    </div>
  );
};

export default NewIssuePage;