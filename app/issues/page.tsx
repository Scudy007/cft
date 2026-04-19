'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Flex, Heading, Text, Card, TextField, Select, Table, Badge, Button } from '@radix-ui/themes';

export interface AuditIssue {
  id: number;
  title: string;
  system: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number | null;
  discoveryDate: string;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [criticalityFilter, setCriticalityFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/issues')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка при загрузке данных');
        return res.json();
      })
      .then((data) => {
        setIssues(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Не удалось загрузить данные из базы.');
        setIsLoading(false);
      });
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.system.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
    const matchesCriticality = criticalityFilter === 'ALL' || issue.criticality === criticalityFilter;
    
    return matchesSearch && matchesStatus && matchesCriticality;
  });

  if (isLoading) return <Box className="p-10 text-center text-gray-500">Загрузка данных...</Box>;
  if (error) return <Box className="p-10 text-red-500 text-center">{error}</Box>;

  return (
    <Box className="max-w-7xl mx-auto py-6 px-4">
      <Flex justify="between" align="center" mb="5">
        <Heading size="7" color="gray">Результаты аудитов</Heading>
        <Text size="2" color="gray">
          Найдено записей: <Text weight="bold">{filteredIssues.length}</Text>
        </Text>
      </Flex>
      <Card size="2" variant="surface" className="mb-6 shadow-sm border border-slate-200 bg-slate-50">
        <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
          <Box flexGrow="1">
            <TextField.Root size="2">
              <TextField.Input 
                placeholder="Поиск по названию или системе..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </TextField.Root>
          </Box>
          <Box>
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger className="w-full sm:w-[180px]" />
              <Select.Content>
                <Select.Item value="ALL">Все статусы</Select.Item>
                <Select.Item value="OPEN">OPEN</Select.Item>
                <Select.Item value="IN_PROGRESS">IN PROGRESS</Select.Item>
                <Select.Item value="RESOLVED">RESOLVED</Select.Item>
                <Select.Item value="CLOSED">CLOSED</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Select.Root value={criticalityFilter} onValueChange={setCriticalityFilter}>
              <Select.Trigger className="w-full sm:w-[180px]" />
              <Select.Content>
                <Select.Item value="ALL">Любая критичность</Select.Item>
                <Select.Item value="CRITICAL">CRITICAL</Select.Item>
                <Select.Item value="HIGH">HIGH</Select.Item>
                <Select.Item value="MEDIUM">MEDIUM</Select.Item>
                <Select.Item value="LOW">LOW</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
        </Flex>
      </Card>
      <Box className="shadow-sm rounded-xl overflow-hidden border border-slate-200">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Название</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden md:table-cell">Система</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden sm:table-cell">Критичность</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="hidden sm:table-cell">Статус</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center">Действия</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredIssues.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6} align="center" className="py-8 text-gray-400">
                  По вашему запросу ничего не найдено
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredIssues.map((issue) => (
                <Table.Row key={issue.id} align="center" className="hover:bg-slate-50 transition-colors">
                  <Table.Cell>
                    <Text size="2" color="gray" weight="bold">#{issue.id}</Text>
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Link href={`/issues/${issue.id}`} className="font-semibold text-blue-600 hover:underline">
                      {issue.title}
                    </Link>
                    <div className="block sm:hidden mt-2">
                      <Flex gap="2">
                        <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>{issue.status}</Badge>
                        <Badge color={issue.criticality === 'CRITICAL' ? 'red' : issue.criticality === 'HIGH' ? 'orange' : issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'}>{issue.criticality}</Badge>
                      </Flex>
                    </div>
                  </Table.Cell>
                  
                  <Table.Cell className="hidden md:table-cell">
                    <Text size="2">{issue.system}</Text>
                  </Table.Cell>

                  <Table.Cell className="hidden sm:table-cell">
                    <Badge color={
                      issue.criticality === 'CRITICAL' ? 'red' : 
                      issue.criticality === 'HIGH' ? 'orange' : 
                      issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'
                    }>
                      {issue.criticality}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell className="hidden sm:table-cell">
                    <Badge color={
                      issue.status === 'CLOSED' ? 'green' : 
                      issue.status === 'RESOLVED' ? 'teal' : 
                      issue.status === 'IN_PROGRESS' ? 'blue' : 'gray'
                    }>
                      {issue.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell justify="center">
                    <Button variant="soft" size="1" asChild className="cursor-pointer">
                      <Link href={`/issues/${issue.id}`}>Открыть</Link>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}