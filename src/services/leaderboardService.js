/**
 * Leaderboard data service.
 */
import leaderboardMock from '@/mocks/leaderboard.json';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getLeaderboard(filters = {}) {
  await delay(500);
  let result = [...leaderboardMock];

  if (filters.department) {
    result = result.filter(e => e.department === filters.department);
  }

  // Re-rank after filtering
  return result.map((item, i) => ({ ...item, rank: i + 1 }));
}
