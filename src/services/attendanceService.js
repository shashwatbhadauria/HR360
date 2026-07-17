/**
 * Attendance data service.
 */
import employeesMock from '@/mocks/employees.json';

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
