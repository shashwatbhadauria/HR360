import { useState, useEffect } from 'react';
import { getDashboardSummary } from '@/services/dashboardService';

/**
 * Dashboard data hook — owns all loading/error/data state for the dashboard page.
 */
export default function useDashboardData() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getDashboardSummary();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load dashboard data');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { data, isLoading, error };
}
