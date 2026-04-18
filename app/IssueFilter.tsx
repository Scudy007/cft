"use client";

import { Status, Criticality } from "@prisma/client";
import { Select, Flex } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

const statuses: { label: string; value: Status | "ALL" }[] = [
  { label: "Все статусы", value: "ALL" },
  { label: "Открытые", value: "OPEN" },
  { label: "В работе", value: "IN_PROGRESS" },
  { label: "Решенные", value: "RESOLVED" },
  { label: "Закрытые", value: "CLOSED" },
];

const criticalities: { label: string; value: Criticality | "ALL" }[] = [
  { label: "Любая критичность", value: "ALL" },
  { label: "CRITICAL", value: "CRITICAL" },
  { label: "HIGH", value: "HIGH" },
  { label: "MEDIUM", value: "MEDIUM" },
  { label: "LOW", value: "LOW" },
];

const IssueFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (value: string, paramName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <Flex gap="3" mb="5">
      <Select.Root 
        defaultValue={searchParams.get("status") || "ALL"} 
        onValueChange={(val) => handleFilterChange(val, "status")}
      >
        <Select.Trigger placeholder="Фильтр по статусу..." />
        <Select.Content>
          {statuses.map((status) => (
            <Select.Item key={status.value} value={status.value}>
              {status.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Select.Root 
        defaultValue={searchParams.get("criticality") || "ALL"} 
        onValueChange={(val) => handleFilterChange(val, "criticality")}
      >
        <Select.Trigger placeholder="Фильтр по риску..." />
        <Select.Content>
          {criticalities.map((crit) => (
            <Select.Item key={crit.value} value={crit.value}>
              {crit.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default IssueFilter;