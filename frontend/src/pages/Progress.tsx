// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { progressLogAPI } from '../lib/api';
// import { ProgressLog } from '../lib/localStorage';
// import { TrendingUp, Scale, Heart, Target, Plus } from 'lucide-react';
// import Modal from '../components/Modal';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer
// } from 'recharts';

// export default function Progress() {
//   const { user } = useAuth();
//   const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newLog, setNewLog] = useState({
//     weight: '',
//     bodyFatPercentage: '',
//     notes: ''
//   });

//   useEffect(() => {
//     if (user) {
//       loadProgressLogs();
//     }
//   }, [user]);

//   const loadProgressLogs = async () => {
//     try {
//       const response = await progressLogAPI.getAll();
//       setProgressLogs(response);
//     } catch (error) {
//       console.error('Failed to load progress logs:', error);
//     }
//   };

//   // Prepare data for charts
//   const weightData = progressLogs.map(log => ({
//     date: new Date(log.loggedAt).toLocaleDateString(),
//     weight: log.weight || 0
//   }));

//   const stats = [
//     {
//       icon: Scale,
//       label: 'Current Weight',
//       value: `${progressLogs[0]?.weight || '--'} kg`,
//       change: '+2.1 kg this month'
//     },
//     {
//       icon: Heart,
//       label: 'Body Fat',
//       value: `${progressLogs[0]?.bodyFatPercentage || '--'}%`,
//       change: '-1.2% this month'
//     },
//     {
//       icon: Target,
//       label: 'Goal Progress',
//       value: '68%',
//       change: '5% to goal'
//     }
//   ];

//   const handleAddProgress = async () => {
//     if (!user) return;

//     try {
//       const response = await progressLogAPI.create({
//         weight: parseFloat(newLog.weight) || undefined,
//         bodyFat: parseFloat(newLog.bodyFatPercentage) || undefined,
//         notes: newLog.notes
//       });
      
//       // Handle both direct object and nested object responses
//       const newProgressLog = response.progressLog || response;
//       setProgressLogs([newProgressLog, ...progressLogs]);
//       setNewLog({
//         weight: '',
//         bodyFatPercentage: '',
//         notes: ''
//       });
//       setShowAddModal(false);
//     } catch (error) {
//       console.error('Failed to add progress log:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Progress Tracking</h1>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
//         >
//           <Plus className="w-5 h-5" />
//           <span>Log Progress</span>
//         </button>
//       </div>

