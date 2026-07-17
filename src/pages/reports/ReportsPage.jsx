import { useState, useEffect } from 'react';
import { FileBarChart, Download, Eye, FileText, Table } from 'lucide-react';
import { motion } from 'framer-motion';
import PageContainer from '@/components/shared/layout/PageContainer';
import Card from '@/components/shared/ui/Card';
import Button from '@/components/shared/ui/Button';
import StatusBadge from '@/components/shared/ui/StatusBadge';
import EmptyState from '@/components/shared/ui/EmptyState';
import { SkeletonTable } from '@/components/shared/ui/Skeleton';
import { formatDate } from '@/utils/formatters';
import { DEPARTMENTS } from '@/utils/constants';
import { getReportHistory, generateReport } from '@/services/reportsService';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Builder form state
  const [scope, setScope] = useState('Organization');
  const [format, setFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState('Last 30 days');

  useEffect(() => {
    async function load() {
      const data = await getReportHistory();
      setReports(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const report = await generateReport({ scope, format, dateRange });
      setReports(prev => [report, ...prev]);
      toast.success('Report generated successfully');
    } catch {
      toast.error('Failed to generate report');
    }
    setIsGenerating(false);
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          {/* Report builder */}
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileBarChart size={20} style={{ color: 'var(--color-brand)' }} />
              Generate Report
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Scope</label>
                <select value={scope} onChange={(e) => setScope(e.target.value)} style={selectStyle}>
                  <option>Organization</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  <option>Individual</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Date Range</label>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={selectStyle}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This Quarter</option>
                  <option>Custom</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Format</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['PDF', 'CSV'].map(f => (
                    <Button
                      key={f}
                      size="sm"
                      variant={format === f ? 'primary' : 'secondary'}
                      onClick={() => setFormat(f)}
                      icon={f === 'PDF' ? <FileText size={14} /> : <Table size={14} />}
                    >
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <Button onClick={handleGenerate} disabled={isGenerating} icon={<FileBarChart size={16} />}>
                  {isGenerating ? 'Generating…' : 'Generate Report'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Preview placeholder */}
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} style={{ color: 'var(--color-brand)' }} />
              Preview
            </h3>
            <EmptyState
              title="Report preview"
              description="Generate a report to see a preview before downloading."
              style={{ padding: '40px 0' }}
            />
          </Card>
        </div>

        {/* Report history */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Report History</h3>
          {isLoading ? (
            <SkeletonTable rows={4} cols={4} />
          ) : reports.length === 0 ? (
            <EmptyState title="No reports yet" description="Generate your first report using the builder above." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <FileText size={20} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{report.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {report.scope} · {report.dateRange} · {formatDate(report.createdAt)}
                    </div>
                  </div>
                  <StatusBadge status="success" label={report.format} size="sm" />
                  <Button size="sm" variant="ghost" icon={<Download size={14} />}>
                    Download
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-text-primary)',
};
