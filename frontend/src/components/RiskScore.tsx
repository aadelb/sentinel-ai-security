import { useMemo } from 'react';

interface RiskScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function RiskScore({ score, size = 'md', showLabel = true }: RiskScoreProps) {
  const normalizedScore = Math.min(100, Math.max(0, score));

  const { color, label, bgColor } = useMemo(() => {
    if (normalizedScore >= 80) {
      return { color: '#dc2626', label: 'Critical', bgColor: 'rgba(220, 38, 38, 0.1)' };
    } else if (normalizedScore >= 60) {
      return { color: '#f97316', label: 'High', bgColor: 'rgba(249, 115, 22, 0.1)' };
    } else if (normalizedScore >= 40) {
      return { color: '#eab308', label: 'Medium', bgColor: 'rgba(234, 179, 8, 0.1)' };
    } else if (normalizedScore >= 20) {
      return { color: '#22c55e', label: 'Low', bgColor: 'rgba(34, 197, 94, 0.1)' };
    } else {
      return { color: '#3b82f6', label: 'Minimal', bgColor: 'rgba(59, 130, 246, 0.1)' };
    }
  }, [normalizedScore]);

  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm':
        return { width: 80, height: 80, strokeWidth: 6, fontSize: 'text-lg' };
      case 'lg':
        return { width: 200, height: 200, strokeWidth: 12, fontSize: 'text-5xl' };
      default:
        return { width: 140, height: 140, strokeWidth: 10, fontSize: 'text-3xl' };
    }
  }, [size]);

  const radius = (dimensions.width - dimensions.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* Background circle */}
        <svg
          className="absolute inset-0 transform -rotate-90"
          width={dimensions.width}
          height={dimensions.height}
        >
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={radius}
            fill="none"
            stroke="#1f1f2e"
            strokeWidth={dimensions.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={dimensions.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease',
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-full"
          style={{ backgroundColor: bgColor }}
        >
          <span
            className={`${dimensions.fontSize} font-bold`}
            style={{ color }}
          >
            {normalizedScore}
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Risk
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 text-center">
          <span
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color }}
          >
            {label} Risk
          </span>
        </div>
      )}
    </div>
  );
}
