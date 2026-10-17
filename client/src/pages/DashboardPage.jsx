import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import { Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import StatCard from '../components/ui/StatCard';
import TaskCard from '../components/ui/TaskCard';
import toast from 'react-hot-toast';

const CHART_COLORS = {
  pending: '#ffd166',
  'in-progress': '#3b9eff',
  completed: '#00d4a1',
  cancelled: '#ff4d6a',
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, stats, loading, loadTasks, loadStats, removeTask } = useTasks();

  useEffect(() => {
    loadTasks({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' });
    loadStats();
  }, [loadTasks, loadStats]);

  const pieData = useMemo(() => [
    { name: 'Pending', value: stats.pending, color: CHART_COLORS.pending },
    { name: 'In Progress', value: stats.inProgress, color: CHART_COLORS['in-progress'] },
    { name: 'Completed', value: stats.completed, color: CHART_COLORS.completed },
    { name: 'Cancelled', value: stats.cancelled, color: CHART_COLORS.cancelled },
  ].filter((d) => d.value > 0), [stats]);

  const barData = useMemo(() => [
    { name: 'Low', value: stats.priority?.low || 0, fill: '#00d4a1' },
    { name: 'Medium', value: stats.priority?.medium || 0, fill: '#3b9eff' },
    { name: 'High', value: stats.priority?.high || 0, fill: '#ff8c42' },
    { name: 'Urgent', value: stats.priority?.urgent || 0, fill: '#ff4d6a' },
  ], [stats.priority]);

  const handleDeleteTask = async (id, title) => {
    if (!window.confirm(`Delete task "${title}"?`)) return;
    const result = await removeTask(id);
    if (result.success) toast.success('Task deleted!');
    else toast.error(result.error || 'Failed to delete task');
  };

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  });

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-secondary">Here's what's happening with your tasks today.</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard type="total" icon="📋" label="Total Tasks" value={stats.total} />
        <StatCard type="pending" icon="⏳" label="Pending" value={stats.pending} />
        <StatCard type="inprogress" icon="🔄" label="In Progress" value={stats.inProgress} />
        <StatCard type="completed" icon="✅" label="Completed" value={stats.completed} />
      </div>

      {/* Charts */}
      {stats.total > 0 && (
        <div className="charts-grid mb-6">
          <div className="chart-card">
            <div className="chart-card-title">Task Status Breakdown</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#13131f', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, color: '#f0f0ff', fontSize: 13,
                  }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: '#8888a8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-card-title">Tasks by Priority</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={32}>
                <XAxis dataKey="name" tick={{ fill: '#8888a8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8888a8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#13131f', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, color: '#f0f0ff', fontSize: 13,
                  }}
                  cursor={{ fill: 'rgba(108,99,255,0.08)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 className="text-lg font-bold">Recent Tasks</h3>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>
          View all <ArrowRight size={14} />
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No tasks yet</div>
          <div className="empty-desc mb-4">Create your first task to get started.</div>
          <button className="btn btn-primary" onClick={() => navigate('/tasks/new')}>
            <Plus size={16} /> Create Task
          </button>
        </div>
      ) : (
        <div className="grid-tasks">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onDelete={handleDeleteTask} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
