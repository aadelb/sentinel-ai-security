import { useEffect, useState, useCallback } from 'react';
import { getScanStatus, generateReport } from '../api';
import type { ScanResult, Vulnerability } from '../types';
import RiskScore from './RiskScore';

interface ScanResultsProps {
  scan: ScanResult;
  onScanUpdate: (scan: ScanResult) => void;
  onComplete: () => void;
  onNewScan: () => void;
}

function VulnerabilityCard({ vulnerability }: { vulnerability: Vulnerability }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const severityStyles: Record<string, string> = {
    critical: 'vulnerability-critical',
    high: 'vulnerability-high',
    medium: 'vulnerability-medium',
    low: 'vulnerability-low',
  };

  const severityBadgeStyles: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  };

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(vulnerability.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  return (
    <div className={`card ${severityStyles[vulnerability.severity]} transition-all`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-lg font-semibold text-white">{vulnerability.name}</h4>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border uppercase font-medium ${severityBadgeStyles[vulnerability.severity]}`}
            >
              {vulnerability.severity}
            </span>
            {vulnerability.cvssScore && (
              <span className="text-xs text-gray-500">
                CVSS: {vulnerability.cvssScore.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-3">{vulnerability.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-sentinel-border px-2 py-1 rounded text-gray-300">
              {vulnerability.category}
            </span>
            <span className="text-xs bg-sentinel-border px-2 py-1 rounded text-gray-300">
              {vulnerability.attackVector}
            </span>
          </div>
        </div>

        <button
          onClick={copyPrompt}
          className="btn-secondary text-xs flex items-center gap-1.5 whitespace-nowrap"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Prompt
            </>
          )}
        </button>
      </div>

      {/* Attack Prompt */}
      <div className="mt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-2"
        >
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {expanded ? 'Hide' : 'Show'} Attack Details
        </button>

        {expanded && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                Attack Prompt
              </label>
              <pre className="bg-sentinel-darker p-3 rounded-lg text-xs text-gray-300 overflow-x-auto font-mono whitespace-pre-wrap">
                {vulnerability.prompt}
              </pre>
            </div>

            {vulnerability.response && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                  Model Response
                </label>
                <pre className="bg-sentinel-darker p-3 rounded-lg text-xs text-gray-300 overflow-x-auto font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {vulnerability.response}
                </pre>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                Mitigation
              </label>
              <p className="text-sm text-gray-400">{vulnerability.mitigation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScanResults({
  scan,
  onScanUpdate,
  onComplete,
  onNewScan,
}: ScanResultsProps) {
  const [isPolling, setIsPolling] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const pollStatus = useCallback(async () => {
    try {
      const updatedScan = await getScanStatus(scan.id);
      onScanUpdate(updatedScan);

      if (updatedScan.status === 'completed' || updatedScan.status === 'failed') {
        setIsPolling(false);
        onComplete();
      }
    } catch (err) {
      console.error('Failed to poll scan status:', err);
    }
  }, [scan.id, onScanUpdate, onComplete]);

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [isPolling, pollStatus]);

  async function handleGenerateReport() {
    setIsGeneratingReport(true);
    try {
      const report = await generateReport(scan.id);
      // Create and download the report
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sentinel-report-${scan.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400',
    running: 'text-blue-400',
    completed: 'text-green-400',
    failed: 'text-red-400',
  };

  const criticalCount = scan.vulnerabilities.filter((v) => v.severity === 'critical').length;
  const highCount = scan.vulnerabilities.filter((v) => v.severity === 'high').length;
  const mediumCount = scan.vulnerabilities.filter((v) => v.severity === 'medium').length;
  const lowCount = scan.vulnerabilities.filter((v) => v.severity === 'low').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Scan Results</h2>
          <p className="text-sm text-gray-400 mt-1">
            Target: <span className="text-gray-300">{scan.targetUrl}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {scan.status === 'completed' && (
            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="btn-secondary flex items-center gap-2"
            >
              {isGeneratingReport ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              )}
              Export Report
            </button>
          )}
          <button onClick={onNewScan} className="btn-primary">
            New Scan
          </button>
        </div>
      </div>

      {/* Status & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score */}
        <div className="card flex flex-col items-center justify-center py-8">
          <RiskScore score={scan.riskScore} size="lg" />
        </div>

        {/* Scan Status */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
            Scan Status
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status</span>
              <span className={`font-medium capitalize ${statusColors[scan.status]}`}>
                {scan.status === 'running' && (
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2" />
                )}
                {scan.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">{scan.progress}%</span>
            </div>

            <div className="w-full bg-sentinel-darker rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sentinel-red to-orange-500 transition-all duration-300"
                style={{ width: `${scan.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Tests Completed</span>
              <span className="text-white">
                {scan.completedTests} / {scan.totalTests}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Model</span>
              <span className="text-white">{scan.targetModel}</span>
            </div>
          </div>
        </div>

        {/* Vulnerability Summary */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
            Vulnerabilities Found
          </h3>

          <div className="text-4xl font-bold text-white mb-4">
            {scan.vulnerabilities.length}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
              <div className="text-xs text-gray-400 uppercase">Critical</div>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-400">{highCount}</div>
              <div className="text-xs text-gray-400 uppercase">High</div>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">{mediumCount}</div>
              <div className="text-xs text-gray-400 uppercase">Medium</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">{lowCount}</div>
              <div className="text-xs text-gray-400 uppercase">Low</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerabilities List */}
      {scan.vulnerabilities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-sentinel-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Detected Vulnerabilities
          </h3>

          <div className="space-y-4">
            {scan.vulnerabilities.map((vuln) => (
              <VulnerabilityCard key={vuln.id} vulnerability={vuln} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {scan.status === 'completed' && scan.vulnerabilities.length === 0 && (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-green-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h4 className="text-xl font-semibold text-white mb-2">No Vulnerabilities Found</h4>
          <p className="text-gray-400">
            Great news! The target model passed all security tests.
          </p>
        </div>
      )}

      {/* Scanning Animation */}
      {scan.status === 'running' && (
        <div className="card overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-sentinel-red/5 to-transparent animate-scan-line pointer-events-none" />
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-sentinel-border border-t-sentinel-red animate-spin" />
              </div>
              <div>
                <p className="text-white font-medium">Scanning in progress...</p>
                <p className="text-sm text-gray-400">
                  Testing attack vectors against the target model
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
