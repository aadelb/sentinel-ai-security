export interface Vulnerability {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  attackVector: string;
  prompt: string;
  response?: string;
  mitigation: string;
  cvssScore?: number;
  category: string;
}

export interface ScanResult {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  targetUrl: string;
  targetModel: string;
  progress: number;
  riskScore: number;
  vulnerabilities: Vulnerability[];
  startedAt: string;
  completedAt?: string;
  totalTests: number;
  completedTests: number;
}

export interface AttackVector {
  id: string;
  name: string;
  category: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
}

export interface ScanRequest {
  targetUrl: string;
  targetModel: string;
  attackVectors: string[];
  apiKey?: string;
  customPrompts?: string[];
}

export interface ReportData {
  scan: ScanResult;
  generatedAt: string;
  summary: {
    totalVulnerabilities: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
  };
  recommendations: string[];
}
