interface SparklineProps {
  points: number[];
  width?: number;
  height?: number;
}

export const Sparkline = ({ points, width = 200, height = 60 }: SparklineProps) => {
  if (!points.length) {
    return <div className="text-xs text-slate-500">No data</div>;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const normalized = points.map((point, index) => {
    const divisor = points.length > 1 ? points.length - 1 : 1;
    const x = (index / divisor) * width;
    const y = height - ((point - min) / range) * height;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={normalized.join(' ')}
      />
    </svg>
  );
};

