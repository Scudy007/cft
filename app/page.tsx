import { prisma } from "@/prisma/client";
import { Table, Badge, Link as RadixLink, Flex, Heading, Text, Card, Grid, Box } from "@radix-ui/themes";
import Link from "next/link";
import IssueFilter from "./IssueFilter";
import { Status, Criticality } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import DashboardCharts from "./DashboardCharts";

interface Props {
  searchParams: { 
    status?: Status; 
    criticality?: Criticality;
    assignedToUserId?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;
  
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status as Status) ? searchParams.status : undefined;
  const criticalities = Object.values(Criticality);
  const criticality = criticalities.includes(searchParams.criticality as Criticality) ? searchParams.criticality : undefined;

  const issues = await prisma.issue.findMany({
    where: {
      status,
      criticality,
      assignedToUserId: searchParams.assignedToUserId,
    },
    orderBy: { createdAt: "desc" },
    include: { assignedToUser: true },
  });

  const totalCount = await prisma.issue.count();
  const openCount = await prisma.issue.count({ where: { status: 'OPEN' } });
  const criticalCount = await prisma.issue.count({ where: { criticality: 'CRITICAL' } });

  return (
    <Flex direction="column" gap="4" p="4">
      <Flex justify="between" align="center">
        <Heading size="8">Дашборд безопасности</Heading>
      </Flex>

      <Grid columns={{ initial: '1', sm: '3' }} gap="4">
        <Card variant="surface" color="gray">
          <Text as="div" size="2" color="gray">Всего замечаний</Text>
          <Text as="div" size="6" weight="bold">{totalCount}</Text>
        </Card>
        <Card variant="surface" color="blue">
          <Text as="div" size="2" color="blue">В работе (Open)</Text>
          <Text as="div" size="6" weight="bold">{openCount}</Text>
        </Card>
        <Card variant="surface" color="red">
          <Text as="div" size="2" color="red">Критический риск</Text>
          <Text as="div" size="6" weight="bold">{criticalCount}</Text>
        </Card>
      </Grid>

      <DashboardCharts />

      <Heading size="4" mt="4">Детальный список уязвимостей</Heading>
      
      <IssueFilter currentUserId={currentUserId} />

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Уязвимость</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Статус</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Критичность</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Система</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">Ответственный</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Дата</Table.ColumnHeaderCell>
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
                    <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>
                      {issue.status}
                    </Badge>
                    <Badge color={
                      issue.criticality === 'CRITICAL' ? 'red' : 
                      issue.criticality === 'HIGH' ? 'orange' : 
                      issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'
                    }>
                      {issue.criticality}
                    </Badge>
                  </Flex>
                </div>
              </Table.Cell>
              
              <Table.Cell className="hidden md:table-cell">
                <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>
                  {issue.status}
                </Badge>
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
        <Text mt="4" color="gray" align="center">Задачи по заданным фильтрам не найдены.</Text>
      )}
    </Flex>
  );
}