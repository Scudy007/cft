'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Flex, Card, Heading } from "@radix-ui/themes";

interface AuditIssue {
  id: number;
  status: string;
  criticality: string;
}

export default function DashboardCharts() {
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/issues')
      .then(res => res.json())
      .then(data => {
        setIssues(data);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  if (isLoading) return <div>Загрузка аналитики...</div>;

  const statusCounts = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const critCounts = issues.reduce((acc, issue) => {
    acc[issue.criticality] = (acc[issue.criticality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const critData = Object.keys(critCounts).map(key => ({
    name: key,
    Записей: critCounts[key]
  }));

  return (
    <Flex gap="5" direction={{ initial: 'column', md: 'row' }}>
      
      <Card size="3" variant="surface" className="shadow-sm hover:shadow-md transition-shadow" style={{ flex: 1, height: '350px' }}>
        <Heading size="4" mb="4" color="gray">Распределение по статусам</Heading>
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card size="3" variant="surface" className="shadow-sm hover:shadow-md transition-shadow" style={{ flex: 1, height: '350px' }}>
        <Heading size="4" mb="4" color="gray">Уровень критичности</Heading>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={critData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="Записей" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      
    </Flex>
  );
}