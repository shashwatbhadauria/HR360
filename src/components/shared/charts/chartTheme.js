/**
 * Shared Recharts theme — consistent axis styling, colors, tooltips.
 * Pulls from design tokens so charts always match the app.
 */

export const CHART_COLORS = {
  brand: '#4F46E5',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#2563EB',
  neutral: '#6B7280',
  purple: '#7C3AED',
  pink: '#DB2777',
  cyan: '#0891B2',
  orange: '#EA580C',
};

// Standard color palette for multi-series charts
export const CHART_PALETTE = [
  CHART_COLORS.brand,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
  CHART_COLORS.cyan,
  CHART_COLORS.orange,
  CHART_COLORS.danger,
  CHART_COLORS.neutral,
];

// App category chart colors
export const APP_CATEGORY_CHART_COLORS = {
  productive: CHART_COLORS.success,
  neutral: CHART_COLORS.info,
  distracting: CHART_COLORS.warning,
};

// Consistent axis props
export const AXIS_STYLE = {
  tick: {
    fontSize: 12,
    fill: '#6B7280',
    fontFamily: 'Inter, sans-serif',
  },
  axisLine: {
    stroke: '#E5E7EB',
  },
  tickLine: false,
};

export const GRID_STYLE = {
  strokeDasharray: 'none',
  stroke: '#E5E7EB',
  strokeOpacity: 0.5,
  vertical: false,
};

// Tooltip wrapper style
export const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '12px 16px',
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  },
  labelStyle: {
    fontWeight: 600,
    color: '#111827',
    marginBottom: '4px',
  },
  itemStyle: {
    color: '#6B7280',
    fontSize: '12px',
  },
  cursor: {
    fill: 'rgba(79, 70, 229, 0.05)',
  },
};

export const LEGEND_STYLE = {
  wrapperStyle: {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
  },
};