//       <div className="grid md:grid-cols-3 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
//             <div className="flex items-center space-x-4">
//               <div className="bg-blue-100 p-3 rounded-xl">
//                 <stat.icon className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-gray-500">{stat.label}</p>
//                 <p className="text-2xl font-bold">{stat.value}</p>
//                 <p className="text-sm text-gray-500">{stat.change}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-6 flex items-center">
//             <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
//             Weight Progress
//           </h2>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={weightData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="weight"
//                   stroke="#2563eb"
//                   strokeWidth={2}
//                   dot={{ fill: '#2563eb' }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white rounded-3xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-6">Recent Measurements</h2>
//           <div className="space-y-4">
//             {progressLogs.slice(0, 5).map((log, index) => (
//               <div key={index} className="bg-gray-50 p-4 rounded-xl">
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="font-medium">
//                     {new Date(log.loggedAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Weight</p>
//                     <p className="font-semibold">{log.weight} kg</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Body Fat</p>
//                     <p className="font-semibold">{log.bodyFatPercentage}%</p>
//                   </div>
//                 </div>
//                 {log.notes && (
//                   <p className="mt-2 text-sm text-gray-600">{log.notes}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <Modal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         title="Log Progress"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Weight (kg)
//             </label>
//             <input
//               type="number"
//               value={newLog.weight}
//               onChange={(e) => setNewLog({ ...newLog, weight: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter weight"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Body Fat Percentage
//             </label>
//             <input
//               type="number"
//               value={newLog.bodyFatPercentage}
//               onChange={(e) => setNewLog({ ...newLog, bodyFatPercentage: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter body fat percentage"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Notes
//             </label>
//             <textarea
//               value={newLog.notes}
//               onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={3}
//               placeholder="Add any notes about your progress"
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               onClick={() => setShowAddModal(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAddProgress}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Save Progress
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import { storage, type ProgressLog } from '../lib/localStorage';
import { TrendingUp, Scale, Heart, Target, Plus } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Progress() {
  const { user } = useAuth();
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLog, setNewLog] = useState({
    weight: '',
    bodyFatPercentage: '',
    notes: '',
  });

  useEffect(() => {
    if (!user) {
      setProgressLogs([]);
      return;
    }

    setProgressLogs(storage.getProgressLogs(user.id));
  }, [user]);

  const latestLog = progressLogs[0];
  const previousLog = progressLogs[1];

  // Prepare data for charts
  const weightData = progressLogs.map(log => ({
    date: new Date(log.loggedAt).toLocaleDateString(),
    weight: log.weight || 0
  }));

  const weightChange =
    latestLog?.weight !== undefined && previousLog?.weight !== undefined
      ? latestLog.weight - previousLog.weight
      : null;

  const bodyFatChange =
    latestLog?.bodyFatPercentage !== undefined && previousLog?.bodyFatPercentage !== undefined
      ? latestLog.bodyFatPercentage - previousLog.bodyFatPercentage
      : null;

  const goalProgress = latestLog?.weight ? Math.min(100, Math.max(0, Math.round((75 / latestLog.weight) * 100))) : 0;

  const stats = [
    {
      icon: Scale,
      label: 'Current Weight',
      value: latestLog?.weight ? `${latestLog.weight} kg` : '-- kg',
      change: weightChange === null ? 'Add another entry to track change' : `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg since last log`,
      accent: 'from-cyan-500/20 to-blue-500/10',
    },
    {
      icon: Heart,
      label: 'Body Fat',
      value: latestLog?.bodyFatPercentage ? `${latestLog.bodyFatPercentage}%` : '--%',
      change: bodyFatChange === null ? 'Track body composition over time' : `${bodyFatChange > 0 ? '+' : ''}${bodyFatChange.toFixed(1)}% since last log`,
      accent: 'from-rose-500/20 to-fuchsia-500/10',
    },
    {
      icon: Target,
      label: 'Momentum Score',
      value: latestLog ? `${goalProgress}%` : '--%',
      change: latestLog ? 'Estimated from your latest entry' : 'Log progress to calculate momentum',
      accent: 'from-emerald-500/20 to-teal-500/10',
    }
  ];

  const handleAddProgress = () => {
    if (!user) return;

    const weight = newLog.weight.trim() ? Number(newLog.weight) : undefined;
    const bodyFatPercentage = newLog.bodyFatPercentage.trim() ? Number(newLog.bodyFatPercentage) : undefined;

    if (weight === undefined && bodyFatPercentage === undefined && !newLog.notes.trim()) {
      return;
    }

    const progressLog: ProgressLog = {
      id: crypto.randomUUID(),
      userId: user.id,
      weight: Number.isFinite(weight) ? weight : undefined,
      bodyFatPercentage: Number.isFinite(bodyFatPercentage) ? bodyFatPercentage : undefined,
      notes: newLog.notes.trim() || undefined,
      loggedAt: new Date().toISOString(),
    };

    storage.saveProgressLog(progressLog);
    setProgressLogs(storage.getProgressLogs(user.id));
    setNewLog({
      weight: '',
      bodyFatPercentage: '',
      notes: '',
    });
    setShowAddModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Body Metrics</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-white">Progress Tracking</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Keep your measurements in one place and spot changes faster with a cleaner, higher-contrast progress view.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 font-medium text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95"
        >
          <Plus className="w-5 h-5" />
          <span>Log Progress</span>
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${stat.accent} p-6 shadow-xl shadow-slate-950/20 backdrop-blur`}>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-cyan-100">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-300">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur">
          <h2 className="mb-6 flex items-center text-xl font-semibold text-white">
            <TrendingUp className="mr-3 h-6 w-6 text-cyan-300" />
            Weight Progress
          </h2>
          {weightData.length > 0 ? (
            <div className="h-80 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                  <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(148,163,184,0.16)',
                      borderRadius: '16px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ fill: '#22d3ee', stroke: '#082f49', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#67e8f9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center rounded-[1.5rem] border border-dashed border-cyan-400/20 bg-white/5 px-6 text-center">
              <div>
                <TrendingUp className="mx-auto h-10 w-10 text-cyan-300/80" />
                <p className="mt-4 text-lg font-medium text-white">No progress data yet</p>
                <p className="mt-2 text-sm text-slate-400">Log your first measurement to start seeing trends here.</p>
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel glow-border rounded-[2rem] p-6">
          <h2 className="mb-6 text-xl font-semibold text-white">Recent Measurements</h2>
          <div className="space-y-4">
            {progressLogs.length > 0 ? progressLogs.slice(0, 5).map((log, index) => (
              <div key={index} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium text-white">
                    {new Date(log.loggedAt).toLocaleDateString()}
                  </p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                    Entry
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Weight</p>
                    <p className="mt-1 font-semibold text-white">{log.weight ?? '--'} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Body Fat</p>
                    <p className="mt-1 font-semibold text-white">{log.bodyFatPercentage ?? '--'}%</p>
                  </div>
                </div>
                {log.notes && (
                  <p className="mt-3 text-sm text-slate-300">{log.notes}</p>
                )}
              </div>
            )) : (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-6 text-center">
                <p className="text-lg font-medium text-white">Nothing logged yet</p>
                <p className="mt-2 text-sm text-slate-400">Recent weigh-ins and body fat entries will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log Progress"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={newLog.weight}
              onChange={(e) => setNewLog({ ...newLog, weight: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter weight"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Body Fat Percentage
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={newLog.bodyFatPercentage}
              onChange={(e) => setNewLog({ ...newLog, bodyFatPercentage: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter body fat percentage"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={newLog.notes}
              onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add any notes about your progress"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddProgress}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save Progress
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
