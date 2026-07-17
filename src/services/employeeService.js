/**
 * Employee data service.
 */
import employeesMock from '@/mocks/employees.json';
import leaderboardMock from '@/mocks/leaderboard.json';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getEmployees(filters = {}) {
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
