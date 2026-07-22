/**
 * Dashboard data service — fetches KPIs, trends, department comparison, and alerts.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

export async function getDashboardSummary() {
  if (isSupabaseConfigured) {
    try {
      const kpis = await getDashboardKpis();
      const hoursTrend = await getHoursTrend();
      const departmentComparison = await getDepartmentComparison();
      const appCategorySplit = await getAppCategorySplit();
      const alerts = await getAlerts();

      // Top employees can be dynamically fetched, but for now we'll just return an empty array if we don't calculate it
      // To calculate it, we'd query the DB for the top performers. 
      return {
        kpis,
        hoursTrend,
        departmentComparison,
        appCategorySplit,
        alerts,
        topEmployees: [], 
      };
    } catch (err) {
      console.error('[Supabase] Error compiling dashboard summary:', err);
    }
  }

  return {
    kpis: await getDashboardKpis(),
    hoursTrend: [],
    departmentComparison: [],
    appCategorySplit: [],
    alerts: [],
    topEmployees: [],
  };
}

export async function getDashboardKpis() {
  if (isSupabaseConfigured) {
    try {
      // 1. Active employees count
      const { count: activeCount, error: empErr } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      if (empErr) throw empErr;

      // 2. Attendance rate
      const { data: attendance, error: attErr } = await supabase
        .from('attendance_records')
        .select('status');
      if (attErr) throw attErr;

      const totalAtt = attendance?.length || 1;
      const presentAtt = attendance?.filter(r => ['present', 'late', 'wfh', 'half_day'].includes(r.status)).length || 0;
      const attendanceRate = Math.round((presentAtt / totalAtt) * 1000) / 10;

      // 3. Avg Utilization (Productivity ratio)
      const { data: summaries, error: sumErr } = await supabase
        .from('screentime_daily_summary')
        .select('category, total_minutes');
      if (sumErr) throw sumErr;

      let productiveMins = 0;
      let totalMins = 0;
      summaries?.forEach(s => {
        totalMins += s.total_minutes;
        if (s.category === 'productive') {
          productiveMins += s.total_minutes;
        }
      });
      const avgUtil = totalMins > 0 ? Math.round((productiveMins / totalMins) * 1000) / 10 : 0;

      // 4. Flagged employees (count of employees with low utilization)
      const { count: flaggedCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive');

      return {
        avgUtilization: { value: avgUtil || 0, previous: 0, suffix: "%" },
        attendanceRate: { value: attendanceRate || 0, previous: 0, suffix: "%" },
        activeEmployees: { value: activeCount || 0, previous: 0, suffix: "" },
        flaggedEmployees: { value: flaggedCount || 0, previous: 0, suffix: "" },
      };
    } catch (err) {
      console.error('[Supabase] Error fetching dashboard KPIs:', err);
    }
  }

  return {
    avgUtilization: { value: 0, previous: 0, suffix: "%" },
    attendanceRate: { value: 0, previous: 0, suffix: "%" },
    activeEmployees: { value: 0, previous: 0, suffix: "" },
    flaggedEmployees: { value: 0, previous: 0, suffix: "" },
  };
}

export async function getHoursTrend() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('screentime_daily_summary')
        .select('date, total_minutes');
      if (error) throw error;

      if (data && data.length > 0) {
        // Group minutes by date and get average hours per employee
        const dayMinutes = {};
        const dayEmpCounts = {};
        
        data.forEach(s => {
          const dateFormatted = new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
          dayMinutes[dateFormatted] = (dayMinutes[dateFormatted] || 0) + s.total_minutes;
          dayEmpCounts[dateFormatted] = (dayEmpCounts[dateFormatted] || 0) + 1; // approximation
        });

        // Convert to array of { date, hours }
        const trend = Object.keys(dayMinutes).map(date => {
          const totalHours = dayMinutes[date] / 60;
          return {
            date,
            hours: Math.round((totalHours / 10) * 10) / 10 || 0, 
          };
        });

        // Sort by date chronologically
        return trend.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-15);
      }
    } catch (err) {
      console.error('[Supabase] Error fetching hours trend:', err);
    }
  }

  return [];
}

export async function getDepartmentComparison() {
  if (isSupabaseConfigured) {
    try {
      const { data: employees, error: empErr } = await supabase
        .from('employees')
        .select('id, department');
      if (empErr) throw empErr;

      const { data: summaries, error: sumErr } = await supabase
        .from('screentime_daily_summary')
        .select('employee_id, category, total_minutes');
      if (sumErr) throw sumErr;

      if (employees && summaries) {
        // Map employee ID to department
        const empDept = {};
        const deptEmpCounts = {};
        employees.forEach(e => {
          empDept[e.id] = e.department;
          deptEmpCounts[e.department] = (deptEmpCounts[e.department] || 0) + 1;
        });

        // Group screen time by department
        const deptProd = {};
        const deptTotal = {};
        summaries.forEach(s => {
          const dept = empDept[s.employee_id];
          if (dept) {
            deptTotal[dept] = (deptTotal[dept] || 0) + s.total_minutes;
            if (s.category === 'productive') {
              deptProd[dept] = (deptProd[dept] || 0) + s.total_minutes;
            }
          }
        });

        return Object.keys(deptEmpCounts).map(dept => {
          const total = deptTotal[dept] || 0;
          const prod = deptProd[dept] || 0;
          const utilization = total > 0 ? Math.round((prod / total) * 1000) / 10 : 0;
          return {
            department: dept,
            utilization,
            employees: deptEmpCounts[dept] || 1,
          };
        });
      }
    } catch (err) {
      console.error('[Supabase] Error fetching department comparison:', err);
    }
  }

  return [];
}

export async function getAppCategorySplit() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('screentime_daily_summary')
        .select('category, total_minutes');
      if (error) throw error;

      if (data && data.length > 0) {
        let productive = 0;
        let neutral = 0;
        let distracting = 0;

        data.forEach(s => {
          if (s.category === 'productive') productive += s.total_minutes;
          else if (s.category === 'neutral') neutral += s.total_minutes;
          else if (s.category === 'distracting') distracting += s.total_minutes;
        });

        const total = productive + neutral + distracting;
        if (total > 0) {
          return [
            { category: "Productive", value: Math.round((productive / total) * 100), color: "#16A34A" },
            { category: "Neutral", value: Math.round((neutral / total) * 100), color: "#2563EB" },
            { category: "Distracting", value: Math.round((distracting / total) * 100), color: "#D97706" },
          ];
        }
      }
    } catch (err) {
      console.error('[Supabase] Error fetching app category split:', err);
    }
  }

  return [];
}

export async function getAlerts() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;
      if (data) {
        return data.map(a => ({
          id: a.id,
          type: a.type,
          message: a.message,
          timestamp: a.timestamp,
          read: a.read,
        }));
      }
    } catch (err) {
      console.error('[Supabase] Error fetching alerts:', err);
    }
  }

  return [];
}

