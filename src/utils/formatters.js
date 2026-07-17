/**
 * Formatting utilities — single source of truth for number/date display.
 * Every component must use these instead of inline formatting.
 */

/**
 * Format hours with one decimal place.
 * @param {number} hours
 * @returns {string} e.g. "7.5h"
 */
export function formatHours(hours) {
  if (hours == null || isNaN(hours)) return '—';
  return `${Number(hours).toFixed(1)}h`;
}

/**
 * Format a value as a percentage.
 * @param {number} value - A ratio (0–1) or percentage (0–100).
 * @param {boolean} [isRatio=false] - If true, multiplies by 100 first.
 * @returns {string} e.g. "87.5%"
 */
export function formatPercent(value, isRatio = false) {
  if (value == null || isNaN(value)) return '—';
  const pct = isRatio ? value * 100 : value;
  return `${pct.toFixed(1)}%`;
}

/**
 * Format a date for display.
 * @param {string|Date} date
 * @param {'short'|'long'|'month'} [variant='short']
 * @returns {string}
 */
export function formatDate(date, variant = 'short') {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' },
    month: { month: 'long', year: 'numeric' },
  };

  return d.toLocaleDateString('en-US', options[variant] || options.short);
}

/**
 * Format a timestamp as a relative "last synced" string.
 * @param {string|Date} date
 * @returns {string} e.g. "5 min ago", "2 hours ago"
 */
export function formatTimeAgo(date) {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}

/**
 * Format minutes into "Xh Ym" human-readable duration.
 * @param {number} minutes
 * @returns {string}
 */
export function formatDuration(minutes) {
  if (minutes == null || isNaN(minutes)) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Format a large number with comma separators.
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num == null || isNaN(num)) return '—';
  return Number(num).toLocaleString('en-US');
}

/**
 * Get the utilization status color token based on percentage.
 * @param {number} percent - Utilization percentage (0–100).
 * @returns {'success'|'warning'|'danger'}
 */
export function getUtilizationStatus(percent) {
  if (percent >= 90) return 'success';
  if (percent >= 70) return 'warning';
  return 'danger';
}

/**
 * Truncate text to a maximum length with ellipsis.
 * @param {string} text
 * @param {number} [maxLength=30]
 * @returns {string}
 */
export function truncateText(text, maxLength = 30) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
