import { prisma } from "@/prisma/client";
import { Table, Badge, Link as RadixLink, Flex, Heading, Text, Card, Grid, Button, Box } from "@radix-ui/themes";
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
    orderBy?: string; 
    createdAtFrom?: string;
    createdAtTo?: string;
    deadlineFrom?: string;
    deadlineTo?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;
  
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status as Status) ? searchParams.status : undefined;
  const criticalities = Object.values(Criticality);
  const criticality = criticalities.includes(searchParams.criticality as Criticality) ? searchParams.criticality : undefined;

  let orderByObj: any = { createdAt: 'desc' };
  if (searchParams.orderBy === 'cvss') {
    orderByObj = { cvssScore: 'desc' };
  } else if (searchParams.orderBy === 'dread') {
    orderByObj = { dreadScore: 'desc' };
  }

  const where: any = {
    status,
    criticality,
    assignedToUserId: searchParams.assignedToUserId,
  };

  if (searchParams.createdAtFrom || searchParams.createdAtTo) {
    where.createdAt = {};
    if (searchParams.createdAtFrom) where.createdAt.gte = new Date(searchParams.createdAtFrom);
    if (searchParams.createdAtTo) {
      const toDate = new Date(searchParams.createdAtTo);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  if (searchParams.deadlineFrom || searchParams.deadlineTo) {
    where.deadline = {};
    if (searchParams.deadlineFrom) where.deadline.gte = new Date(searchParams.deadlineFrom);
    if (searchParams.deadlineTo) {
      const toDate = new Date(searchParams.deadlineTo);
      toDate.setHours(23, 59, 59, 999);
      where.deadline.lte = toDate;
    }
  }

  const issues = await prisma.issue.findMany({
    where,
    orderBy: orderByObj,
    include: { assignedToUser: true },
  });

  const totalCount = await prisma.issue.count();
  const openCount = await prisma.issue.count({ where: { status: 'OPEN' } });
  const criticalCount = await prisma.issue.count({ where: { criticality: 'CRITICAL' } });

  const buildSortUrl = (order: string) => {
    const params = new URLSearchParams();
    if (searchParams.status) params.append("status", searchParams.status);
    if (searchParams.criticality) params.append("criticality", searchParams.criticality);
    if (searchParams.assignedToUserId) params.append("assignedToUserId", searchParams.assignedToUserId);
    if (searchParams.createdAtFrom) params.append("createdAtFrom", searchParams.createdAtFrom);
    if (searchParams.createdAtTo) params.append("createdAtTo", searchParams.createdAtTo);
    if (searchParams.deadlineFrom) params.append("deadlineFrom", searchParams.deadlineFrom);
    if (searchParams.deadlineTo) params.append("deadlineTo", searchParams.deadlineTo);
    params.append("orderBy", order);
    return `/?${params.toString()}`;
  };

  const isDateSort = !searchParams.orderBy || searchParams.orderBy === 'new';

  return (
    <Box className="max-w-7xl mx-auto py-6 px-4">
      <Flex direction="column" gap="6">
        <Heading size="8" color="gray">Дашборд безопасности</Heading>

        <Grid columns={{ initial: '1', sm: '3' }} gap="5">
          <Card size="3" variant="surface" className="shadow-sm hover:shadow-md transition-shadow">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray" weight="bold" uppercase>Всего замечаний</Text>
              <Text size="9" weight="bold">{totalCount}</Text>
            </Flex>
          </Card>
          <Card size="3" variant="surface" className="shadow-sm hover:shadow-md transition-shadow">
            <Flex direction="column" gap="2">
              <Text size="2" color="blue" weight="bold" uppercase>В работе (Open)</Text>
              <Text size="9" weight="bold" color="blue">{openCount}</Text>
            </Flex>
          </Card>
          <Card size="3" variant="surface" className="shadow-sm hover:shadow-md transition-shadow">
            <Flex direction="column" gap="2">
              <Text size="2" color="red" weight="bold" uppercase>Критический риск</Text>
              <Text size="9" weight="bold" color="red">{criticalCount}</Text>
            </Flex>
          </Card>
        </Grid>

        <DashboardCharts />

        <Flex direction="column" gap="4" mt="4">
          <Heading size="5" color="gray">Детальный список уязвимостей</Heading>
          
          <Flex direction={{ initial: 'column', lg: 'row' }} justify="between" align="start" gap="4">
            <IssueFilter currentUserId={currentUserId} />
            <Flex gap="3" align="center" wrap="wrap">
              <Text size="2" weight="bold" color="gray">Сортировка:</Text>
              <Button variant={isDateSort ? 'solid' : 'soft'} asChild className="shadow-sm cursor-pointer">
                <Link href={buildSortUrl('new')}>По дате</Link>
              </Button>
              <Button color="red" variant={searchParams.orderBy === 'cvss' ? 'solid' : 'soft'} asChild className="shadow-sm cursor-pointer">
                <Link href={buildSortUrl('cvss')}>По CVSS Score</Link>
              </Button>
              <Button color="orange" variant={searchParams.orderBy === 'dread' ? 'solid' : 'soft'} asChild className="shadow-sm cursor-pointer">
                <Link href={buildSortUrl('dread')}>По DREAD Score</Link>
              </Button>
            </Flex>
          </Flex>

          <Box className="shadow-sm rounded-xl overflow-hidden border border-slate-200 mt-2">
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Уязвимость</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="hidden md:table-cell">Статус</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="hidden md:table-cell">Критичность</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="hidden lg:table-cell">Система</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="hidden sm:table-cell">Баллы</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="hidden md:table-cell">Ответственный</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Создано</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Дедлайн</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {issues.map((issue) => {
                  const isOverdue = issue.deadline && new Date(issue.deadline) < new Date() && issue.status !== 'CLOSED';

                  return (
                    <Table.Row key={issue.id} align="center">
                      <Table.Cell>
                        <Link href={`/issues/${issue.id}`} passHref legacyBehavior>
                          <RadixLink weight="bold">{issue.title}</RadixLink>
                        </Link>
                        <div className="block md:hidden mt-1">
                          <Flex gap="2">
                            <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>{issue.status}</Badge>
                            <Badge color={issue.criticality === 'CRITICAL' ? 'red' : issue.criticality === 'HIGH' ? 'orange' : issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'}>{issue.criticality}</Badge>
                          </Flex>
                        </div>
                      </Table.Cell>
                      
                      <Table.Cell className="hidden md:table-cell">
                        <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>{issue.status}</Badge>
                      </Table.Cell>
                      
                      <Table.Cell className="hidden md:table-cell">
                        <Badge color={issue.criticality === 'CRITICAL' ? 'red' : issue.criticality === 'HIGH' ? 'orange' : issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'}>{issue.criticality}</Badge>
                      </Table.Cell>

                      <Table.Cell className="hidden lg:table-cell">
                        <Text size="2">{issue.system}</Text>
                      </Table.Cell>

                      <Table.Cell className="hidden sm:table-cell">
                        <Flex direction="column" gap="1">
                          {issue.cvssScore != null && <Badge color="red" variant="soft">CVSS: {issue.cvssScore}</Badge>}
                          {issue.dreadScore != null && <Badge color="orange" variant="soft">DREAD: {issue.dreadScore}</Badge>}
                        </Flex>
                      </Table.Cell>

                      <Table.Cell className="hidden md:table-cell">
                        <Text size="2">{issue.assignedToUser?.name || "Не назначено"}</Text>
                      </Table.Cell>

                      {/* ЯЧЕЙКИ ДАТ */}
                      <Table.Cell>
                        <Text size="2">{issue.createdAt.toLocaleDateString("ru-RU")}</Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Text size="2" color={isOverdue ? "red" : "gray"} weight={isOverdue ? "bold" : "regular"}>
                          {issue.deadline ? new Date(issue.deadline).toLocaleDateString("ru-RU") : "—"}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Box>

          {issues.length === 0 && (
            <Text mt="4" color="gray" align="center" as="p">Задачи по заданным фильтрам не найдены.</Text>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}