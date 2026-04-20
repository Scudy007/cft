'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';
import { Flex, Box, Text } from "@radix-ui/themes";

interface AuditIssue {
  id: number;
  status: string;
  criticality: string;
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: '#3b82f6',        // яркий синий
  IN_PROGRESS: '#f59e0b', // насыщенный желто-оранжевый
  RESOLVED: '#10b981',    // изумрудный зеленый
  CLOSED: '#94a3b8',      // спокойный серый
};

const CRITICALITY_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',    // красный
  HIGH: '#f97316',        // оранжевый
  MEDIUM: '#eab308',      // желтый
  LOW: '#22c55e',         // зеленый
};

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

  if (isLoading) return <div className="text-gray-400 p-5">Загрузка аналитики...</div>;

  const statusCounts = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  const critCounts = issues.reduce((acc, issue) => {
    acc[issue.criticality] = (acc[issue.criticality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const critOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const critData = Object.keys(critCounts)
    .sort((a, b) => critOrder.indexOf(a) - critOrder.indexOf(b))
    .map(key => ({
      name: key,
      Записей: critCounts[key]
    }));

  return (
    <Flex gap="5" direction={{ initial: 'column', md: 'row' }}>
      
      <Box className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-shadow hover:shadow-md" style={{ flex: 1, height: '380px' }}>
        <Text size="4" weight="bold" color="gray" className="block mb-6">Распределение по статусам</Text>
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#cbd5e1'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "30px" }} 
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-shadow hover:shadow-md" style={{ flex: 1, height: '380px' }}>
        <Text size="4" weight="bold" color="gray" className="block mb-6">Уровень критичности</Text>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={critData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            <XAxis 
              dataKey="name" 
              axisLine={{ stroke: '#cbd5e1' }} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              allowDecimals={false} 
              axisLine={{ stroke: '#cbd5e1' }} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="Записей" radius={[4, 4, 0, 0]} barSize={45}>
              {critData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CRITICALITY_COLORS[entry.name] || '#cbd5e1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      
    </Flex>
  );
}