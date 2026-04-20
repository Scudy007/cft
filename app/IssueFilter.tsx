"use client";

import { Status, Criticality } from "@prisma/client";
import { Select, Flex, Text, Switch, TextField } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

const IssueFilter = ({ currentUserId }: { currentUserId?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL" || !value) params.delete(name);
    else params.set(name, value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <Flex direction="column" gap="4">
      <Flex gap="4" align="center" wrap="wrap">
        <Select.Root 
          defaultValue={searchParams.get("status") || "ALL"} 
          onValueChange={(val) => updateParams("status", val)}
        >
          <Select.Trigger placeholder="Статус" />
          <Select.Content>
            <Select.Item value="ALL">Все статусы</Select.Item>
            {Object.values(Status).map(s => <Select.Item key={s} value={s}>{s}</Select.Item>)}
          </Select.Content>
        </Select.Root>

        <Select.Root 
          defaultValue={searchParams.get("criticality") || "ALL"} 
          onValueChange={(val) => updateParams("criticality", val)}
        >
          <Select.Trigger placeholder="Критичность" />
          <Select.Content>
            <Select.Item value="ALL">Любой риск</Select.Item>
            {Object.values(Criticality).map(c => <Select.Item key={c} value={c}>{c}</Select.Item>)}
          </Select.Content>
        </Select.Root>

        {currentUserId && (
          <Flex align="center" gap="2">
            <Text size="2" color="gray">Только мои</Text>
            <Switch 
              size="1"
              checked={searchParams.get("assignedToUserId") === currentUserId}
              onCheckedChange={(checked) => 
                updateParams("assignedToUserId", checked ? currentUserId : "ALL")
              }
            />
          </Flex>
        )}
      </Flex>
      <Flex gap="5" align="center" wrap="wrap">
        <Flex align="center" gap="2">
          <Text size="1" weight="bold" color="gray" uppercase>Создано:</Text>
          <TextField.Root size="1">
            <TextField.Input 
              type="date" 
              defaultValue={searchParams.get("createdAtFrom") || ""}
              onChange={(e) => updateParams("createdAtFrom", e.target.value)}
            />
          </TextField.Root>
          <Text size="1" color="gray">—</Text>
          <TextField.Root size="1">
            <TextField.Input 
              type="date" 
              defaultValue={searchParams.get("createdAtTo") || ""}
              onChange={(e) => updateParams("createdAtTo", e.target.value)}
            />
          </TextField.Root>
        </Flex>

        <Flex align="center" gap="2">
          <Text size="1" weight="bold" color="gray" uppercase>Дедлайн:</Text>
          <TextField.Root size="1">
            <TextField.Input 
              type="date" 
              defaultValue={searchParams.get("deadlineFrom") || ""}
              onChange={(e) => updateParams("deadlineFrom", e.target.value)}
            />
          </TextField.Root>
          <Text size="1" color="gray">—</Text>
          <TextField.Root size="1">
            <TextField.Input 
              type="date" 
              defaultValue={searchParams.get("deadlineTo") || ""}
              onChange={(e) => updateParams("deadlineTo", e.target.value)}
            />
          </TextField.Root>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default IssueFilter;