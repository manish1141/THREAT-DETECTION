import React from 'react';

export function SecurityScoreCircle({ score = 86, size = 180, strokeWidth = 14, showSubtext = true }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const offset = circumference - (clamped / 100) * circumference;

  let strokeColor = '#10b981'; // emerald
  let glowColor = 'rgba(16, 185, 129, 0.35)';
  let label = 'PROTECTED';
  let labelColor = 'text-emerald-400';

  if (clamped < 50) {
    strokeColor = '#f43f5e'; // rose
    glowColor = 'rgba(244, 63, 94, 0.4)';
    label = 'CRITICAL';
    labelColor = 'text-rose-400';
  } else if (clamped < 80) {
    strokeColor = '#f59e0b'; // amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
    label = 'ATTENTION';
    labelColor = 'text-amber-400';
  }

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0 0 10px ${glowColor})`
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {clamped}
          </span>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {showSubtext && (
        <div className="mt-3 text-center">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border tracking-wider uppercase ${labelColor} border-current/25 bg-current/5`}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
