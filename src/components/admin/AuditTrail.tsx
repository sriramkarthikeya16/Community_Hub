import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { storage } from '../../services/storage';
import { AuditLog, User } from '../../types';
import { FileClock, Search, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('ALL');

  const refresh = () => {
    setLogs(storage.getAuditLogs());
    setUsers(storage.getUsers());
  };

  useEffect(() => {
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(search.toLowerCase());

    const matchesEntity = selectedEntity === 'ALL' || log.entity_type === selectedEntity;

    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Governance & Compliance Records</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Immutable Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Complete historical ledger tracking flat allocations, bill creations, payment reconciliations, and complaint dispatches.
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Search actions, entity types, or record IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Select value={selectedEntity} onChange={(e) => setSelectedEntity(e.target.value)}>
            <option value="ALL">All Entity Types</option>
            <option value="FLAT">Flats</option>
            <option value="BILL">Bills & Expenses</option>
            <option value="PAYMENT">Payments & Escrow</option>
            <option value="COMPLAINT">Complaints & Tickets</option>
            <option value="USER">User Accounts</option>
            <option value="WORKER">Workers</option>
          </Select>
        </div>
      </Card>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity Type</th>
                <th className="px-4 py-3">Entity ID</th>
                <th className="px-4 py-3">Operator</th>
                <th className="px-4 py-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const operator = users.find((u) => u.id === log.user_id);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors font-mono">
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-semibold text-blue-700">
                        {log.action}
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                          {log.entity_type}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600 truncate max-w-[120px]">
                        {log.entity_id}
                      </td>

                      <td className="px-4 py-3 font-sans">
                        <span className="font-medium text-slate-900 block">
                          {operator ? operator.name : log.user_id}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {operator?.role || 'SYSTEM'}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-sans text-slate-600 max-w-xs truncate">
                        {log.new_value ? (
                          <span className="text-[11px] text-slate-700">
                            {typeof log.new_value === 'object'
                              ? JSON.stringify(log.new_value).slice(0, 80) + '...'
                              : String(log.new_value)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No diff</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
