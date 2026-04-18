"use client";
import { Select } from "@radix-ui/themes";
import { Issue, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const IssueSelect = ({ issue }: { issue: Issue }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const currentUserRole = (session?.user as any)?.role;

  const { data: users, error, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data)
  });

  if (isLoading) return <div className="h-8 w-40 bg-gray-200 animate-pulse rounded" />;
  if (error) return null;

  const rolesOrder = ["L1", "L2", "L3", "ADMIN"];
  const getRoleIndex = (role: string) => rolesOrder.indexOf(role);

  const filteredUsers = users?.filter((user) => {
    if (currentUserRole === "ADMIN") {
      return true;
    }
    
    if (currentUserRole === "L1") {
      return user.role === "L2";
    }

    if (currentUserRole === "L2") {
      return user.role === "L3" || user.role === "L1";
    }

    if (currentUserRole === "L3") {
      return user.role === "ADMIN" || user.role === "L2";
    }
    
    return false;
  });

  const assignIssue = async (userId: string) => {
    const assignedToUserId = userId === "unassigned" ? null : userId;
    const targetUser = users?.find(u => u.id === userId);
    const newStatus = (targetUser?.role === "L1" && currentUserRole !== "L1") ? "OPEN" : issue.status;
    const comment = window.prompt("Оставляем комментарий при назначении:");

    try {
      await axios.patch(`/api/issues/${issue.id}`, { 
        assignedToUserId,
        status: newStatus,
        comment: comment
      });
      router.refresh();
      toast.success("Ответственный назначен");
    } catch {
      toast.error("Не удалось изменить исполнителя");
    }
  };

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || "unassigned"}
        onValueChange={assignIssue}
      >
        <Select.Trigger placeholder="Выберите исполнителя..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Доступные маршруты</Select.Label>
            <Select.Item value="unassigned">Снять назначение</Select.Item>
            
            {filteredUsers?.map((user) => {
              const isEscalation = getRoleIndex(user.role) > getRoleIndex(currentUserRole);
              return (
                <Select.Item key={user.id} value={user.id}>
                  {isEscalation ? "🔼 " : "↩️ "}
                  {user.name || user.email} ({user.role})
                </Select.Item>
              );
            })}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default IssueSelect;