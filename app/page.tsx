import { prisma } from "@/prisma/client";
import { Table, Badge, Link as RadixLink, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import IssueFilter from "./IssueFilter";
import { Status, Criticality } from "@prisma/client";

interface Props {
  searchParams: { status?: Status; criticality?: Criticality };
}

export default async function Home({ searchParams }: Props) {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status as Status) ? searchParams.status : undefined;
  const criticalities = Object.values(Criticality);
  const criticality = criticalities.includes(searchParams.criticality as Criticality) ? searchParams.criticality : undefined;

  const issues = await prisma.issue.findMany({
    where: {
      status,
      criticality,
    },
    orderBy: { createdAt: "desc" },
    include: {
      assignedToUser: true, 
    },
  });

  return (
    <div>
      <Flex justify="between" align="center" mb="5">
        <Heading>Дашборд уязвимостей</Heading>
      </Flex>
      <IssueFilter />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Уязвимость / Таска</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Статус</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Критичность</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Система</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Ответственный</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Создано</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id} align="center">
              <Table.Cell>
                <Link href={`/issues/${issue.id}`} passHref legacyBehavior>
                  <RadixLink weight="bold">{issue.title}</RadixLink>
                </Link>
        
                <div className="block md:hidden mt-1">
                  <Flex gap="2">
                    <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>{issue.status}</Badge>
                    <Badge color={issue.criticality === 'CRITICAL' ? 'red' : 'gray'}>{issue.criticality}</Badge>
                  </Flex>
                </div>
              </Table.Cell>
              
              <Table.Cell className="hidden md:table-cell">
                <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>{issue.status}</Badge>
              </Table.Cell>
              
              <Table.Cell className="hidden md:table-cell">
                <Badge color={
                  issue.criticality === 'CRITICAL' ? 'red' : 
                  issue.criticality === 'HIGH' ? 'orange' : 
                  issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'
                }>
                  {issue.criticality}
                </Badge>
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                <Text size="2">{issue.system}</Text>
              </Table.Cell>

              <Table.Cell className="hidden md:table-cell">
                {issue.assignedToUser ? (
                  <Text size="2">{issue.assignedToUser.name || issue.assignedToUser.email}</Text>
                ) : (
                  <Text size="2" color="gray">Не назначено</Text>
                )}
              </Table.Cell>

              <Table.Cell>
                <Text size="2">{issue.createdAt.toLocaleDateString("ru-RU")}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {issues.length === 0 && (
        <Text mt="4" as="p" color="gray" align="center">
          Задачи по заданным фильтрам не найдены.
        </Text>
      )}
    </div>
  );
}