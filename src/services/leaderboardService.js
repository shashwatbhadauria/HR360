/**
 * Leaderboard data service.
 */
import leaderboardMock from '@/mocks/leaderboard.json';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getLeaderboard(filters = {}) {
  if (isSupabaseConfigured) {
    try {
      // 1. Fetch employees
      const { data: employees, error: empErr } = await supabase
        .from('employees')
        .select('id, name, department, role');
      if (empErr) throw empErr;

      // 2. Fetch daily summaries
      const { data: summaries, error: sumErr } = await supabase
        .from('screentime_daily_summary')
        .select('employee_id, category, total_minutes');
      if (sumErr) throw sumErr;

      if (employees && summaries) {
        // Group minutes by employee
        const empProdMins = {};
        const empTotalMins = {};

        summaries.forEach(s => {
          empTotalMins[s.employee_id] = (empTotalMins[s.employee_id] || 0) + s.total_minutes;
          if (s.category === 'productive') {
            empProdMins[s.employee_id] = (empProdMins[s.employee_id] || 0) + s.total_minutes;
          }
        });

        // Compute scores
        let list = employees.map(emp => {
          const total = empTotalMins[emp.id] || 0;
          const prod = empProdMins[emp.id] || 0;
          const score = total > 0 ? Math.round((prod / total) * 1000) / 10 : 75.0; // default 75
          const hoursWorked = Math.round((total / 60) * 10) / 10;
          return {
            id: emp.id,
            name: emp.name,
            department: emp.department,
            role: emp.role,
            score,
            hoursWorked,
            hoursAllotted: 40,
            breakdown: { hours: score + 2, apps: score - 2, attendance: score },
            trend: 'same',
          };
        });

        // Apply department filters
        if (filters.department) {
          list = list.filter(e => e.department === filters.department);
        }

        // Sort descending by score
        list.sort((a, b) => b.score - a.score);

        // Assign ranks
        return list.map((item, i) => ({ ...item, rank: i + 1 }));
      }
    } catch (err) {
      console.error('[Supabase] Error compiling leaderboard, falling back to mock:', err);
    }
  }

  await delay(500);
  let result = [...leaderboardMock];

  if (filters.department) {
    result = result.filter(e => e.department === filters.department);
  }

  // Re-rank after filtering
  return result.map((item, i) => ({ ...item, rank: i + 1 }));
}

