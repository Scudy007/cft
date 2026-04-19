import { prisma } from "@/prisma/client";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import IssueForm from "../../_components/IssueForm";

interface Props {
  params: { id: string };
}

const EditIssuePage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (!session || userRole === "L1") {
    redirect("/issues/" + params.id);
  }

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) notFound();

  return (
    <div className="w-full">
      <IssueForm issue={issue} />
    </div>
  );
};

export default EditIssuePage;