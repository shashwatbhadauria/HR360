/**
 * Settings service — allotted hours, app categories, alert thresholds.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let settingsState = {
  allottedHours: {
    default: 8,
    overrides: [
      { department: 'Engineering', hours: 8 },
      { department: 'Sales', hours: 7.5 },
    ],
  },
  appCategories: [
    { app: 'VS Code', category: 'productive' },
    { app: 'Figma', category: 'productive' },
    { app: 'Jira', category: 'productive' },
    { app: 'GitHub', category: 'productive' },
    { app: 'Google Docs', category: 'productive' },
    { app: 'Slack', category: 'neutral' },
    { app: 'Zoom', category: 'neutral' },
    { app: 'Chrome', category: 'neutral' },
    { app: 'YouTube', category: 'distracting' },
    { app: 'Twitter/X', category: 'distracting' },
    { app: 'Reddit', category: 'distracting' },
  ],
  alertThresholds: {
    lowUtilization: 70,
    criticalUtilization: 60,
    consecutiveDays: 3,
  },
};

export async function getSettings() {
  await delay(400);
  return { ...settingsState };
}

export async function updateSettings(updates) {
  await delay(500);
  settingsState = { ...settingsState, ...updates };
  return settingsState;
}
