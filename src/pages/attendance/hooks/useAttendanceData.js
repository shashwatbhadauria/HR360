import { useState, useEffect } from 'react';
import { getAttendance, getAttendanceSummary } from '@/services/attendanceService';

export default function useAttendanceData() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setIsLoading(true);
        const [attendanceData, summaryData] = await Promise.all([
          getAttendance(filters),
          getAttendanceSummary(),
        ]);
        if (!cancelled) {
          setRecords(attendanceData);
          setSummary(summaryData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [filters]);

  return { records, summary, isLoading, error, filters, setFilters };
}
