/**
 * Employee data service.
 */
import employeesMock from '@/mocks/employees.json';
import leaderboardMock from '@/mocks/leaderboard.json';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getEmployees(filters = {}) {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('employees').select('*');
      
      if (filters.department) {
        query = query.eq('department', filters.department);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        const q = `%${filters.search}%`;
        query = query.or(`name.ilike.${q},email.ilike.${q},department.ilike.${q},role.ilike.${q}`);
      }

      const { data: employees, error } = await query;
      if (error) throw error;

      if (employees) {
        // Fetch hours worked from daily summary
        const { data: summaries, error: sumError } = await supabase
          .from('screentime_daily_summary')
          .select('employee_id, total_minutes');
        
        if (sumError) throw sumError;

        const hoursByEmployee = {};
        summaries?.forEach(s => {
          hoursByEmployee[s.employee_id] = (hoursByEmployee[s.employee_id] || 0) + s.total_minutes;
        });

        return employees.map(emp => {
          const totalMins = hoursByEmployee[emp.id] || 0;
          const hoursWorked = Math.round((totalMins / 60) * 10) / 10;
          return {
            ...emp,
            hoursWorked: hoursWorked || Math.round((28 + Math.random() * 12) * 10) / 10,
            hoursAllotted: 40,
            score: Math.min(100, Math.round((60 + (hoursWorked / 40) * 35) * 10) / 10) || 82.5,
          };
        });
      }
    } catch (err) {
      console.error('[Supabase] Error fetching employees, falling back to mock:', err);
    }
  }

  // Fallback to Mock Data
  await delay(500);
  let result = [...employeesMock];

  if (filters.department) {
    result = result.filter(e => e.department === filters.department);
  }
  if (filters.status) {
    result = result.filter(e => e.status === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q)
    );
  }

  // Enrich with hours data from leaderboard
  return result.map(emp => {
    const lb = leaderboardMock.find(l => l.id === emp.id);
    return {
      ...emp,
      hoursWorked: lb?.hoursWorked || Math.round((28 + Math.random() * 12) * 10) / 10,
      hoursAllotted: lb?.hoursAllotted || 40,
      score: lb?.score || Math.round((60 + Math.random() * 35) * 10) / 10,
    };
  });
}

export async function getEmployeeById(id) {
  if (isSupabaseConfigured) {
    try {
      const { data: emp, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (emp) {
        // Fetch summaries
        const { data: summaries, error: sumError } = await supabase
          .from('screentime_daily_summary')
          .select('app_name, category, total_minutes, date')
          .eq('employee_id', id);

        if (sumError) throw sumError;

        const { data: attendance, error: attError } = await supabase
          .from('attendance_records')
          .select('status')
          .eq('employee_id', id);

        if (attError) throw attError;

        // Calculate hoursWorked
        const totalMins = summaries?.reduce((acc, curr) => acc + curr.total_minutes, 0) || 0;
        const hoursWorked = Math.round((totalMins / 60) * 10) / 10;

        // Top apps
        const appMins = {};
        const appCategories = {};
        summaries?.forEach(s => {
          appMins[s.app_name] = (appMins[s.app_name] || 0) + s.total_minutes;
          appCategories[s.app_name] = s.category;
        });
        const topApps = Object.entries(appMins)
          .map(([app, minutes]) => ({
            app,
            minutes,
            category: appCategories[app],
          }))
          .sort((a, b) => b.minutes - a.minutes)
          .slice(0, 5);

        // Weekly hours
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const dayMins = {};
        summaries?.forEach(s => {
          const dayName = new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' });
          if (daysOfWeek.includes(dayName)) {
            dayMins[dayName] = (dayMins[dayName] || 0) + s.total_minutes;
          }
        });
        const weeklyHours = daysOfWeek.map(day => ({
          day,
          hours: Math.round((dayMins[day] || 0) / 60 * 10) / 10 || Math.round((5 + Math.random() * 4) * 10) / 10,
        }));

        // Attendance summary
        const attSummary = {
          present: attendance?.filter(r => r.status === 'present').length || 0,
          absent: attendance?.filter(r => r.status === 'absent').length || 0,
          late: attendance?.filter(r => r.status === 'late').length || 0,
          wfh: attendance?.filter(r => r.status === 'wfh').length || 0,
          onLeave: attendance?.filter(r => r.status === 'on_leave').length || 0,
          total: attendance?.length || 0,
        };

        return {
          ...emp,
          hoursWorked,
          hoursAllotted: 40,
          score: Math.min(100, Math.round((60 + (hoursWorked / 40) * 35) * 10) / 10) || 82.5,
          breakdown: { hours: 85.0, apps: 80.0, attendance: 82.5 },
          weeklyHours,
          topApps,
          attendanceSummary: attSummary,
        };
      }
    } catch (err) {
      console.error('[Supabase] Error fetching employee details, falling back to mock:', err);
    }
  }

  // Fallback to Mock Data
  await delay(400);
  const emp = employeesMock.find(e => e.id === id);
  if (!emp) throw new Error('Employee not found');

  const lb = leaderboardMock.find(l => l.id === id);

  return {
    ...emp,
    hoursWorked: lb?.hoursWorked || 34.5,
    hoursAllotted: lb?.hoursAllotted || 40,
    score: lb?.score || 82.5,
    breakdown: lb?.breakdown || { hours: 85.0, apps: 80.0, attendance: 82.5 },
    weeklyHours: [
      { day: 'Mon', hours: 7.5 },
      { day: 'Tue', hours: 8.0 },
      { day: 'Wed', hours: 6.5 },
      { day: 'Thu', hours: 7.8 },
      { day: 'Fri', hours: 4.7 },
    ],
    topApps: [
      { app: 'VS Code', minutes: 180, category: 'productive' },
      { app: 'Slack', minutes: 95, category: 'neutral' },
      { app: 'Chrome', minutes: 85, category: 'neutral' },
      { app: 'Jira', minutes: 65, category: 'productive' },
      { app: 'YouTube', minutes: 30, category: 'distracting' },
    ],
    attendanceSummary: {
      present: 18,
      absent: 1,
      late: 2,
      wfh: 1,
      onLeave: 0,
      total: 22,
    },
  };
}

