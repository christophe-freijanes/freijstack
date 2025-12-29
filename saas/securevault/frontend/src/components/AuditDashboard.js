import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Filter, Search, AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function AuditDashboard() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    userId: '',
    dateFrom: '',
    dateTo: '',
    riskLevel: '',
    limit: 50,
    offset: 0
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    fetchLogs();
    fetchStats();
    fetchActions();
  }, [filters.offset]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(filters).toString();
      
      const response = await axios.get(`${API_URL}/audit/admin/logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLogs(response.data.logs);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/audit/admin/stats?days=30`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchActions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/audit/admin/actions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActions(response.data.actions);
    } catch (error) {
      console.error('Failed to fetch actions:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, offset: 0 });
  };

  const handleSearch = () => {
    fetchLogs();
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo
      }).toString();
      
      const response = await axios.get(`${API_URL}/audit/admin/export?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      low: 'var(--success-color)',
      medium: 'var(--warning-color)',
      high: 'var(--danger-color)',
      critical: '#dc2626'
    };
    return colors[level] || 'var(--text-muted)';
  };

  return (
    <div className="audit-dashboard">
      <div className="dashboard-header">
        <h1>📊 Audit & Monitoring</h1>
        <p>Track all system activities and user actions</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <Activity size={32} className="stat-icon" />
            <h3>{stats.actionStats.reduce((sum, a) => sum + parseInt(a.count), 0)}</h3>
            <p>Total Actions (30d)</p>
          </div>
          
          <div className="stat-card">
            <Users size={32} className="stat-icon" />
            <h3>{stats.activeUsers.length}</h3>
            <p>Active Users</p>
          </div>
          
          <div className="stat-card">
            <TrendingUp size={32} className="stat-icon" />
            <h3>{Math.round(stats.timeline.reduce((sum, t) => sum + parseInt(t.count), 0) / stats.timeline.length)}</h3>
            <p>Avg Actions/Day</p>
          </div>
          
          <div className="stat-card alert-card">
            <AlertTriangle size={32} className="stat-icon" style={{ color: 'var(--danger-color)' }} />
            <h3>{stats.suspiciousActivity.failedLogins.length}</h3>
            <p>Suspicious IPs</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="audit-filters">
        <div className="filter-row">
          <div className="filter-group">
            <Search size={20} />
            <input
              type="text"
              name="search"
              placeholder="Search username or details..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <select name="action" value={filters.action} onChange={handleFilterChange}>
            <option value="">All Actions</option>
            {actions.map(a => (
              <option key={a.action} value={a.action}>
                {a.action} ({a.count})
              </option>
            ))}
          </select>

          <select name="riskLevel" value={filters.riskLevel} onChange={handleFilterChange}>
            <option value="">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />

          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />

          <button className="btn btn-primary" onClick={handleSearch}>
            <Filter size={18} />
            Apply Filters
          </button>

          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="audit-table-container">
        {loading ? (
          <div className="loading">Loading audit logs...</div>
        ) : (
          <table className="audit-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Resource</th>
                <th>IP Address</th>
                <th>Risk</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>
                    <div className="user-cell">
                      <strong>{log.username || 'Unknown'}</strong>
                      <span className="email">{log.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="action-badge">{log.action}</span>
                  </td>
                  <td>{log.resource || '-'}</td>
                  <td className="ip-address">{log.ip_address || '-'}</td>
                  <td>
                    {log.risk_level && (
                      <span 
                        className="risk-badge"
                        style={{ backgroundColor: getRiskLevelColor(log.risk_level) }}
                      >
                        {log.risk_level}
                      </span>
                    )}
                  </td>
                  <td className="details-cell">
                    {log.details && (
                      <pre>{JSON.stringify(log.details, null, 2)}</pre>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button
            disabled={filters.offset === 0}
            onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - filters.limit) })}
          >
            Previous
          </button>
          <span>
            Showing {filters.offset + 1} - {Math.min(filters.offset + filters.limit, total)} of {total}
          </span>
          <button
            disabled={filters.offset + filters.limit >= total}
            onClick={() => setFilters({ ...filters, offset: filters.offset + filters.limit })}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditDashboard;
