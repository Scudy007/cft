'use client';

import { useState, useEffect } from 'react';

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

  // Состояния для фильтров
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

  // Логика фильтрации данных
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.system.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
    const matchesCriticality = criticalityFilter === 'ALL' || issue.criticality === criticalityFilter;
    
    return matchesSearch && matchesStatus && matchesCriticality;
  });

  if (isLoading) return <div className="p-10 text-center text-gray-500">Загрузка данных...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Результаты аудитов</h1>
        <div className="text-sm text-gray-500">
          Найдено записей: {filteredIssues.length}
        </div>
      </div>

      {/* Панель фильтров */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Поиск по названию или системе..."
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select 
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Все статусы</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
        <div>
          <select 
            className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
          >
            <option value="ALL">Любая критичность</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>
      
      {/* Таблица */}
      <div className="overflow-x-auto shadow-sm border border-gray-200 sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Название</th>
              <th className="px-6 py-3">Система</th>
              <th className="px-6 py-3">Критичность</th>
              <th className="px-6 py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  По вашему запросу ничего не найдено
                </td>
              </tr>
            ) : (
              filteredIssues.map((issue) => (
                <tr key={issue.id} className="bg-white border-b hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 font-mono text-xs">#{issue.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{issue.title}</td>
                  <td className="px-6 py-4">{issue.system}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider
                      ${issue.criticality === 'CRITICAL' ? 'bg-red-100 text-red-800' : ''}
                      ${issue.criticality === 'HIGH' ? 'bg-orange-100 text-orange-800' : ''}
                      ${issue.criticality === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${issue.criticality === 'LOW' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {issue.criticality}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${issue.status === 'OPEN' ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                      {issue.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}