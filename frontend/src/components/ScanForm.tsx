import { useState, useEffect } from 'react';
import { startScan, getAttackVectors, getScanStatus } from '../api';
import type { ScanResult, AttackVector } from '../types';

interface ScanFormProps {
  onScanStarted: (scan: ScanResult) => void;
}

export default function ScanForm({ onScanStarted }: ScanFormProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [targetModel, setTargetModel] = useState('gpt-4');
  const [apiKey, setApiKey] = useState('');
  const [attackVectors, setAttackVectors] = useState<AttackVector[]>([]);
  const [selectedVectors, setSelectedVectors] = useState<Set<string>>(new Set());
  const [customPrompts, setCustomPrompts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadAttackVectors();
  }, []);

  async function loadAttackVectors() {
    try {
      const vectors = await getAttackVectors();
      setAttackVectors(vectors);
      // Select all vectors by default
      setSelectedVectors(new Set(vectors.map((v) => v.id)));
    } catch (err) {
      console.error('Failed to load attack vectors:', err);
    }
  }

  function toggleVector(id: string) {
    setSelectedVectors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectAllVectors() {
    setSelectedVectors(new Set(attackVectors.map((v) => v.id)));
  }

  function deselectAllVectors() {
    setSelectedVectors(new Set());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!targetUrl.trim()) {
      setError('Please enter a target URL');
      return;
    }

    if (selectedVectors.size === 0) {
      setError('Please select at least one attack vector');
      return;
    }

    setIsLoading(true);

    try {
      const { scanId } = await startScan({
        targetUrl: targetUrl.trim(),
        targetModel,
        attackVectors: Array.from(selectedVectors),
        apiKey: apiKey.trim() || undefined,
        customPrompts: customPrompts.trim()
          ? customPrompts.split('\n').filter((p) => p.trim())
          : undefined,
      });

      // Fetch initial scan status
      const scan = await getScanStatus(scanId);
      onScanStarted(scan);
    } catch (err) {
      console.error('Failed to start scan:', err);
      setError('Failed to start scan. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const severityColors: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-sentinel-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Configure Security Scan
        </h3>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Target URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target API Endpoint
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://api.example.com/v1/chat/completions"
              className="input-field"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              The API endpoint of the AI model you want to test
            </p>
          </div>

          {/* Target Model */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Model
            </label>
            <select
              value={targetModel}
              onChange={(e) => setTargetModel(e.target.value)}
              className="input-field"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              <option value="gemini-pro">Gemini Pro</option>
              <option value="llama-3">Llama 3</option>
              <option value="custom">Custom Model</option>
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key
              <span className="text-gray-500 font-normal ml-2">(optional)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="input-field"
            />
            <p className="mt-1 text-xs text-gray-500">
              Required if the target API needs authentication
            </p>
          </div>

          {/* Attack Vectors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Attack Vectors
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllVectors}
                  className="text-xs text-sentinel-red hover:text-red-400"
                >
                  Select All
                </button>
                <span className="text-gray-600">|</span>
                <button
                  type="button"
                  onClick={deselectAllVectors}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {attackVectors.map((vector) => (
                <label
                  key={vector.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedVectors.has(vector.id)
                      ? 'bg-sentinel-red/10 border-sentinel-red/50'
                      : 'bg-sentinel-darker border-sentinel-border hover:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedVectors.has(vector.id)}
                    onChange={() => toggleVector(vector.id)}
                    className="mt-1 rounded border-gray-600 bg-sentinel-darker text-sentinel-red focus:ring-sentinel-red focus:ring-offset-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {vector.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${severityColors[vector.severity]}`}
                      >
                        {vector.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {vector.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Advanced Options
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-sentinel-darker rounded-lg border border-sentinel-border">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Prompts
                  <span className="text-gray-500 font-normal ml-2">(one per line)</span>
                </label>
                <textarea
                  value={customPrompts}
                  onChange={(e) => setCustomPrompts(e.target.value)}
                  placeholder="Enter custom attack prompts..."
                  rows={4}
                  className="input-field font-mono text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 min-w-[160px] justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                Starting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Start Scan
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
