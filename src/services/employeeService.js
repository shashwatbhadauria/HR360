/**
 * Employee data service.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

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
            hoursWorked: hoursWorked || 0,
            hoursAllotted: 40,
            score: Math.min(100, Math.round((60 + (hoursWorked / 40) * 35) * 10) / 10) || 0,
          };
        });
      }
    } catch (err) {
      console.error('[Supabase] Error fetching employees:', err);
    }
  }

  return [];
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
          hours: Math.round((dayMins[day] || 0) / 60 * 10) / 10 || 0,
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
          score: Math.min(100, Math.round((60 + (hoursWorked / 40) * 35) * 10) / 10) || 0,
          breakdown: { hours: 0, apps: 0, attendance: 0 },
          weeklyHours,
          topApps,
          attendanceSummary: attSummary,
        };
      }
    } catch (err) {
      console.error('[Supabase] Error fetching employee details:', err);
    }
  }

  throw new Error('Employee not found');
}

