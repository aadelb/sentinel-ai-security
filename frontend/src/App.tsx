import { useState, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ScanForm from './components/ScanForm';
import ScanResults from './components/ScanResults';
import AttackVectorList from './components/AttackVectorList';
import type { ScanResult } from './types';

function Header() {
  const location = useLocation();

  return (
    <header className="border-b border-sentinel-border bg-sentinel-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/50">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">SENTINEL</h1>
              <p className="text-xs text-gray-500">AI Security Tester</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-sentinel-red' : 'text-gray-400 hover:text-white'
              }`}
            >
              New Scan
            </Link>
            <Link
              to="/vectors"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/vectors' ? 'text-sentinel-red' : 'text-gray-400 hover:text-white'
              }`}
            >
              Attack Vectors
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function HomePage() {
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);

  const handleScanStarted = useCallback((scan: ScanResult) => {
    setActiveScan(scan);
  }, []);

  const handleScanComplete = useCallback(() => {
    // Keep showing results after completion
  }, []);

  const handleNewScan = useCallback(() => {
    setActiveScan(null);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!activeScan ? (
        <>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">AI Security</span>{' '}
              <span className="text-white">Testing Platform</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Test your AI models against prompt injection, jailbreaking, and other adversarial attacks.
              Identify vulnerabilities before attackers do.
            </p>
          </div>
          <ScanForm onScanStarted={handleScanStarted} />
        </>
      ) : (
        <ScanResults
          scan={activeScan}
          onScanUpdate={setActiveScan}
          onComplete={handleScanComplete}
          onNewScan={handleNewScan}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-sentinel-darker">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-800/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vectors" element={<AttackVectorList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
