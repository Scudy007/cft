"use client";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { useSession } from "next-auth/react";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  if (!userRole || userRole === "L1") {
    return null; 
  }

  return (
    <Button>
      <Link href={`/issues/${issueId}/edit`} className="w-full text-center">
        Редактировать задачу
      </Link>
    </Button>
  );
};

export default EditIssueButton;