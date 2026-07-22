/**
 * Attendance data service.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

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
      console.error('[Supabase] Error fetching attendance:', err);
    }
  }
  return [];
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
        attendanceRate: attendanceRate || 0,
        presentToday: todayRecords?.filter(r => r.status === 'present').length || 0,
        absentToday: todayRecords?.filter(r => r.status === 'absent').length || 0,
        lateToday: todayRecords?.filter(r => r.status === 'late').length || 0,
        onLeaveToday: todayRecords?.filter(r => r.status === 'on_leave').length || 0,
        wfhToday: todayRecords?.filter(r => r.status === 'wfh').length || 0,
      };
    } catch (err) {
      console.error('[Supabase] Error fetching attendance summary:', err);
    }
  }

  return {
    attendanceRate: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    onLeaveToday: 0,
    wfhToday: 0,
  };
}

