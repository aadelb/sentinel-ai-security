import { useEffect, useState } from 'react';
import { getAttackVectors } from '../api';
import type { AttackVector } from '../types';

export default function AttackVectorList() {
  const [vectors, setVectors] = useState<AttackVector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVectors();
  }, []);

  async function loadVectors() {
    try {
      const data = await getAttackVectors();
      setVectors(data);
    } catch (err) {
      console.error('Failed to load attack vectors:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const categories = [...new Set(vectors.map((v) => v.category))];

  const filteredVectors = vectors.filter((v) => {
    const matchesFilter = filter === 'all' || v.category === filter || v.severity === filter;
    const matchesSearch =
      searchQuery === '' ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const severityStyles: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  };

  const severityBorder: Record<string, string> = {
    critical: 'border-l-red-500',
    high: 'border-l-orange-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-blue-500',
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-sentinel-border border-t-sentinel-red animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Attack Vectors</h2>
        <p className="text-gray-400">
          Comprehensive library of AI security attack vectors and testing techniques
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card text-center py-4">
          <div className="text-2xl font-bold text-white">{vectors.length}</div>
          <div className="text-xs text-gray-400 uppercase">Total Vectors</div>
        </div>
        <div className="card text-center py-4 border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-red-400">
            {vectors.filter((v) => v.severity === 'critical').length}
          </div>
          <div className="text-xs text-gray-400 uppercase">Critical</div>
        </div>
        <div className="card text-center py-4 border-l-4 border-l-orange-500">
          <div className="text-2xl font-bold text-orange-400">
            {vectors.filter((v) => v.severity === 'high').length}
          </div>
          <div className="text-xs text-gray-400 uppercase">High</div>
        </div>
        <div className="card text-center py-4 border-l-4 border-l-yellow-500">
          <div className="text-2xl font-bold text-yellow-400">
            {vectors.filter((v) => v.severity === 'medium').length}
          </div>
          <div className="text-xs text-gray-400 uppercase">Medium</div>
        </div>
        <div className="card text-center py-4 border-l-4 border-l-blue-500">
          <div className="text-2xl font-bold text-blue-400">
            {vectors.filter((v) => v.severity === 'low').length}
          </div>
          <div className="text-xs text-gray-400 uppercase">Low</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search attack vectors..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-sentinel-red text-white'
                  : 'bg-sentinel-darker text-gray-400 hover:text-white border border-sentinel-border'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === category
                    ? 'bg-sentinel-red text-white'
                    : 'bg-sentinel-darker text-gray-400 hover:text-white border border-sentinel-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex gap-2">
            {['critical', 'high', 'medium', 'low'].map((severity) => (
              <button
                key={severity}
                onClick={() => setFilter(filter === severity ? 'all' : severity)}
                className={`px-3 py-2 rounded-lg text-xs font-medium uppercase transition-all border ${
                  filter === severity
                    ? severityStyles[severity]
                    : 'bg-sentinel-darker text-gray-400 border-sentinel-border hover:text-white'
                }`}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vector List */}
      <div className="grid gap-4">
        {filteredVectors.map((vector) => (
          <div
            key={vector.id}
            className={`card border-l-4 ${severityBorder[vector.severity]} hover:border-sentinel-red/50 transition-all`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{vector.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border uppercase font-medium ${severityStyles[vector.severity]}`}
                  >
                    {vector.severity}
                  </span>
                  <span className="text-xs bg-sentinel-border px-2 py-1 rounded text-gray-300">
                    {vector.category}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{vector.description}</p>
              </div>

              <div className="flex items-center gap-2">
                {vector.enabled ? (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    Disabled
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredVectors.length === 0 && (
          <div className="card text-center py-12">
            <svg
              className="w-12 h-12 mx-auto text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-400">No attack vectors match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
