import { useState } from 'react';

/**
 * Reusable data table with sticky header, border-bottom rows, hover tint.
 * Per design-strategy: zebra-free, border-bottom only, avatar+name as first column.
 */
export default function DataTable({
  columns,
  data = [],
  onRowClick,
  emptyMessage = 'No data available',
  style = {},
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  if (!data.length) {
    return (
      <div style={{
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        fontSize: '14px',
        ...style,
      }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{
      overflowX: 'auto',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      ...style,
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
      }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                style={{
                  position: 'sticky',
                  top: 0,
                  padding: '12px 16px',
                  textAlign: col.align || 'left',
                  fontWeight: 600,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#FFFFFF',
                  background: '#00B4D8',
                  borderBottom: 'none',
                  cursor: col.sortable !== false ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  width: col.width || 'auto',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {col.label}
                  {sortKey === col.key && (
                    <span style={{ fontSize: '10px' }}>
                      {sortDir === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    textAlign: col.align || 'left',
                    whiteSpace: col.nowrap ? 'nowrap' : 'normal',
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
