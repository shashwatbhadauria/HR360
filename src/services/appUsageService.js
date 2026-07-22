/**
 * App usage data service.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

export async function getOrgAppUsage() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('screentime_daily_summary')
        .select('app_name, category, total_minutes, employee_id')
        .order('date', { ascending: false })
        .limit(2000);
      if (error) throw error;

      if (data && data.length > 0) {
        const usageMap = {};
        data.forEach(s => {
          if (!usageMap[s.app_name]) {
            usageMap[s.app_name] = {
              app: s.app_name,
              category: s.category,
              totalMinutes: 0,
              activeUsers: new Set(),
            };
          }
          usageMap[s.app_name].totalMinutes += s.total_minutes;
          usageMap[s.app_name].activeUsers.add(s.employee_id);
        });

        return Object.values(usageMap)
          .map(item => ({
            app: item.app,
            category: item.category,
            totalMinutes: item.totalMinutes,
            activeUsers: item.activeUsers.size,
            trend: 0, 
          }))
          .sort((a, b) => b.totalMinutes - a.totalMinutes);
      }
    } catch (err) {
      console.error('[Supabase] Error fetching org app usage:', err);
    }
  }
  return [];
}

export async function getCategoryTrend() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('screentime_daily_summary')
        .select('date, category, total_minutes')
        .order('date', { ascending: false })
        .limit(2000);
      if (error) throw error;

      if (data && data.length > 0) {
        const trendMap = {};
        data.forEach(s => {
          const dateStr = new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
          if (!trendMap[dateStr]) {
            trendMap[dateStr] = { week: dateStr, productive: 0, neutral: 0, distracting: 0, _rawDate: s.date };
          }
          const cat = s.category.toLowerCase();
          if (cat === 'productive' || cat === 'neutral' || cat === 'distracting') {
            trendMap[dateStr][cat] += Math.round(s.total_minutes / 60 * 10) / 10;
          }
        });

        return Object.values(trendMap).sort((a, b) => new Date(a._rawDate) - new Date(b._rawDate));
      }
    } catch (err) {
      console.error('[Supabase] Error fetching category trend:', err);
    }
  }
  return [];
}

export async function getEmployeeAppUsage(employeeId) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('screentime_daily_summary')
        .select('app_name, category, total_minutes')
        .eq('employee_id', employeeId)
        .order('date', { ascending: false })
        .limit(1000);
      if (error) throw error;

      if (data && data.length > 0) {
        const usageMap = {};
        data.forEach(s => {
          if (!usageMap[s.app_name]) {
            usageMap[s.app_name] = {
              app: s.app_name,
              category: s.category,
              totalMinutes: 0,
            };
          }
          usageMap[s.app_name].totalMinutes += s.total_minutes;
        });

        return Object.values(usageMap)
          .map(item => ({
            app: item.app,
            category: item.category,
            totalMinutes: item.totalMinutes,
            trend: 0,
          }))
          .sort((a, b) => b.totalMinutes - a.totalMinutes);
      }
    } catch (err) {
      console.error('[Supabase] Error fetching employee app usage:', err);
    }
  }
  return [];
}

