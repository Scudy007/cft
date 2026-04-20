'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Flex, Heading, Text, Card, TextField, Select, Badge, Grid } from '@radix-ui/themes';

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

  const kanbanColumns = [
    { id: 'OPEN', label: 'Открыто', color: 'blue' },
    { id: 'IN_PROGRESS', label: 'В работе', color: 'orange' },
    { id: 'RESOLVED', label: 'Решено (на проверке)', color: 'teal' },
    { id: 'CLOSED', label: 'Закрыто', color: 'gray' },
  ];

  if (isLoading) return <Box className="p-10 text-center text-gray-500">Загрузка доски...</Box>;
  if (error) return <Box className="p-10 text-red-500 text-center">{error}</Box>;

  return (
    <Box className="max-w-7xl mx-auto py-6 px-4">
      <Flex justify="between" align="center" mb="5">
        <Heading size="7" color="gray">Рабочая доска (Kanban)</Heading>
        <Text size="2" color="gray">
          Найдено задач: <Text weight="bold">{filteredIssues.length}</Text>
        </Text>
      </Flex>

      <Card size="2" variant="surface" className="mb-6 shadow-sm border border-slate-200 bg-slate-50">
        <Flex gap="4" direction={{ initial: 'column', sm: 'row' }} align={{ sm: 'center' }}>
          
          <Box className="flex-1 w-full min-w-[300px]">
            <TextField.Root size="2" className="w-full">
              <TextField.Input 
                placeholder="Поиск по названию или системе..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </TextField.Root>
          </Box>
          
          <Flex gap="4" wrap="wrap">
            <Box>
              <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
                <Select.Trigger className="w-full sm:w-[160px]" />
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
                <Select.Trigger className="w-full sm:w-[160px]" />
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

        </Flex>
      </Card>
      
      <Grid columns={{ initial: '1', md: '2', xl: '4' }} gap="4" align="start">
        {kanbanColumns.map((col) => {
          const columnIssues = filteredIssues.filter(issue => issue.status === col.id);
          
          return (
            <Box 
              key={col.id} 
              className="bg-slate-100 rounded-xl p-3 flex flex-col h-[calc(100vh-220px)] min-h-[500px] border border-slate-200"
            >
              
              <Flex justify="between" align="center" mb="4" px="1" className="flex-shrink-0">
                <Text weight="bold" size="2" color={col.color as any} uppercase tracking="wide">
                  {col.label}
                </Text>
                <Badge radius="full" color="gray" variant="surface">
                  {columnIssues.length}
                </Badge>
              </Flex>

              <Box className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                <Flex direction="column" gap="3">
                  {columnIssues.map((issue) => (
                    <Card key={issue.id} size="2" variant="surface" className="shadow-sm hover:shadow-md transition-all">
                      <Flex direction="column" gap="2">
                        <Flex justify="between" align="start" gap="2">
                          <Badge color={
                            issue.criticality === 'CRITICAL' ? 'red' : 
                            issue.criticality === 'HIGH' ? 'orange' : 
                            issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'
                          }>
                            {issue.criticality}
                          </Badge>
                          <Text size="1" color="gray" weight="medium">#{issue.id}</Text>
                        </Flex>

                        <Link href={`/issues/${issue.id}`} className="font-semibold text-slate-800 hover:text-indigo-600 text-sm leading-tight mt-1 mb-1 block">
                          {issue.title}
                        </Link>

                        <Flex justify="between" align="center">
                          <Text size="1" color="gray" className="truncate max-w-[120px]">
                            {issue.system}
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                  ))}

                  {columnIssues.length === 0 && (
                    <Box className="border-2 border-dashed border-slate-300 rounded-lg py-6 text-center">
                      <Text size="1" color="gray">Нет задач</Text>
                    </Box>
                  )}
                </Flex>
              </Box>

            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}