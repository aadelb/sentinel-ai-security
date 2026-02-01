import axios from 'axios';
import type { ScanRequest, ScanResult, AttackVector, ReportData } from './types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function startScan(request: ScanRequest): Promise<{ scanId: string }> {
  const response = await api.post('/scan', request);
  return response.data;
}

export async function getScanStatus(scanId: string): Promise<ScanResult> {
  const response = await api.get(`/scan/${scanId}`);
  return response.data;
}

export async function getAttackVectors(): Promise<AttackVector[]> {
  const response = await api.get('/attack-vectors');
  return response.data;
}

export async function generateReport(scanId: string): Promise<ReportData> {
  const response = await api.get(`/report/${scanId}`);
  return response.data;
}

export default api;
