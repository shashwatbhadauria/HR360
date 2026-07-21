/**
 * Attendance data service.
 */
import employeesMock from '@/mocks/employees.json';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const STATUSES = ['present', 'present', 'present', 'present', 'late', 'wfh', 'absent', 'on_leave', 'half_day'];

function generateAttendanceForEmployee(emp, days = 30) {
  const records = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Deterministic-ish status from name hash + date
    const hash = emp.name.length + date.getDate() + i;
    const status = STATUSES[hash % STATUSES.length];

    records.push({
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      date: date.toISOString().split('T')[0],
      status,
      checkIn: status === 'absent' || status === 'on_leave' ? null : `09:${String(hash % 30).padStart(2, '0')}`,
      checkOut: status === 'absent' || status === 'on_leave' ? null : `17:${String(hash % 45).padStart(2, '0')}`,
    });
  }

  return records;
}

let cachedAttendance = null;

function getAllAttendance() {
  if (!cachedAttendance) {
    cachedAttendance = employeesMock.flatMap(emp => generateAttendanceForEmployee(emp));
  }
  return cachedAttendance;
}

export async function getAttendance(filters = {}) {
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('attendance_records')
        .select(`
          id,
          employee_id,
          date,
          status,
          check_in,
          check_out,
          employees!inner (
            name,
            department
          )
        `);

      if (filters.department) {
        query = query.eq('employees.department', filters.department);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.date) {
        query = query.eq('date', filters.date);
      }
      if (filters.dateFrom && filters.dateTo) {
        query = query.gte('date', filters.dateFrom).lte('date', filters.dateTo);
      }

      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;

      if (data) {
        return data.map(r => ({
          id: r.id,
          employeeId: r.employee_id,
          employeeName: r.employees?.name,
          department: r.employees?.department,
          date: r.date,
          status: r.status,
          checkIn: r.check_in ? r.check_in.substring(0, 5) : null,
          checkOut: r.check_out ? r.check_out.substring(0, 5) : null,
        }));
      }
    } catch (err) {
      console.error('[Supabase] Error fetching attendance, falling back to mock:', err);
    }
  }

  // Fallback to Mock Data
  await delay(500);
  let result = getAllAttendance();

  if (filters.department) {
    result = result.filter(r => r.department === filters.department);
  }
  if (filters.status) {
    result = result.filter(r => r.status === filters.status);
  }
  if (filters.date) {
    result = result.filter(r => r.date === filters.date);
  }
  if (filters.dateFrom && filters.dateTo) {
    result = result.filter(r => r.date >= filters.dateFrom && r.date <= filters.dateTo);
  }

  return result.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAttendanceSummary() {
  if (isSupabaseConfigured) {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const { data: todayRecords, error } = await supabase
        .from('attendance_records')
        .select('status')
        .eq('date', todayStr);
      
      if (error) throw error;

      // Also get historical rate
      const { data: allRecords, error: allErr } = await supabase
        .from('attendance_records')
        .select('status')
        .limit(1000);

      if (allErr) throw allErr;

      const totalCount = allRecords?.length || 1;
      const presentCount = allRecords?.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'wfh' || r.status === 'half_day').length || 0;
      const attendanceRate = Math.round((presentCount / totalCount) * 1000) / 10;

      return {
        attendanceRate: attendanceRate || 92.1,
        presentToday: todayRecords?.filter(r => r.status === 'present').length || 0,
        absentToday: todayRecords?.filter(r => r.status === 'absent').length || 0,
        lateToday: todayRecords?.filter(r => r.status === 'late').length || 0,
        onLeaveToday: todayRecords?.filter(r => r.status === 'on_leave').length || 0,
        wfhToday: todayRecords?.filter(r => r.status === 'wfh').length || 0,
      };
    } catch (err) {
      console.error('[Supabase] Error fetching attendance summary, falling back to mock:', err);
    }
  }

  // Fallback to Mock Data
  await delay(400);
  const all = getAllAttendance();
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = all.filter(r => r.date === today);

  return {
    attendanceRate: 92.1,
    presentToday: todayRecords.filter(r => r.status === 'present').length,
    absentToday: todayRecords.filter(r => r.status === 'absent').length,
    lateToday: todayRecords.filter(r => r.status === 'late').length,
    onLeaveToday: todayRecords.filter(r => r.status === 'on_leave').length,
    wfhToday: todayRecords.filter(r => r.status === 'wfh').length,
  };
}

